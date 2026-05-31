import pandas as pd
import numpy as np
from pypfopt.discrete_allocation import DiscreteAllocation
from collections import OrderedDict
from pandas import DataFrame
from typing import Any
from numpy.typing import NDArray
from pypfopt.risk_models import CovarianceShrinkage
from pypfopt.efficient_frontier import EfficientFrontier
import pandas as pd
from pydantic import BaseModel
from typing import TypedDict    
import yfinance as yf
import time

import json
from abc import ABC, abstractmethod
from pathlib import Path
import bidask as ba
from pypfopt import objective_functions
from pypfopt import black_litterman
from pypfopt import BlackLittermanModel
from dotenv import load_dotenv
load_dotenv()
from tensorflow import keras
import joblib
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
            cleaned_prices=clean_data( yf.download(
                assets_tickers,
                start="2020-04-09",
                auto_adjust=True,
                threads=True,
                interval=self.interval,
                group_by="ticker"
            ),0.05,3)
            
            
            return cleaned_prices if cleaned_prices is not None else None

        except Exception as e:
            print(f"[ERROR] Download failed: {e}")
            return None

    def robust_download(self, max_retries=5)->pd.DataFrame|None:
        for attempt in range(max_retries):
            try:
                cleaned_prices:pd.DataFrame = self.safe_download(self.assets_tickers,self.start_date)#third pass of the start_date variable
                if cleaned_prices is not None and not cleaned_prices.empty:
                    return cleaned_prices
            except Exception as e:
                print(f"[Retry {attempt+1}] {e}")     
            time.sleep(2)  # wait before retry
            
        print("[FAILURE] All retries failed")
        return None

    def get_data(self)->tuple[bool,pd.DataFrame]:
        cleaned_prices:pd.DataFrame = self.robust_download()
        if cleaned_prices is None:
            print("[WARNING] Using fallback data")
            self.is_default=True
            cleaned_prices=pd.read_parquet("cleaned_multiindex_prices.parquet")
        return self.is_default,cleaned_prices
    
class MockData(PricesData):
    def __init__(self,file_name:str):
        self.is_default=True
        self.file_name=file_name

    def get_data(self)->tuple[bool,pd.DataFrame]:
        return self.is_default,pd.read_parquet(self.file_name)

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
    riskReturnScatterPoints:list[AssetScatterPointStaticType]
    capitalAllocationsPercentages:dict[str,float]
    performanceMetrics:PerformenceMetricsStaticType



class Asset(BaseModel):
    assetName: str
    capitalAllocationPercentage: float
    quantity:int

class Metrics(BaseModel): 
    expectedAnnualReturn: float
    annualVolatility: float
    sharpeRatio: float

class OptimalPortfolio(BaseModel): 

    assets:list[Asset] # descripes details of portfolio
    metrics:Metrics # descripes the whole portfolio 
      
class AssetScatterPoint(BaseModel):
    ticker: str
    volatility: float
    expectedReturn:float

class  InvestementsAdviceMocks (BaseModel) :
      leftover: float
      optimalPortfolio:OptimalPortfolio 
      
      
      

