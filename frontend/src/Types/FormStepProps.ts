import { type InvestmentAccount } from "./InvestmentAccount";
import { type Goal } from "./Goal";

export type FormStepProps={
  isLoading:boolean;
  finishedProcessing:boolean;
  setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
  setFinishedProcessing:React.Dispatch<React.SetStateAction<boolean>>;
  setFinishedOnboarding:React.Dispatch<React.SetStateAction<boolean>>;
  investment_accounts:InvestmentAccount[];
   financial_goals: Goal[];
  setInvestmentAccounts:React.Dispatch< React.SetStateAction< InvestmentAccount[] > >;
  setGoals:React.Dispatch< React.SetStateAction< Goal[] > >;
  handleBack: ()=> void;
  handleNext:()=>void;  

}