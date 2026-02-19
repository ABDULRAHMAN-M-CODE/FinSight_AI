import { type SubmittedUserInfoDuringDemo } from "./SubmittedUserInfoDuringDemo";
export type handleDemoSubmitProps={
      
       e:React.SubmitEvent<HTMLFormElement>;
       setIsLoading:React.Dispatch<React.SetStateAction<boolean>>;
       payload:SubmittedUserInfoDuringDemo ;
       url:string;
       localStorageKey:string;
       setFinishedProcessing:React.Dispatch<React.SetStateAction<boolean>>;
       setFinishedOnboarding:React.Dispatch<React.SetStateAction<boolean>>;

}