class InvestementsAdviceOrchestrator:# why not to use paranthesis  like (BaseModel) or other stuff ?
    #constructor
    def __init__(self,questions_scores:list[int],answers_weights:list[int], total_portfolio_value:float):
        self.questions_scores=questions_scores
        self.answers_weights=answers_weights
        self.total_portfolio_value=total_portfolio_value

    

    def get_current_shares(self,source:str)->dict[str,int]:
        print("we reached get_current_shares")
        BASE_DIR = Path(__file__).resolve().parent
        file_path = BASE_DIR / "current_shares.txt"
        if source=="local":
            BASE_DIR = Path(__file__).resolve().parent
            file_path = BASE_DIR / "current_shares.txt"
            with open(file_path, 'r') as f:
                current_shares:dict[int,str]=json.load(f)
                
            result={key:value for key,value in current_shares.items() if key in self.cleaning_survived_tickers }
            print("fetched local current shares")
        else:
            result:dict[str,int]={}
            for cleaning_survived_ticker in self.cleaning_survived_tickers:
                # Get current shares outstanding
                result[cleaning_survived_ticker] = yf.Ticker(cleaning_survived_ticker).info.get('sharesOutstanding')
            with open(file_path, 'w') as f:
                json.dump(result,f,indent=3)
            print("fetched current shares from internet")
        print("get_current_shares  finished correctly.")
        return pd.Series(result)
    def get_benchmark_sector_weights(self,cleaned_prices:pd.DataFrame)->dict[str,int]:
        """provide sector impact relative to the overall custome index; all sectors across all assets, not just selected assets 

        Args:
            cleaned_prices (pd.DataFrame): prepared ohlc prices

        Returns:
            dict[str,int]: weights for each sector.
        """

        current_market_caps=self.get_current_shares("local")*cleaned_prices.xs("Close",axis=1,level=1).iloc[-2]
        current_market_cap_weights=(current_market_caps/current_market_caps.sum())
        BASE_DIR = Path(__file__).resolve().parent
        file_path1 = BASE_DIR / "sector_mapper.txt"
        with open(file_path1, 'r') as f:
            sector_mapper = json.load(f)
        sector_series = pd.Series(sector_mapper)
        benchmark_sector_weights=(current_market_cap_weights.groupby(sector_series).sum()).to_dict()
        BASE_DIR = Path(__file__).resolve().parent
        file_path2 = BASE_DIR / "benchmark_sector_weights.txt"
        with open(file_path2, 'w') as f:
            json.dump(benchmark_sector_weights,f,indent=3)
        return benchmark_sector_weights
    def get_allocations_percentages(self)->OrderedDict[int,float]:
        print("started get_allocations_percentages")
        
        BASE_DIR = Path(__file__).resolve().parent
        file_path = BASE_DIR / "sector_mapper.txt"
        with open(file_path, 'r') as f:
            sector_mapper:dict[str,str] = json.load(f)
        
        dynamic_sector_mapper:dict[str,str]={key:value for key,value in sector_mapper.items() if key in self.selected_assets}
        selected_sectors=set(dynamic_sector_mapper.values()) # use it for sector_lower & sector_upper.
        
        BASE_DIR = Path(__file__).resolve().parent
        file_path3 = BASE_DIR / "benchmark_sector_weights.txt"
        with open(file_path3, 'r') as f:
            benchmark_sector_weights:dict[str,float] = json.load(f)
        
        self.ef.add_objective(objective_functions.L2_reg, gamma=1)
        
        if self.risk_appetite=="Conservative":
            sector_lower:dict[str,float] = {key:max(0,value-0.05) for key,value in benchmark_sector_weights.items() if key in selected_sectors} 
            sector_upper:dict[str,float] = {key:min(1,value+0.05) for key,value in benchmark_sector_weights.items() if key in selected_sectors} 
            self.ef.add_sector_constraints(sector_mapper, sector_lower, sector_upper)  
            capital_allocations_percentages:OrderedDict[int, float]=self.ef.min_volatility()
            print("optimized for lowest risk")     
        
        elif self.risk_appetite=="Moderate":
            sector_lower:dict[str,float] = {key:max(0,value-0.07) for key,value in benchmark_sector_weights.items() if key in selected_sectors} 
            sector_upper:dict[str,float] = {key:min(1,value+0.07) for key,value in benchmark_sector_weights.items() if key in selected_sectors} 
            self.ef.add_sector_constraints(sector_mapper, sector_lower, sector_upper)  
            capital_allocations_percentages:OrderedDict[int,float] = self.ef.max_sharpe()
            print("optimzed for maximum sharp ratio")
        
        else:#aggressive 
            sector_lower:dict[str,float] = {key:max(0,value-0.10) for key,value in benchmark_sector_weights.items() if key in selected_sectors} 
            sector_upper:dict[str,float] = {key:min(1,value+0.10) for key,value in benchmark_sector_weights.items() if key in selected_sectors} 
            ef_copy:EfficientFrontier = self.ef.deepcopy()
            ef_copy.min_volatility()
            min_risk:float = ef_copy.portfolio_performance()[1]
            max_risk = float(np.max(self.assets_volatilities))
            self.ef.add_sector_constraints(sector_mapper, sector_lower, sector_upper)  
            capital_allocations_percentages:OrderedDict[int,float] = self.ef.efficient_risk(target_volatility=max(min_risk, min(self.normalized_score,max_risk)))
            print("optimized for maximum return given target risk (aggressive)")
        print("get _allocations_percentages worked perfectly")
        return capital_allocations_percentages 

    def perform_assets_allocation(self)->None:
        
        # covarience_matrix = S
        prices:pd.DataFrame = self.cleaned_prices[self.selected_assets].xs("Close",level=1,axis=1)  
        print("285 had no problem")
        covarience_matrix :DataFrame | NDArray[Any] | Any= CovarianceShrinkage(prices).ledoit_wolf()
        print("287 had no problem")
           
        market_prices = yf.download("SPY", period="max")["Close"]
        print("290 had no problem")
        delta = black_litterman.market_implied_risk_aversion(market_prices)
        print("292 had no problem")
        mcaps = {}#third input
        print("294 had no problem")
        for t in self.selected_assets:
            stock = yf.Ticker(t)
            mcaps[t] = stock.info["marketCap"]       
        market_prior = black_litterman.market_implied_prior_returns(mcaps, delta, covarience_matrix )
        print("296, the for loop had no problem")
