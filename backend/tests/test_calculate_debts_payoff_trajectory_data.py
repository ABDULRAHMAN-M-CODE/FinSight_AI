

from app.core.finance.successive_value_modeling import (
    calculate_debts_payoff_trajectory_data,
    DebtTrajectoryPoint
)

def test_debt_trajectory_basic()->None:

    #A-define inputs
    balances: list[float] =       [1000.0, 2000.0,  10000.0]
    interest_rates: list[float] = [0.01, 0.05,  0.06]
    min_payment_0:float=balances[0]*interest_rates[0]+1
    min_payment_1:float=balances[1]*interest_rates[1]+1
    min_payment_2:float=balances[2]*interest_rates[2]+1
    payments:list[float] = [min_payment_0 ,  min_payment_1,  min_payment_2] # those values satisfies the rule ( payment> balance*interest_rate ) ; guarantee that the Debts are efficitvely shrinking !

    #B- execute the function
    result : list[DebtTrajectoryPoint] = calculate_debts_payoff_trajectory_data(balances,interest_rates,payments) # only question to chatGPT ; is it correct to use this type like in typeScript ? 


    #C- verify the outputs using assertion

    # 1. Ensure result is a list
    assert isinstance(result, list)

    # 2. Ensure elements are Pydantic models by testing the first element
    assert isinstance(result[0], DebtTrajectoryPoint)

   
    first_point = result[0]
    second_point=result[1]
    # 3. Ensure schema fields exist
    assert hasattr(first_point, "monthLabel")
    assert "debt_0" in first_point.model_dump() # why user model_dump here ?

    

    # 4. Ensure balances decrease for each debt

    debt_0_first_balance = first_point.model_dump()["debt_0"]
    debt_0_second_balance = second_point.model_dump()["debt_0"]
    assert debt_0_second_balance < debt_0_first_balance # ensure user's progress ; must  guarantee that his debt is shrinking effictively

    debt_1_first_balance = first_point.model_dump()["debt_1"]
    debt_1_second_balance = second_point.model_dump()["debt_1"]
    assert debt_1_second_balance<debt_1_first_balance

    debt_2_first_balance = first_point.model_dump()["debt_2"]
    debt_2_second_balance = second_point.model_dump()["debt_2"]
    assert debt_2_second_balance<debt_2_first_balance    
    
    # ensure last point has no values for the debts "debts are paid-off !"
    last_point:DebtTrajectoryPoint=result[-1]
    assert last_point.model_dump()["debt_0"]==0
    assert last_point.model_dump()["debt_1"]==0
    assert last_point.model_dump()["debt_2"]==0
    
    #####################################################
    #visualizing the data
    #  context : ast_point.model_dump()["monthLabel"] always  returns a str object , question : at run time , if I replace " payoff_date:str" with  payoff_date:int , no error happens at all even thought we are assigning int to str ! why does not python complain about that ? , this is stupid and crazy !
    payoff_date:str=last_point.model_dump()["monthLabel"] # question to chatGPT :  mypy did not consider this as error, even thought the value of the right side is not integer, it's a string 
    print("\n")
    print("########### Every thing worked perfectly! You can disable this massege by enforcing the pytest to catch the stdout and preventing this massege from being shown ###########","\n")
    
    
    print("last_point without the usage of model_dump() is not visually  shown as dictionary  like : ",last_point,"\n")
    print("last_point with the use of model_dump() is  visually shown as  dictionary like  : ",last_point.model_dump(),"\n")# there is no aut completion at all!
    print ("Expected payoff date is : ", payoff_date,". this date has the following type : ",type(payoff_date))