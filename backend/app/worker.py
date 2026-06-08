from dotenv import load_dotenv
load_dotenv()
import asyncio
from celery import Celery
from fastapi import WebSocket
import json
from pathlib import Path
from app.database import get_db
from app.models.portfolio_models.portfolios import Portfolios # Note for later : why imported ? even if it's not used?
from app.models.user_financial_data import UserFinancialData  # Note for later : why imported ? even if it's not used?
from app.models.debt_models.debts_advices import DebtsAdvices # Note for later :  why imported ? even if it's not used?
from app.models.debt_models.debts_metrics import DebtMetrics  #  Note for later : why imported ? even if it's not used?
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics # Note for later : why imported ? even if it's not used?
from app.models.registration.user import User  # Note for later : why imported ? even if it's not used?
from app.models.goal_models.goals import Goal   # Note for later : why imported ? even if it's not used?
from app.models.goal_models.goal_analysis import GoalAnalysis # Note for later : why imported ? even if it's not used?
from app.models.goal_models.goal_Plan_step import GoalPlanStep# Note for later : why imported ? even if it's not used?
from app.core.dependencies import get_current_user
from datetime import datetime, timezone
import yfinance as yf
import pandas as pd
from typing import TypedDict
import redis
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: int, data: dict):
        websocket = self.active_connections.get(user_id)
        print(self.active_connections) # I added this line just now, then I saw the following output [WARNING:  WatchFiles detected changes in 'app/worker.py'. Reloading...INFO:     Shutting down,INFO:     connection closed,INFO:     Waiting for background tasks to complete. (CTRL+C to force quit)]
        if websocket:
            await websocket.send_json(data)

manager = ConnectionManager() 

#used by 'monitor_user' function
async def rebalancing_logic(current_user_id: int)->None:     
    BASE_DIR = Path(__file__).resolve().parent   
    file_path = BASE_DIR / "sector_mapper.txt"
    with open(file_path, 'r') as f:
        sector_mapper:dict[str,str]=json.load(f)
    # get the  target allocation of each asset from the database.
    generator=get_db()
    session=next(generator)   
    portfolio_metrics = session.query(
    PortfoliosPerformanceMetrics
    ).filter(
        PortfoliosPerformanceMetrics.user_id == current_user_id
    ).first()
    choosen_portfolio_id = portfolio_metrics.portfolio_id

    rows :list[Portfolios] = session.query(Portfolios).filter(
        Portfolios.portfolio_id == choosen_portfolio_id
    ).all()

    # calculating the target allocation for each sector
    target_assets:list[str]=[row.asset_name for row in rows]
    quantities:list[int]=[row.quantity for row in rows]
    target_allocations:list[float]=[float(row.capital_allocation_percentage) for row in rows] 
    target_assets_allocation=pd.Series({asset:allocation for asset,allocation in zip(target_assets,target_allocations)}).rename_axis("asset").rename("allocation")
    filtered_sector_mapper=pd.Series({asset:sector for asset,sector in sector_mapper.items() if asset in target_assets}).rename_axis("asset").rename("sector")
    target_sectors_allocations= pd.concat([filtered_sector_mapper,target_assets_allocation],axis=1).groupby("sector").sum()
    
    latest_prices = yf.download(
                    target_assets,
                    period="5d",
                    auto_adjust=True,
                    threads=True,
                )["Close"].iloc[-2]    
    current_values = pd.Series(
    {
        asset: qty * latest_prices[asset]
        for asset, qty in zip(target_assets, quantities)
    }
).sort_index()
    actual_assets_allocations = (
    current_values / current_values.sum()
).rename("allocation")
    
    actual_sectors_allocations= pd.concat([filtered_sector_mapper,actual_assets_allocations],axis=1).groupby("sector").sum()
    drift=(target_sectors_allocations-actual_sectors_allocations).abs()
    
    
    drifting_sectors= drift.loc[drift["allocation"]>=0.05]
    if not drifting_sectors.empty:
        
        total_portfolio_value = current_values.sum()
        drifting_sectors_names = drifting_sectors.index.tolist()
        trade_orders = []
        assets_in_drifting_sectors= filtered_sector_mapper[filtered_sector_mapper.isin(drifting_sectors_names)].index.tolist()
        for asset in assets_in_drifting_sectors:
            target_value = target_assets_allocation[asset] * total_portfolio_value
            actual_value = current_values[asset]
            value_difference = target_value - actual_value
            shares_to_trade = value_difference / latest_prices[asset]
            if abs(shares_to_trade) > 0:
                trade_orders.append({
                    "assetName": asset,
                    "action": "BUY" if shares_to_trade > 0 else "SELL"
                })
        result = {
            "rebalancingNeedDetectedAt": datetime.now(timezone.utc).strftime("%m/%d/%Y"),
            "tradeOrders": trade_orders
        }
    else:
        result=None
    
    r = redis.Redis(host="localhost", port=6379, db=0)

    r.publish(
        f"user:{current_user_id}",
        json.dumps(result)
    ) 

