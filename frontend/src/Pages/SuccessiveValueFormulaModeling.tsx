import { MultiDebtPayoffTrajectory } from "../Components/MultiDebtPayoffTrajectory";
import { useEffect} from "react";
import { useState } from "react";
import { type DebtsAdviceUiDataShape } from "../Components/MultiDebtPayoffTrajectory";
// rendering
export default function SuccessiveValueFormulaModeling(){
  const [mockData, setMockData] = useState<DebtsAdviceUiDataShape|null>(null);
  const [message, setMessage] = useState<string>("");
  useEffect(()=>{    
    const fetchUserData=async ()=>{
          try {
            const response = await fetch("http://localhost:8000/mocks/get_debts_advice_mocks", { 
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials:"include"              
            });
            if (!response.ok) {
                const error = await response.json();
                console.log("could not fetch portfolio data or the portfolio is not ready yet, more details:",error)
                setMessage(error.detail)
                return;
            }
            setMessage("");
            const data:DebtsAdviceUiDataShape = await response.json();
            setMockData(data);
          } catch (error) {
            console.log(error);// Executed correctly
            setMessage("Please check your internet connection.")
            
          } 
    }
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 2000);
    return () => clearInterval(intervalId);
  },[])
  if (!mockData){
    return(
      <>
        <p>{message}</p>
      </>
    )
  }
  else{
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MultiDebtPayoffTrajectory 
            trajectory={mockData.trajectory}
            debtKeys={mockData.debtKeys}
            monthsToTotalPayoff={mockData.monthsToTotalPayoff}        
            estimatedPayoffDate={mockData.estimatedPayoffDate}  
            startingTotalBalance={mockData.startingTotalBalance} 
            advice={mockData.advice}
          />
        </main>
      </div>
    ); 
  }

}