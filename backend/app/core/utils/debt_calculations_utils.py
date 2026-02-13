def compute_annual_interest_cost(debts: dict) -> dict:
    for debt in debts.get("debts", []):
        balance = debt.get("balance", 0)
        interest_rate = debt.get("interest_rate", 0)
        debt["annual_interest_cost"] = balance * interest_rate
    return debts
