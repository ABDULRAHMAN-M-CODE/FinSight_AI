// types
import { type handleFormSubmitProps } from "../../../Types/handleDemoSubmitProps";

// functions
import { FetchData } from "../fetchData";

// main function

// Pass object when you want to call this functon, because  it is  destructing  it's  props.
export const  handleFormSubmit= async ({setIsLoading,payload, url} : handleFormSubmitProps )=>{
      

      try{
       

       const response=await FetchData({payload,url}) // what is the type returned by 
       return response;

      }catch(error){          
        setIsLoading(false);        
        
        console.log(error);
        alert("network error")
        // set error masseges here.
      }


}