// This code is not related to veirfication , the following code is related to the fact the user is Submitting form info, that form did appear only after verification, should  'include' the credintials ?
import { type FetchDataProps } from "../../Types/FetchDataProps";
// This is a pass-through method, it does nothing beside calling another function; remove it!
export  const FetchData = async ( {payload, url}: FetchDataProps)=>{
    
      //  Example of url : "http://127.0.0.1:8000/demo/demo"        
      const response = await fetch(url, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        
        body: JSON.stringify(payload),
      });

    
     return response;
};