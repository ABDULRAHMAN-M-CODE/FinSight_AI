from dotenv import load_dotenv
load_dotenv()
import asyncio
from celery import Celery
from fastapi import WebSocket
import yfinance as yf
import json
from pathlib import Path
from app.database import get_db
from app.models.portfolio_models.portfolios import Portfolios
# note 1 even though you only query Portfolios, SQLAlchemy scan all the classes that inherit from base_declarative(), all those classes must be imported.    
from app.models.user_financial_data import UserFinancialData   # note 1 
from app.models.debt_models.debts_advices import DebtsAdvices  # note 1
from app.models.debt_models.debts_metrics import DebtMetrics   # note 1
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics   
from app.models.registration.user import User  # note 1
from datetime import datetime, timezone
import pandas as pd
from typing import TypedDict
class TradeOrder(TypedDict):
    action:str
    assetName:str
class RebalanceResult(TypedDict):
    rebalancingNeedDetectedAt:str
    tradeOrders:list[TradeOrder]
def rebalancing_logic(current_user_id: int)->RebalanceResult|None:
    
    
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
        return result
    else:
        return None