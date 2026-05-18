from dotenv import load_dotenv
load_dotenv()
import asyncio
from celery import Celery
from fastapi import WebSocket
import json
from pathlib import Path
from app.database import get_db
from app.models.portfolio_models.portfolios import Portfolios
from app.models.user_financial_data import UserFinancialData  # Note for later : why imported ? even if it's not used?
from app.models.debt_models.debts_advices import DebtsAdvices # Note for later :  why imported ? even if it's not used?
from app.models.debt_models.debts_metrics import DebtMetrics  #  Note for later : why imported ? even if it's not used?
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics # Note for later : why imported ? even if it's not used?
from app.models.registration.user import User  # Note for later : why imported ? even if it's not used?
from app.core.dependencies import get_current_user
from app.models.goal_models.goals import Goal
from datetime import datetime, timezone
import yfinance as yf
import pandas as pd
from typing import TypedDict
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: int, data: dict):
        websocket = self.active_connections.get(user_id)

        if websocket:
            await websocket.send_json(data)

manager = ConnectionManager() 
""" class TradeOrder(TypedDict):
    action:str
    assetName:str
class RebalanceResult(TypedDict):
    rebalancingNeedDetectedAt:str
    tradeOrders:list[TradeOrder] """

#used by monitor_user function
async def rebalancing_logic(current_user_id: int)->None: # question xx , what should be the type hint for output of this functon ?
    
    
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
    await manager.send_to_user(current_user_id, result)


###############################

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

# Question ZZZ : why to use localhost:6379, not other specification ? why to use  "ws://localhost:8000/ws/rebalancing" in frontend ? why they are not the same?
@cel_app.task(name="monitor_user_task")
def monitor_user_task(user_id: int):
    asyncio.run(
        monitor_user(user_id)
    )