#get enviroment variables.,must always be in the top of the test file
from dotenv import load_dotenv
load_dotenv() 
from finance.portfolio_construction import HistoricalPricesService,CsvPricesData
import pandas as pd
def test_service_assets()->None:
 
    # A- Define input data
    
    # B-execute the function



    service=HistoricalPricesService(CsvPricesData())
    is_default,prices=service.get_data()

    #C- Verify phase
    
    # 1. verify the  shape of the data
    assert isinstance(prices, pd.DataFrame)
    print("is_default is :",is_default)
    #close_prices=prices['Close']
    #print(type(close_prices))


    
