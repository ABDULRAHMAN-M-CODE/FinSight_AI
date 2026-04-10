import pandas as pd
import numpy as np
from pypfopt.expected_returns import mean_historical_return
from pypfopt.discrete_allocation import DiscreteAllocation, get_latest_prices
from collections import OrderedDict
from pandas import DataFrame
from pandas import Series
from typing import Any
from numpy.typing import NDArray
from pypfopt.risk_models import CovarianceShrinkage
from pypfopt.efficient_frontier import EfficientFrontier
import pandas as pd
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel
from typing import TypedDict
import yfinance as yf
from datetime import datetime, timedelta
import time
import json
from abc import ABC, abstractmethod
from pathlib import Path
def get_risk_appetite(questions_scores:list[int], answers_weights:list[int])-> tuple[str,int]:
    
    total_weight = sum(answers_weights)
    total_weighted_score = 0    
    for i in range(len(questions_scores)):
        total_weighted_score += questions_scores[i]*answers_weights[i]
        

    """if total_weight == 0:
        return "Unable to determine risk appetite"  # Handle edge case"""

    average_score = total_weighted_score / total_weight
    max_volatility = 1
    normalized_score = (average_score / 10) * max_volatility 
    if normalized_score <= 0.33333333: 
        risk_appetite = "Conservative"
    
    elif 0.33333334 <= normalized_score <= 0.66666666:
        risk_appetite = "Moderate"
    
    else:
        risk_appetite = "Aggressive"

    return risk_appetite,normalized_score

class PricesData(ABC):
    @abstractmethod
    def get_data(self):
        pass

class ApiOrMockPricesData(PricesData):
    def __init__(self,assets_tickers:list[str],start_date:str,interval:str):
        self.is_default=False
        self.assets_tickers=assets_tickers
        self.start_date=start_date
        self.interval=interval
    
    def safe_download(self,assets_tickers:list[str],start_date:str)->pd.DataFrame|None:
        try:

            end_date = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')
            data = yf.download(
                assets_tickers,
                start=start_date, 
                end=end_date,
                auto_adjust=False,
                threads=True,
                interval=self.interval
            )

            return data if data is not None else None

        except Exception as e:
            print(f"[ERROR] Download failed: {e}")
            return None

    def robust_download(self, max_retries=5)->pd.DataFrame|None:
        for attempt in range(max_retries):
            try:
                data:pd.DataFrame = self.safe_download(self.assets_tickers,self.start_date)#third pass of the start_date variable
                if data is not None and not data.empty:
                    return data
            except Exception as e:
                print(f"[Retry {attempt+1}] {e}")

            time.sleep(2)  # wait before retry
        print("[FAILURE] All retries failed")
        return None

    def get_data(self)->tuple[bool,pd.DataFrame]:
        data:pd.DataFrame = self.robust_download()
        if data is None:
            print("[WARNING] Using fallback data")
            self.is_default=True
            data=pd.read_parquet("historical_prices.parquet")
        return self.is_default,data
    
class MockData(PricesData):
    def __init__(self):
        self.is_default=True

    def get_data(self)->tuple[bool,pd.DataFrame]:
        return self.is_default,pd.read_parquet("historical_prices.parquet")

class HistoricalPricesService:
    """ 
        This class uses the DIP design pattern; the domain logic does not depend on hardcoded input, but depend on interface.
        In other words, this class depend on static and non-volatile entity, which is the interface in this case.
        In other words, higher level policy depends does not depend on lower level policy.
        The higher level policy-the HistoricalPricesService- uses/controls the lower level policy and does not depend on it.
        The lower level policy does depend on a higher level policy-the interface- by implmenting the abstract methods defined inside that interface. 
    """
    def __init__(self, data_source: PricesData):
        self.data_source = data_source
        
    def get_data(self)->tuple[bool,pd.DataFrame]:
        return self.data_source.get_data()


