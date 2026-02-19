// types
import { type limitedAdvice } from "../../../Types/limitedAdviceData";
import { type handleDemoSubmitProps } from "../../../Types/ handleDemoSubmitProps";

// funcitons
import { finalize } from "./finalize";
import { setup } from "./setup";
import { handleFormSubmit } from "./handleFormSubmit";
import { extractAndSaveDataToLocalStorage } from "./extractAndSaveDataToLocalStorage ";

export const  handleDemoSubmit= async({e,setIsLoading, payload, url, localStorageKey, setFinishedProcessing, setFinishedOnboarding }: handleDemoSubmitProps)=>{
                      // Task : put all of the following inside one function and call it once, this improves code readability.
                      // set some flag
                      setup({e, setIsLoading});
                      
                      const response= await handleFormSubmit({e,setIsLoading,payload, url});
                      // this if statement is not redable,  is it true that the if statement is not readable apply separation of concerns for code readablity
                      if (!response) {
                          setIsLoading(false);
                          alert("error happened")
                          return;
                      }

                      
                      extractAndSaveDataToLocalStorage<limitedAdvice>({response,localStorageKey });
                      
                      //clear some flags 
                      finalize({setIsLoading ,setFinishedProcessing, setFinishedOnboarding});


}