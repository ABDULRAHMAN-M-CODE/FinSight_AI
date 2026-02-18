// API calling : function, not component
import { type FetchDataProps} from "../Types/FetchDataProps";
import { type limitedAdvice } from "../Types/limitedAdviceData";
 // Task 1 : make this function fully reusable
export  const FetchData = async (e: React.SubmitEvent<HTMLFormElement>, {setIsLoading,setFinishedProcessing, setFinishedOnboarding,investmentAccounts,goals}: FetchDataProps)=>{
      
       // dont call custom hook inside async function or any function.
      
      // prevents page reload
      e.preventDefault();
      
      //showing the loading effect for better UX design. 
      setIsLoading(true);

      // this will be send to backend.
      const payload = {
        investment_accounts: investmentAccounts,
        financial_goals:goals, // <--- Add the 'n' here
      };

      

      // frontend → backend → LLM → backend→ frontend .
      try {
        // make the URL reusable
      const response = await fetch("http://127.0.0.1:8000/demo/demo", { // check URL later 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
          setIsLoading(false);
          alert("error happened")
          return;
      }

      // persist the ai response to withstand page reloads.  
      const AI_RESPONSE:limitedAdvice= await response.json();
      localStorage.setItem("AI_RESPONSE", JSON.stringify(AI_RESPONSE));

      setIsLoading(false);
      
      
      setFinishedProcessing(true);
      

      
      setFinishedOnboarding(false);
      


      } catch (error) {
      setIsLoading(false);
      // use error masseges instead of alert, better user experience.
      alert("Connection failed, please check your internet connection and try again")
      } 

};