def clean_data(df:pd.DataFrame, nan_percentage:float,fill_max_gap:int=4)->pd.DataFrame:
    """
        this function perform three cleaning phases on a dataframe:
        1- if any column has a lot of missing values, the function will drop this column entirely, if the number of missing values is acceptable, the function drops the records that contains missing data without deleting the whole column.

    Args:
        df (pd.DataFrame): Two Diminsional DataFrame.
        nan_percentage (float): Upper bound for the amount of  missing values.

    Returns:
        pd.DataFrame: table that contains no missing values.
    """
    old_num_rows=df.shape[0]
    print("number of rows, which are prices records, before cleaning is :",old_num_rows)
    
    cols = [col for col in df.columns if (df[col].isna().sum()/df[col].shape[0])>nan_percentage]
    print("\ndeleted columns are : ",cols,"\n")
    df = df.drop(cols, axis=1)
    df.ffill(limit=fill_max_gap,inplace=True)
    df.dropna(inplace=True)
    
    print("numnber of  prices records after cleaning: ",df.shape[0],'\n')
    print(100*df.shape[0]/old_num_rows,"%","of the prices records survived the cleaning, the more the better to keep the observations to be daily observations as possible  \n")
    return df


class ReturnsAndPrices(TypedDict):
    selectedAssetsReturns:pd.DataFrame
    selectedAssetsPrices:pd.DataFrame
def select_assets(
    user_risk_prefrence:float,
    OHLC:str="Close",
    start_date:str="2024-1-1",
    )->ReturnsAndPrices:
    """fetch real-time assets prices data, cleans it from missing values, and picks assets that with acceptable risk .

    Args:
        user_risk_prefrence (float): upperbound of preferred risk; measure of the willingness to hold volatile assets
        OHLC (str, optional): to get prices of assets in differnt time line of the market; when the market "Open", "High", "Low", or "Close". Defaults to "close".. Defaults to "close".
    Returns:
        pd.DataFrame:  The returns(in decimal) for each selected asset over time. negative return values incidcates a drop in the asset price relative to the last observed price.  
    """
    #guard against non-logical risk prefrence using clipping; max controls lower bound, min control upper bound
    user_risk_prefrence = max(0, min(1, user_risk_prefrence))
    
    BASE_DIR = Path(__file__).resolve().parent
    file_path = BASE_DIR / "country_mapper.txt"
    with open(file_path, 'r') as f:
        stored_dict = json.load(f)
        stored_assets_tickers:list[str]=list(stored_dict.keys())
    print("number of current stored assets in the universe is : ",len(stored_assets_tickers),"\n")
    first_service=HistoricalPricesService(ApiOrMockPricesData(
            assets_tickers=stored_assets_tickers, 
            start_date=start_date,
            interval="1d" 
    ))
    
    is_default,prices=first_service.get_data()#this  method call never changes regardless of the underlying implementation ; DIP design pattern.
    print(f"THE DEFAULT REAL-TIME PRICES WAS USED ? :  {is_default}")
    cleaned_prices=clean_data(prices[OHLC],0.05,4)
    
    returns = cleaned_prices.pct_change() 
    print('\nreturns shape -before selection ,number of columns is intact, after selection -: ',returns.shape,'\n') 
    covarience_matrix :pd.DataFrame | NDArray[Any] | Any= CovarianceShrinkage(returns, returns_data=True).ledoit_wolf() 
    
    assets_volatilities:NDArray[Any] = np.sqrt(np.diag(covarience_matrix))
    print("\nuser_risk_preference is:",user_risk_prefrence,"\n")
    selected_assets_indicies=[index for index  in range(len(list(cleaned_prices.columns) )) if  assets_volatilities[index]<= user_risk_prefrence]
    selected_assets_names=[list(cleaned_prices.columns)[i] for i in selected_assets_indicies]
    print("\nselected assets names are: ",selected_assets_names,"\n") 
    print("\nnumber of selected assets: ",len(selected_assets_names),"\n") 
    
    return ReturnsAndPrices(
            selectedAssetsReturns=returns[selected_assets_names],
            selectedAssetsPrices=cleaned_prices[selected_assets_names]
            )    


class EfficientFrontierPointStaticType(TypedDict):
    volatility: float
    expectedReturn: float

def compute_frontier(
        ef:EfficientFrontier, 
        points=50)->list[EfficientFrontierPointStaticType]:
    """determine the volatality and expected return for each efficient portfolio

    Args:
        ef (_type_): _description_
        points (int, optional): _description_. Defaults to 50.

    Returns:
        list[EfficientFrontierPointStaticType]: _description_
    """
    import numpy as np

    ef_min = ef.deepcopy()
    ef_max = ef.deepcopy()

    ef_min.min_volatility()
    min_ret = ef_min.portfolio_performance()[0]

    max_ret = ef_max._max_return()

    ef_range = np.linspace(min_ret, max_ret - 1e-4, points)

    frontier = []

    for target in ef_range:
        ef_copy = ef.deepcopy()
        try:
            ef_copy.efficient_return(target)
            ret, vol, _ = ef_copy.portfolio_performance()

            frontier.append({
                "volatility": float(vol),
                "expectedReturn": float(ret)
            })

        except Exception:
            continue

    
    frontier.sort(key=lambda x: x["volatility"])

    return frontier

