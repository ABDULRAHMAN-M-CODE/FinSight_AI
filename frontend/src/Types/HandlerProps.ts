export type HandlerProps={
  currentStep:number;
  finishedProcessing:boolean;
  setFinishedProcessing:React.Dispatch<React.SetStateAction<boolean>>;
  setFinishedOnboarding:React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentStep:React.Dispatch<React.SetStateAction<number>>;
  
}