# load saved artifacts once during startup



        BASE_DIR = Path(__file__).resolve().parent / "saved_model_and_scalers"
        lstm_model = keras.models.load_model(
            BASE_DIR / "lstm_ic_model.keras"
        )
        x_scaler = joblib.load(
            BASE_DIR / "x_scaler.pkl"
        )
        y_scaler = joblib.load(
            BASE_DIR / "y_scaler.pkl")
        close_returns = (
            self.all_assets_prices
            .xs("Close", level=1, axis=1)
            .pct_change()
            .dropna()
        )

        selected_returns = close_returns

        WINDOW = 60
        latest_window = selected_returns.iloc[-WINDOW:]
        X = latest_window.values.reshape(
            -1,
            len(selected_returns.columns)
        )
        print("\n")
        print("Shape of the X variable is : ",X.shape,"\n")
        X_scaled = (
            x_scaler
            .transform(X)
            .reshape(
                1,
                WINDOW,
                len(selected_returns.columns)
            )
        )
        pred_scaled = lstm_model.predict(
            X_scaled,
            verbose=0
        )
        predicted_returns = (
            y_scaler
            .inverse_transform(pred_scaled)
            .flatten()
        )
        view_dict = {
            ticker: float(pred_ret)
            for ticker, pred_ret in zip(
                self.selected_assets,
                predicted_returns
            )
        }
        
        print("348 had no problem")
        bl = BlackLittermanModel(
            covarience_matrix,
            pi=market_prior,
            absolute_views=view_dict,
            market_caps=mcaps,
            risk_aversion=delta
        )
        print("350 had no problem")
        posterior_returns=bl.bl_returns()
        print("359 had no problem")
        posterior_covarience_matrix = bl.bl_cov()
        print("361 had no problem")
        self.assets_volatilities:NDArray[Any] = np.sqrt(np.diag(posterior_covarience_matrix)) 
        print("363 had no problem")

        # FOR ME TO DO LATER : store in the database
        self.risk_return_scatter_points = [
            {
                "ticker": ticker,
                "volatility": float(vol),
                "expectedReturn": float(expec_ret)
            }
            
            for ticker, vol, expec_ret in zip(self.selected_assets, self.assets_volatilities, posterior_returns)
        ] 
        print("367 list comprehension  had no problem")
        self.ef = EfficientFrontier(posterior_returns, posterior_covarience_matrix,verbose=False,solver='CLARABEL', weight_bounds=(0.0, 0.50))# possible solvers : ['CLARABEL', 'HIGHS', 'OSQP', 'SCIP', 'SCIPY', 'SCS']
        
        
                                        
        
        #Optimization
        capital_allocations_percentages:OrderedDict[int,float]=self.get_allocations_percentages()
        
        print("383 good")
        # drop assets that have no allocation .
        capital_allocations_percentages={
            asset_name:capital_allocation_percentage
            for asset_name, capital_allocation_percentage in capital_allocations_percentages.items() if capital_allocations_percentages[asset_name]>0
        }
        print("387  good")
        performence_metrics=self.ef.portfolio_performance(verbose=False)                                         
        print("392  good")
        performence_metrics=tuple(map(float, performence_metrics))
        print("394  good")
        parsed_performance_metrics={
            "expectedAnnualReturn": performence_metrics[0],
            "annualVolatility": performence_metrics[1],   
            "sharpeRatio": performence_metrics[2]
            }
        print("396  good")
        latest_prices =self.cleaned_prices.xs("Close",level=1,axis=1).iloc[-2]
        print("401  good")
        
        da = DiscreteAllocation(self.ef.clean_weights(), latest_prices, total_portfolio_value=self.total_portfolio_value)
        self.quantities, leftover = da.lp_portfolio(verbose=False) 
        self.leftover=float(leftover)
        print("405  good")
        
        capital_allocations_percentages={k:v for k,v in capital_allocations_percentages.items() if k in list(self.quantities.keys()) }
        print("410  good") 
        self.optimal_portfolio:OptimalPortfolio={
        
            "assets":[
                {
                    "assetName":asset_name,
                    "capitalAllocationPercentage":capital_allocations_percentages[asset_name],
                    "quantity":quantity
                }
                for asset_name,quantity in zip(capital_allocations_percentages.keys(),self.quantities.values())
            ] ,
            
            
            "metrics":parsed_performance_metrics
        }
        print("412  good")

    # the following five methods are related.    
    def get_avg_spreads(self,tickers:list[str])->dict[str,float]:
        result={}
        
        for ticker in tickers:
            ticker_df = self.cleaned_prices[ticker].copy()
            result[ticker] = ba.edge(ticker_df['Open'], ticker_df['High'], 
                                ticker_df['Low'], ticker_df['Close'])
        print('get_avg_spreads has no problem')
        return result
    
    

    def calc_slope(self,price_series):
        """
        Calculates the linear trend (slope) of the price series.
        Prices are normalized to a starting value of 1 so the slope represents
        an average period-over-period percentage drift.
        """
        prices = price_series.dropna()
        if len(prices) < 2:
            return 0.0
        
        # Normalize to evaluate relative trend
        y = prices.values / prices.values[0]
        x = np.arange(len(y))
        
        # Linear regression to find the slope (degree 1 polynomial)
        slope, _ = np.polyfit(x, y, 1)
        return slope

    def equities_filtering_algorithm(self,top_n, adv_threshold:int,slop_threshold:float=0.0): #PROBLEM : Add additional filtering layer based on rolling sharp ratio, not just slope,  or delete slope entirely.
        equities_close_prices=self.equities_prices.xs('Close',axis=1,level=1)
        print('line 400 has no problem')
        
        spreads = pd.Series(self.get_avg_spreads(list(equities_close_prices.columns)))

        common_index = self.equities_market_caps.index.intersection( self.average_daily_volume.index).intersection(spreads.index)
        print('422 has no problem')        
        rank_cap = self.equities_market_caps.loc[common_index].rank(ascending=False)
        print('424 has no problem')     
        rank_vol =  self.average_daily_volume.loc[common_index].rank(ascending=False)
        print('426 has no problem')     
        rank_spread = spreads.loc[common_index].rank(ascending=True)  # less spread → more liquidity → give less spread  less rank.
        print('428 has no problem')     
        combined_ranks = rank_cap + rank_vol+rank_spread
        print('430 has no problem')     
        U0 = combined_ranks.nsmallest(top_n).index.tolist()
        print('432 has no problem')     
        final_U = []
        
        # Step B: Iterate through the top N assets
        for sym in U0:
            if sym not in equities_close_prices.columns:# here
                continue
                
            equity_close_price = equities_close_prices[sym]#here
            
            # Calculate slope
            slope = self.calc_slope(equity_close_price)
            
            # Calculate daily log returns and their standard deviation (volatility)
            log_returns = np.log(equity_close_price / equity_close_price.shift(1)).dropna()
            
            
            # Assign labels based on computed metrics
            if slope >= slop_threshold:
                label = "up"
            elif slope <= -slop_threshold:
                label = "down"   
            else:
                label = "sideways"
                
            # Step C: Final Selection
            # Keep symbols labeled "up" or "volatile" AND verify high liquidity
            is_high_liquidity =  self.average_daily_volume.get(sym, 0) >= adv_threshold
            
            if label in ["up"] and is_high_liquidity:
                final_U.append(sym)
        print(" equities_filtering_algorithm has no problem")
        return final_U
    

    def select_assets(self)->None:

        BASE_DIR = Path(__file__).resolve().parent
        file_path = BASE_DIR / "class_mapper.txt"
        with open(file_path, 'r') as f:
            stored_dict = json.load(f)
        initial_equities_tickers=[key for key in list(stored_dict.keys()) if stored_dict[key]=="Equities"]
        first_service=HistoricalPricesService(ApiOrMockPricesData(assets_tickers=initial_equities_tickers, start_date="2024-1-1",interval="1d" )) #PROBLEM:the definition of the HistoricalPricesService class is outside the main class , is it ok or not ? can I put definition of class inside class ?
        """ 
        #other way to get 'first service'
        BASE_DIR = Path(__file__).resolve().parent
        first_service=HistoricalPricesService(MockData(BASE_DIR / "cleaned_multiindex_prices.parquet")) 
        """
        _,self.cleaned_prices=first_service.get_data()#this  method call never changes regardless of the underlying implementation ; DIP design pattern.
        self.cleaning_survived_tickers=list(self.cleaned_prices.columns.get_level_values(0).unique())
        
        
        cleaning_survived_equities=[equity for equity in  initial_equities_tickers if equity in self.cleaning_survived_tickers ]
        # all OHLC prices of all equities; not just Close prices
        self.equities_prices=self.cleaned_prices[cleaning_survived_equities]

        # get market capitalization
        equities_num_shares = pd.Series(self.get_current_shares("local"))
        
        equities_latest_close_prices = self.equities_prices.xs('Close', level=1, axis=1).iloc[-2] # don't use -1
        print("line 470 has no problem")
        self.equities_market_caps= (equities_latest_close_prices*equities_num_shares).dropna()
        self.average_daily_volume = self.equities_prices.xs('Volume', level=1, axis=1).iloc[-50:].mean()                    
        
        selected_equities = self.equities_filtering_algorithm(top_n=int(0.2 * len(cleaning_survived_equities)),adv_threshold=1_000_000,slop_threshold=0.001 )
        print("502 had no problem")
        
        self.selected_assets:list[str]=selected_equities #+# selected_commodities #+# selected_fixedincome
        print("515 had no problem")
        self.all_assets_prices = self.cleaned_prices.copy()
        self.cleaned_prices=self.cleaned_prices[self.selected_assets]
        print("select_assets function had no problem")
    #standalone method
    def get_risk_appetite(self)->None:
        
        total_weight = sum(self.answers_weights)
        total_weighted_score = 0    
        for i in range(len(self.questions_scores)):
            total_weighted_score += self.questions_scores[i]*self.answers_weights[i]
            

        """if total_weight == 0:
            return "Unable to determine risk appetite"  # Handle edge case"""

        average_score = total_weighted_score / total_weight
        max_volatility = 1
        self.normalized_score = (average_score / 10) * max_volatility 
        if self.normalized_score <= 0.33333333: 
            self.risk_appetite = "Conservative"
        
        elif 0.33333334 <= self.normalized_score <= 0.66666666:
            self.risk_appetite = "Moderate"
        
        else:
            self.risk_appetite = "Aggressive"

    def get_investement_advice(self)->InvestementsAdviceMocks:
        self.get_risk_appetite() # take user's personality
        self.select_assets()    # فلترة الاصول
        self.perform_assets_allocation() # → Asssets : percentage 
        
        return InvestementsAdviceMocks(
                leftover=self.leftover,
                optimalPortfolio=self.optimal_portfolio 
            )