class AssetScatterPointStaticType(TypedDict):
      ticker: str
      volatility: float
      expectedReturn:float

class PerformenceMetricsStaticType(TypedDict):
        expectedAnnualReturn: float
        annualVolatility: float   
        sharpeRatio: float
        
class AssetsAllocationsResults(TypedDict):
    leftover:float
    sharesQuantities:dict[str,int]
    riskReturnScatterPoints:list[AssetScatterPointStaticType]
    efficientFrontierPoints:list[EfficientFrontierPointStaticType]
    capitalAllocationsPercentages:dict[str,float]
    performanceMetrics:PerformenceMetricsStaticType


def get_allocations_percentages(
        risk_appetite:str,
        risk_score:float,
        ef:EfficientFrontier,
        volatilities:NDArray[Any] 
        )->OrderedDict[int,float]:
        

    if risk_appetite=="Conservative":
        capital_allocations_percentages:OrderedDict[int, float]=ef.min_volatility()
        print("optimized for lowest risk")     
    
    elif risk_appetite=="Moderate":
        capital_allocations_percentages:OrderedDict[int,float] = ef.max_sharpe()
        print("optimzed for maximum sharp ratio")
    else:#aggressive 
        ef_copy:EfficientFrontier = ef.deepcopy()
        ef_copy.min_volatility()
        min_risk:float = ef_copy.portfolio_performance()[1]
        
        max_risk = float(np.max(volatilities))
        capital_allocations_percentages:OrderedDict[int,float] = ef.efficient_risk(target_volatility=max(min_risk, min(risk_score,max_risk)))
        print("optimized for maximum return given target risk (aggressive)")
    return capital_allocations_percentages 


def perform_assets_allocation(
          selected_assets_returns:pd.DataFrame, 
          selected_assets_prices:pd.DataFrame, 
          total_portfolio_value:float,
          risk_appetitie:str,
          risk_score:float=0.20
          )->AssetsAllocationsResults:
      
    covarience_matrix :DataFrame | NDArray[Any] | Any= CovarianceShrinkage(selected_assets_returns,returns_data=True).ledoit_wolf()       
    volatilities:NDArray[Any] = np.sqrt(np.diag(covarience_matrix))                                  
    annualized_mean_returns :  (Series | Any)= mean_historical_return(selected_assets_returns,returns_data=True,frequency=252) # Note 3 : use Series[Any] for mypy, python does not accept it .
    tickers:list[str] = list(annualized_mean_returns.index)
    # PROBLEM: must be returned to frontend and stored in the database
    risk_return_scatter_points = [
        {
            "ticker": ticker,
            "volatility": float(vol),
            "expectedReturn": float(expec_ret)
        }
        for ticker, vol, expec_ret in zip(tickers, volatilities, annualized_mean_returns.values)
    ] 
    ef = EfficientFrontier(annualized_mean_returns, covarience_matrix,verbose=False,solver='CLARABEL')#['CLARABEL', 'HIGHS', 'OSQP', 'SCIP', 'SCIPY', 'SCS']
    ###CONSTRAINTS#####
    #ef.add_constraint(lambda x : x >= 0.01) #Note that chatGPT that must consider : before adding this constraint, and assuming the user want aggressive portfolio, 100% was allocated to SLV, after adding the constrant, slv got 30%, and all other assets got 1%
    

    ###################
    efficient_frontier_points=compute_frontier(ef)                                        #PROBLEM: STORE THIS VALUE IN THE DATABASE.
    #comment: search through the portfolios and pick the one with the highest risk-adjusted return (Sharp ratio)
    

    #Optimization
    capital_allocations_percentages:OrderedDict[int,float]=get_allocations_percentages(risk_appetite=risk_appetitie,risk_score=risk_score, ef=ef,volatilities=volatilities)
    
    
    # drop assets that have no allocation .
    capital_allocations_percentages={
        asset_name:capital_allocation_percentage
        for asset_name, capital_allocation_percentage in capital_allocations_percentages.items() if capital_allocations_percentages[asset_name]>0
    }
    
    

    
    cleaned_assets_allocations:OrderedDict[int ,float]=ef.clean_weights()  

    performence_metrics=ef.portfolio_performance(verbose=False)                                          # metrics must be calculated after optimization
    performence_metrics=tuple(map(float, performence_metrics))
    parsed_metrics={
        "expectedAnnualReturn": performence_metrics[0],
        "annualVolatility": performence_metrics[1],   
        "sharpeRatio": performence_metrics[2]
        }
    latest_prices = get_latest_prices(selected_assets_prices)                                  

    
    da = DiscreteAllocation(cleaned_assets_allocations, latest_prices, total_portfolio_value=total_portfolio_value)
    shares_quantities, leftover = da.lp_portfolio(verbose=False) # Problem :  reinvest is related to the rebalancing
    
    #ensure no mismatch between the keys of shares_quantites and capital_allocations_percentages
    #the mismtach between the keys is during the fact the capital_allocations_percentages contains very small allocations that are near zero, so they are not encluded in the qunatities
    #PROBLEM: some allocations are lost, those allocations must be added to the leftover for accruacy, so that the user does not get confused on where his money gone !
    capital_allocations_percentages={k:v for k,v in capital_allocations_percentages.items() if k in list(shares_quantities.keys()) }
    
    leftover=float(leftover)    
    return AssetsAllocationsResults(
          leftover=leftover,
          sharesQuantities=shares_quantities,
          riskReturnScatterPoints=risk_return_scatter_points,
          efficientFrontierPoints=efficient_frontier_points,
          capitalAllocationsPercentages=capital_allocations_percentages,
          performanceMetrics=parsed_metrics
        ) 