async def monitor_user(user_id: int):
    while True:
        await rebalancing_logic(user_id)
        await asyncio.sleep(10)


# celery offloads a workload from one process to another.
cel_app = Celery(
    "worker",
    broker="redis://localhost:6379/0", # stores task until they are picked by worker.
    backend="redis://localhost:6379/0" # stores task results.
)

@cel_app.task(name="monitor_user_task")
def monitor_user_task(user_id: int):
    asyncio.run( 
        monitor_user(user_id)
    )


from app.core.finance.portfolio_construction import InvestementsAdviceOrchestrator
from app.core.finance.portfolio_construction import InvestementsAdviceMocks
from app.schemas.questionnaire_schemas import QuestionnaireSubmit
from app.core.finance.portfolio_construction import Asset
from app.database import SessionLocal
#should the run_portfolio_orchestrator be async function in the first place or not ?
@cel_app.task(name="run_portfolio_orchestrator_task") 
def run_portfolio_orchestrator(submitted_data_dict,current_user_id: int)->PortfoliosPerformanceMetrics:
            data = QuestionnaireSubmit(**submitted_data_dict)
            portfolio_advice:InvestementsAdviceMocks = InvestementsAdviceOrchestrator(
                answers_weights=data.subjective_answers_values_and_weights.questions_weights,
                questions_scores=data.subjective_answers_values_and_weights.answers_values,
                total_portfolio_value=data.subjective_answers_values_and_weights.investement_amount
            ).get_investement_advice()
            portfolio_description = PortfoliosPerformanceMetrics(
                user_id=current_user_id,
                expected_annual_return=portfolio_advice.optimalPortfolio.metrics.expectedAnnualReturn,
                annual_volatility=portfolio_advice.optimalPortfolio.metrics.annualVolatility,
                sharpe_ratio=portfolio_advice.optimalPortfolio.metrics.sharpeRatio
            )
            assets: list[Asset] = portfolio_advice.optimalPortfolio.assets
            assets_names = []
            for asset in assets:
                assets_names.append(asset.assetName)
            assets_percentages = []
            for asset in assets:
                assets_percentages.append(asset.capitalAllocationPercentage)
            quantities=[]
            for asset in assets:
                quantities.append(asset.quantity)
            portfolio_description.assets=[Portfolios(asset_name=name,capital_allocation_percentage=percentage,quantity=quantity) for name,percentage,quantity in zip(assets_names,assets_percentages,quantities)]
            db = SessionLocal() 
            try:
                db.add(portfolio_description)
                db.commit()
                print("LAST TASK FINISHED")
            except:
                 # how will this line of code know  for which user it must store to the database ?  
                print("error happend inside the portfolio task")
            finally:
                db.close()
                cel_app.send_task("monitor_user_task", args=[current_user_id])

    