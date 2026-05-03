from dotenv import load_dotenv
load_dotenv()
import json
from pathlib import Path
from app.database import get_db
from app.models.portfolio_models.portfolios import Portfolios
from app.models.user_financial_data import UserFinancialData
from app.models.debt_models.debts_advices import DebtsAdvices
from app.models.debt_models.debts_metrics import DebtMetrics
from app.models.portfolio_models.portfolios_performance_metrics import PortfoliosPerformanceMetrics
from app.models.registration.user import User
from app.core.dependencies import get_current_user
BASE_DIR = Path(__file__).resolve().parent   # normal Python script
file_path = BASE_DIR / "sector_mapper.txt"
with open(file_path, 'r') as f:
    stored_dict:dict[int,str]=json.load(f)

portfolio_id="2f417947-7444-42c8-a1ec-b56015f8a6b4"

generator=get_db() #SQLAlchemy object. 
session=next(generator) 

#even though you only query Portfolios, SQLAlchemy scan all the classes that inherit from base_declarative(), all those classes must be imported.
rows :list[Portfolios] = session.query(Portfolios).filter(
    Portfolios.portfolio_id == portfolio_id
).all()

assets_names=[row.asset_name for row in rows]
assets_allocations=[float(row.capital_allocation_percentage) for row in rows]


# instead of hardcoding the portfolio_id ,let's get the portfolio_id for the specific user, the current user who is using the app
current_user=get_current_user()
print(current_user)
