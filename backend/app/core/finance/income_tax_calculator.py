# This class is responsible for calculating income tax for individuals 
# (e.g., employees and small business owners) based on simplified Jordan tax rules.
#
# =========================
#  LOGIC OVERVIEW
# =========================
# 1. Determine the taxable income:
#    - For single filers:
#        taxable_income = total_income - 9000
#    - For married filers:
#        taxable_income = total_income - 18000 - (1000 × number_of_children)
#        * Number of children is capped at 3.
#
# 2. Ensure taxable income is not negative:
#        if taxable_income < 0 → taxable_income = 0
#
# 3. Apply progressive tax brackets to the taxable income:
#        0 – 5,000       → 5%
#        5,001 – 10,000  → 10%
#        10,001 – 15,000 → 15%
#        15,001 – 20,000 → 25%
#        20,001+         → 30%
#
#    - Tax is calculated incrementally across brackets (progressive system),
#      not as a single rate applied to the full income.
#
# 4. Compute final financial metrics:
#    - Total tax owed
#    - Net income after tax
#    - Effective tax rate
#    - Detailed tax breakdown per bracket
#
# =========================
#  INPUTS
# =========================
# - status (str):
#     Filing status of the user
#     Allowed values: "single", "married"
#
# - total_income (float):
#     Total annual income from all sources (in Jordanian Dinar - JD)
#
# - number_of_children (int, optional):
#     Number of dependent children (used only for married filers)
#     Maximum counted value = 3
#
# =========================
#  OUTPUTS
# =========================
# The class returns a dictionary containing:
#
# - total_income:
#     The original income provided by the user
#
# - taxable_income:
#     Income remaining after exemptions and deductions;
#     this is the amount subject to taxation
#
# - tax:
#     Total annual tax amount calculated using progressive brackets
#
# - net_income:
#     Income remaining after subtracting tax
#     (net_income = total_income - tax)
#
# - effective_tax_rate (%):
#     The actual percentage of income paid as tax:
#     (tax / total_income) × 100
#
# - breakdown (list of objects):
#     Detailed explanation of how tax was calculated per bracket:
#     Each item includes:
#         • amount taxed in that bracket
#         • tax rate applied
#         • tax paid for that portion
#
# =========================
#  PURPOSE
# =========================
# This class is designed to:
# - Provide accurate tax estimation
# - Support financial insights in the application
# - Enable visualization (charts, tables, analytics)
# - Serve as a core module for tax-related features
#
class TaxCalculator:
    
    def __init__(self, status, total_income, children=0):
        self.status = status.lower()
        self.total_income = total_income
        self.children = min(children, 3)

    def calculate_taxable_income(self):
        if self.status == "single":
            taxable = self.total_income - 9000

        elif self.status == "married":
            taxable = self.total_income - 18000 - (self.children * 1000)

        else:
            raise ValueError("Invalid filing status")

        return max(taxable, 0)

    def calculate_tax(self, taxable_income):
        brackets = [
            (5000, 0.05),
            (5000, 0.10),
            (5000, 0.15),
            (5000, 0.25),
            (float('inf'), 0.30)
        ]

        tax = 0
        remaining = taxable_income
        breakdown = []

        for limit, rate in brackets:
            if remaining <= 0:
                break

            amount = min(remaining, limit)
            tax_amount = amount * rate

            breakdown.append({
                "amount": amount,
                "rate": rate,
                "tax": tax_amount
            })

            tax += tax_amount
            remaining -= amount

        return tax, breakdown

    def calculate(self):
        taxable_income = self.calculate_taxable_income()
        tax, breakdown = self.calculate_tax(taxable_income)

        net_income = self.total_income - tax
        effective_tax_rate = (tax / self.total_income) * 100 if self.total_income > 0 else 0

        return {
            "total_income": self.total_income,
            "taxable_income": taxable_income,
            "tax": tax,
            "net_income": net_income,
            "effective_tax_rate": round(effective_tax_rate, 2),
            "breakdown": breakdown
        }