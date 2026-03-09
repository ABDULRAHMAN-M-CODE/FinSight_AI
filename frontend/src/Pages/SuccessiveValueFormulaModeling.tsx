import z from "zod";
// run time validation related
import { DebtsAdviceUiDataSchema } from "../Components/MultiDebtPayoffTrajectory";


import { MultiDebtPayoffTrajectory } from "../Components/MultiDebtPayoffTrajectory";
import { DebtTrajectoryPoint } from "../Components/MultiDebtPayoffTrajectory";
import { DebtKeyConfigSchema } from "../Components/MultiDebtPayoffTrajectory";
import { type DebtsAdviceUiDataShape } from "../Components/MultiDebtPayoffTrajectory";
import { TextualDebtAdvice } from "../Components/MultiDebtPayoffTrajectory";
import { resolveData } from "../Functions/api/resolveData";

// --- MOCK PRE-CALCULATED DATA (Provided by Backend or Parent) ---
// Notice how the backend did all the heavy lifting.
// It determined the total month-by-month trajectory, when the Chase card drops to 0 (Month 5),
// when the Personal Loan drops to 0 (Month 9), and finally when the Auto Loan drops to 0 (Month 12).
// The UI is completely dumb and just loops over the data!
type FigureTrajectoryPoint=z.infer<typeof DebtTrajectoryPoint>;
// the function that produces data like 'FigureTrajectoryPoint' already exist in the backend, the following is just a mock
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

// Configuration array tells the dumb component which keys to look for and how to style them.
// We order them by urgency: Red (Urgent) -> Blue -> Emerald (Lowest urgency)

type DebtKeyConfig=z.infer<typeof DebtKeyConfigSchema>
// we did not make a function in the backend that generates a data like 'debtConfiguration', because this data contains the color attribute, that means it's a presentational data, not a business logic, at least, this is what I think , it may be wrong, it may be right, what you think ? 
const debtConfiguration:DebtKeyConfig[] = [
  // I noticed that when I change the key, the red Trajectory disappears !
  // why the design choice is to use key and name?
  { key: 'default1', name: 'default1 (25% APR)', color: '#ef4444' }, // Tailwind Red-500
  { key: 'default2', name: 'default2 Loan (11% APR)', color: '#3b82f6' }, // Tailwind Blue-500
  { key: 'default3', name: 'default3 (5% APR)', color: '#10b981' }, // Tailwind Emerald-500
];


type AdviceItem= z.infer<typeof TextualDebtAdvice>;
const mockAdviceData:AdviceItem = {
  type: "neutral" as const,
  textualAdvice: " ERROR: THIS IS A DEFAULT DATA, THE BACKEND DATA DID NOT REACH THE UI FOR SOME REASON"
};


//default Data , consider using it as fallback for the stored data in the local storage. 
 const  defaultDebtsUiData:DebtsAdviceUiDataShape= {
    trajectory: mockMultiDebtTrajectory,
    debtKeys: debtConfiguration,
    monthsToTotalPayoff: 11,
    estimatedPayoffDate: "Dec 2026",
    startingTotalBalance: 29500,
    advice: mockAdviceData,
}

const mocks:DebtsAdviceUiDataShape=resolveData<DebtsAdviceUiDataShape, typeof DebtsAdviceUiDataSchema >(
    "debtsUiData", 
    DebtsAdviceUiDataSchema, 
    defaultDebtsUiData,
    (data)=>data 
  )
  
  console.log("Does mocks equal default or  production data ????\n")
  console.log("Answer is : \n")
  if (mocks==defaultDebtsUiData){
    console.log("mocks equal the default data")
  }
  else{
    console.log("mocks equal the producton data")
  }
export default function SuccessiveValueFormulaModeling(){
   return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* "dumb" Stacked Area Chart component */}
        <MultiDebtPayoffTrajectory 
          trajectory={mocks.trajectory}
          debtKeys={mocks.debtKeys}
          monthsToTotalPayoff={mocks.monthsToTotalPayoff}        
          estimatedPayoffDate={mocks.estimatedPayoffDate}  
          startingTotalBalance={mocks.startingTotalBalance} 
          advice={mocks.advice}
        />
        
      </main>
    </div>
  ); 
}