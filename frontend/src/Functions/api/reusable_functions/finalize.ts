import { type finalizeProps } from "../../../Types/finalizeProps";
export const finalize= ({setIsLoading ,setFinishedProcessing, setFinishedOnboarding}:finalizeProps)=>{

      setIsLoading(false);
      setFinishedProcessing(true);
      setFinishedOnboarding(false);
}