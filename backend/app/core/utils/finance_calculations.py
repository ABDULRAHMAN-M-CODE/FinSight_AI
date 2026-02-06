def compute_savings_rate(income: float, expenses: float) -> float:
    if income == 0:
        return 0
    return float(round((income - expenses) / income, 2))


def compute_projections(income: float, expenses: float) -> dict:
    monthly_savings = income - expenses
    return {
        "monthly_savings": float(monthly_savings),
        "monthly_savings": float(monthly_savings * 12),
    }


def compute_current_amount(investment_accounts: list) -> float:
    return sum(acc.current_value for acc in investment_accounts)