class Asset(BaseModel):
    assetName: str
    capitalAllocationPercentage: float
    quantity: int
          
class Metrics(BaseModel): 

    expectedAnnualReturn: float
    annualVolatility: float
    sharpeRatio: float

class OptimalPortfolio(BaseModel): 

    assets:list[Asset] 
    metrics:Metrics 
      
class AssetScatterPoint(BaseModel):
    ticker: str
    volatility: float
    expectedReturn:float
      
class EfficientFrontierPoint(BaseModel): 
    volatility: float
    expectedReturn: float

class  InvestementsAdviceMocks (BaseModel) :
      leftover: float
      optimalPortfolio:OptimalPortfolio 
      assetsScatter: list[AssetScatterPoint]
      efficientFrontierPoints: list[EfficientFrontierPoint]
def investements_advice_orchestrator(
        question_scores:list[int],
        answers_weights:list[int], 
        total_portfolio_value:float,
        start_date:str="2024-1-1"
    )->InvestementsAdviceMocks:


    risk_appetite, normalized_risk_score=get_risk_appetite(questions_scores=question_scores,answers_weights=answers_weights)

    returns_and_prices: ReturnsAndPrices=select_assets(normalized_risk_score,start_date=start_date)#PROBLEM REGARDING SELECTING: SHOULD WE USE FIXED ASSET UNIVERSE?

    intermediate_results:AssetsAllocationsResults=perform_assets_allocation(returns_and_prices["selectedAssetsReturns"], returns_and_prices["selectedAssetsPrices"],total_portfolio_value,risk_appetite,normalized_risk_score)
    
    selected_assets_names=list(intermediate_results["capitalAllocationsPercentages"].keys())
    
    
    leftover=intermediate_results["leftover"]

    optimalPortfolio:OptimalPortfolio={
     
        "assets":[
            {
                "assetName":asset_name,
                "capitalAllocationPercentage":intermediate_results["capitalAllocationsPercentages"][asset_name],
                "quantity":intermediate_results["sharesQuantities"][asset_name]
            }
            for asset_name in selected_assets_names
        ] ,
        
        
        "metrics":intermediate_results["performanceMetrics"]
    }
    assetsScatter:list[AssetScatterPoint]=intermediate_results["riskReturnScatterPoints"]


    efficientFrontierPoints: list[EfficientFrontierPoint]=intermediate_results["efficientFrontierPoints"]
    
    return InvestementsAdviceMocks(
            leftover=leftover,
            optimalPortfolio=optimalPortfolio,
            assetsScatter=assetsScatter,
            efficientFrontierPoints=efficientFrontierPoints,
             )

