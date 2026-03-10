from pydantic import BaseModel

# import all advice classes
from app.core.finance.successive_value_modeling import FullDebtsUiData

# the dashboard UI expects some data to show it for user. for now, we will asume that we only show the ai responses.
# the name of this DTO can be changed of not suitable.

# DTO for main dashboard. direction(backend --> frontend).
class DashboardSummaryResponse(BaseModel):
    fullDebtsUiData: FullDebtsUiData


