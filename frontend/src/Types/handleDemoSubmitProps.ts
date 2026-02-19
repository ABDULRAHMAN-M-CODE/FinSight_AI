import React from "react";


export type  handleFormSubmitProps={

  e:React.SubmitEvent<HTMLFormElement>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  payload:any;

  url:string;
}