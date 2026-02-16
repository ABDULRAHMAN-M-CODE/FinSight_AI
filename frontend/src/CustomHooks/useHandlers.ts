//navigation Logic custom hook 
import type { HandlerProps } from "../Types/HandlerProps";
export function useHandlers({currentStep,finishedProcessing,setFinishedProcessing,setFinishedOnboarding,setCurrentStep}:HandlerProps){
      




      const handleNext = () => {
        
        if (currentStep < 3) {
          
          if (currentStep===1){
              
              setFinishedProcessing(false);   
          }          
          if (currentStep==2){

              setFinishedOnboarding(true);
              
          } 
          setCurrentStep(currentStep + 1);
          
        }
      };
      const handleBack = () => {
        if (currentStep > 1) {
            if (currentStep===2&& finishedProcessing){
                  
                  
                  setFinishedProcessing(false);
                  

                  return // ensure the user stay in step 2  to see the form 
            }
            
          setCurrentStep(currentStep - 1);
          
        }
      };
      const handleEditRequest=()=>{
          handleBack();
          setFinishedProcessing(false);
      }

      return {
        handleNext,
        handleBack,
        handleEditRequest
      };
      
}
