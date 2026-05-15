// components
import { MultiDebtPayoffTrajectory } from "../Components/MultiDebtPayoffTrajectory";
import { DebtTrajectoryPoint } from "../Components/MultiDebtPayoffTrajectory";
import { DebtKeyConfigSchema } from "../Components/MultiDebtPayoffTrajectory";
import { TextualDebtAdvice } from "../Components/MultiDebtPayoffTrajectory";

//hooks
import { useEffect} from "react";
import { useState } from "react";

// types
import { type FullAdviceDataType } from "./MultiStepContext";
import { type DebtsAdviceUiDataShape } from "../Components/MultiDebtPayoffTrajectory";

// run time validation inference
import z from "zod";
type FigureTrajectoryPoint=z.infer<typeof DebtTrajectoryPoint>;
type DebtKeyConfig=z.infer<typeof DebtKeyConfigSchema>
type AdviceItem= z.infer<typeof TextualDebtAdvice>;

// default mocks
const mockMultiDebtTrajectory:FigureTrajectoryPoint[] = [
  { monthLabel: 'Jan 2026', default1: 4500, default2: 10000, default3: 15000 }, // initial 
  { monthLabel: 'Feb 2026', default1: 3600, default2: 9800, default3: 14700 }, 
  { monthLabel: 'Mar 2026', default1: 2700, default2: 9550, default3: 14350 },
  { monthLabel: 'Apr 2026', default1: 1800, default2: 9280, default3: 13980 },
  { monthLabel: 'May 2026', default1: 800, default2: 8990, default3: 13580 },
  // Chase Card is paid off!
  { monthLabel: 'Jun 2026', default1: 0, default2: 8100, default3: 13160 },
  { monthLabel: 'Jul 2026', default1: 0, default2: 6500, default3: 12720 },
  { monthLabel: 'Aug 2026', default1: 0, default2: 4800, default3: 12250 },
  { monthLabel: 'Sep 2026', default1: 0, default2: 2500, default3: 11750 },
  // Personal Loan is paid off!
  { monthLabel: 'Oct 2026', default1: 0, default2: 0, default3: 10000 },
  { monthLabel: 'Nov 2026', default1: 0, default2: 0, default3: 5500 },
  // Auto Loan is paid off!
  { monthLabel: 'Dec 2026', default1: 0, default2: 0, default3: 0 },
];
const mockAdviceData:AdviceItem = {
  type: "neutral" as const,
  textualAdvice: " ERROR: THIS IS A DEFAULT DATA, THE BACKEND DATA DID NOT REACH THE UI FOR SOME REASON"
};
const debtConfiguration:DebtKeyConfig[] = [
  // I noticed that when I change the key, the red Trajectory disappears !
  // why the design choice is to use key and name?
  { key: 'default1', name: 'default1 (25% APR)', color: '#ef4444' }, // Tailwind Red-500
  { key: 'default2', name: 'default2 Loan (11% APR)', color: '#3b82f6' }, // Tailwind Blue-500
  { key: 'default3', name: 'default3 (5% APR)', color: '#10b981' }, // Tailwind Emerald-500
];
const defaultDebtsUiData:DebtsAdviceUiDataShape= {
    trajectory: mockMultiDebtTrajectory,
    debtKeys: debtConfiguration,
    monthsToTotalPayoff: 11,
    estimatedPayoffDate: "Dec 2026",
    startingTotalBalance: 29500,
    advice: mockAdviceData,
}
// rendering
export default function SuccessiveValueFormulaModeling(){
    const [mockData, setMockData] = useState<DebtsAdviceUiDataShape>(defaultDebtsUiData);
    useEffect(()=>{
      const rawString:string |null =localStorage.getItem("FullAdviceData")
      if(rawString){ // if data exist in local storage
        const backendData:FullAdviceDataType=JSON.parse(rawString)
        setMockData(backendData.fullDebtsUiData)
      }
    },[])
  
  // console visualization  
  console.log("Does debts advice mocks equal default or backend calculated data ? Answer is : \n")
  if (mockData==defaultDebtsUiData){
    console.log("mocks equal the default data")
   }
  else{
    console.log("mocks equal the producton data")
  }
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