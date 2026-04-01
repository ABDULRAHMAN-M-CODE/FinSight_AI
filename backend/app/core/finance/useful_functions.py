# %%

import pandas as pd
from twelvedata import TDClient
from numpy.typing import NDArray
from typing import Any

from pypfopt.expected_returns import returns_from_prices
import numpy as np
from pypfopt.risk_models import CovarianceShrinkage

""" # %%
#Inputs for the function
number_of_rows=5
assets_names = ["AAPL", "GOOG", "BTC/USD", "EUR/USD"]
interval="1day"
apikey="62b837a3ce80416ba70b117fbb8d78ee"
#get_real_time_prices( apikey:str,assets_names:list[str],interval:str,number_of_rows:int,OHLC:str="close")
real_time_prices:pd.DataFrame=get_real_time_prices(apikey, assets_names, interval, number_of_rows, "close") """

def get_real_time_prices( apikey:str,assets_names:list[str],interval:str,number_of_rows:int,OHLC:str="close")->pd.DataFrame:
    td = TDClient(apikey=apikey)

    # Single API call for each asset , making single API call to get all data at once will introduce 'NaN'  values.
    individual_prices = {}
    assets_prices_mean_values: dict[str, int]={} # key is asset_name, value is mean of the column
    assets_prices_null_count:dict[str, int]={}
    for asset_name in assets_names:
        ts = td.time_series(symbol=asset_name, interval=interval, outputsize=number_of_rows)
        temp = ts.as_pandas()["close"].reset_index(drop=True)
        assets_prices_null_count[asset_name]=temp.isnull().sum()
        assets_prices_mean_values[asset_name]=temp.mean()
        individual_prices[asset_name]=temp
    #print('\nnull values for each asset_prices are : ',assets_prices_null_count,'\n')
    merged_assets_prices=pd.DataFrame(individual_prices)
    #print('\nnull values for each asset prices after merging prices into dataframe ( before filling NaN values) :\n ',merged_assets_prices.isnull().sum(),'\n')

    for asset_name in assets_names:
        if merged_assets_prices[asset_name].isnull().sum()>0:
            merged_assets_prices[asset_name]=merged_assets_prices[asset_name].fillna(assets_prices_mean_values[asset_name])
    #print('\nnull values for each asset prices after merging prices into dataframe ( after filling NaN values) :\n ',merged_assets_prices.isnull().sum(),'\n')
    return merged_assets_prices









