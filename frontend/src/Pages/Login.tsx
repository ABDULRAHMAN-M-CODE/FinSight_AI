

import { useState } from "react";


import svgPaths from "../Imports/svg-i38a9njwbx";
import { Loader2 } from "lucide-react";
import {  useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { type FullAdviceDataType } from "./MultiStepContext";
import { FullAdviceDataSchema } from "./MultiStepContext";
type LoginState = "default" | "filled" | "loading" | "error";
type BackendExcpetion={
  status_code:number;
  detail:string;
}
type LoginResponse={
    message: string;
    first_login: boolean
}

// Logic , make it works (functional) , make it readable  , optimize 
function  useLoginPageLogic(){
  
  
  const [loginState, setLoginState] = useState<LoginState>("default");
  
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");

  // Instead of Figma's Simulation code, I wrote this .
  const navigate = useNavigate();
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    setLoginState("loading");
    
    try{
    const response = await fetch("http://localhost:8000/auth/login", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials:"include",
      body: JSON.stringify({   
        email: email.trim().toLowerCase(),
        password: password
      }),
    });

    if (!response.ok) { 
      
        setLoginState("error");// can't set error massege  if  not in the error state.
        const errorData:BackendExcpetion= await response.json();
        console.log("status code is : ",errorData.status_code,"\n")
        setErrorMessage(errorData.detail)
        return;
    }
    const data: LoginResponse = await response.json();
    console.log("data returned from auth/login route is: ",  data,'\n');
    if (data.first_login){
      setLoginState("default")
      navigate("/MultiStepContext");
      return;
    }

    
    try{
      const response1 = await fetch("http://localhost:8000/dashboard", { 
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials:"include"
      });
    if (!response1.ok) { 
      
        setLoginState("error");// can't set error massege  if  not in the error state.
        const errorData:BackendExcpetion= await response1.json();
        console.log("status code is : ",errorData.status_code,"\n")
        setErrorMessage(errorData.detail)
        return;
    }
      const fullAdviceData: FullAdviceDataType = await response1.json();
      const result=FullAdviceDataSchema.safeParse(fullAdviceData); // run time validation on the unknown data, checks the 'correctness' of the  existing data
      console.log(`safeParse result inside the Login.tsx  content is ${result}`)
      if(result.success){
          console.log("run time validation succeed!, results stored in the local storage")
          localStorage.setItem("FullAdviceData", JSON.stringify(fullAdviceData));// storing response as key:value in the local storage
          setLoginState("default")
          navigate("/MainLayout");
      }
      
      else{
          setLoginState("error");
          setErrorMessage("Run Time validation failed inside Login.tsx")
      }    
    }catch(error){
      console.log(error) 
      setLoginState("error")
      setErrorMessage( "Network error , please try again later." );

    }

        setLoginState("default");

    }catch(error){ 
      console.log(error) 
      setLoginState("error")
      setErrorMessage( "Network error , please try again later." );
    }

  };

  return {
  
    handleLogin,
    loginState,
    email,
    errorMessage,
    setEmail,
    setLoginState,
    password,
    setPassword,
    resetEmail,
    setResetEmail,
  };
}

//Rendering
export  default function LoginPage() {

    const { 
      handleLogin,
      loginState,
      email,
      errorMessage,
      setEmail,
      setLoginState,
      password,
      setPassword,
    } = useLoginPageLogic(); // Separation between Logic and Rendering : Enahnce reusability of the Logic.
 
    return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f5] p-4">
      <div className="bg-white rounded-[14px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] border-[0.635px] border-[rgba(0,0,0,0.1)] w-full max-w-[448px] p-6">
        <div className="mb-6 text-center">
          <h1 className="text-[24px] text-[#0a0a0a] mb-2">Welcome Back</h1>
          <p className="text-[16px] text-[#717182]">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {loginState === "error" && (
            <div className="bg-white border-[0.635px] border-[rgba(0,0,0,0.1)] rounded-[10px] p-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9921 15.9921">
                    <g clipPath="url(#clip0_login_error)">
                      <path d={svgPaths.p2d997d00} stroke="#D4183D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                      <path d="M7.99603 5.33069V7.99603" stroke="#D4183D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                      <path d="M7.99603 10.6614H8.00269" stroke="#D4183D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                    </g>
                    <defs>
                      <clipPath id="clip0_login_error">
                        <rect fill="white" height="15.9921" width="15.9921" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[14px] text-[rgba(212,24,61,0.9)] leading-[20px]">{errorMessage}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[14px] text-[#0a0a0a] mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (loginState === "error") setLoginState("default");
                }}
                placeholder="name@example.com"
                disabled={loginState === "loading"}
                className={`w-full bg-[#f3f3f5] rounded-[8px] pl-10 pr-3 py-2 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#030213] ${
                  loginState === "loading" ? "opacity-50" : ""
                }`}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9921 15.9921">
                  <g clipPath="url(#clip0_email_login)">
                    <path d={svgPaths.p1b29e200} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                    <path d={svgPaths.p24d56a00} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                  </g>
                  <defs>
                    <clipPath id="clip0_email_login">
                      <rect fill="white" height="15.9921" width="15.9921" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[14px] text-[#0a0a0a] mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginState === "error") setLoginState("default");
                }}
                placeholder="Enter your password"
                disabled={loginState === "loading"}
                className={`w-full bg-[#f3f3f5] rounded-[8px] pl-10 pr-3 py-2 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#030213] ${
                  loginState === "loading" ? "opacity-50" : ""
                }`}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9921 15.9921">
                  <g clipPath="url(#clip0_password)">
                    <path d={svgPaths.p25bd600} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                    <path d={svgPaths.p2cd94240} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                  </g>
                  <defs>
                    <clipPath id="clip0_password">
                      <rect fill="white" height="15.9921" width="15.9921" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-between ">
            <Link
              to="/ResetPassword"
              className={`text-[14px] text-[#030213] hover:underline text-blue-500`}  
            >
              Forgot password?
            </Link>
             
            <Link
            to="/EnterEmailToVerify"
            className={`text-[14px] text-[#030213] hover:underline text-blue-500`}
            >
              Unverified email?
            </Link>
            <Link
            to="/Signup"
            className={`text-[14px] text-[#030213] hover:underline text-blue-500`}
            >
              create account
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginState === "loading"}
            className={`w-full bg-[#030213] text-white rounded-[8px] px-4 py-2 text-[14px] flex items-center justify-center gap-2 hover:bg-[#1a1a2e] transition-colors ${
              loginState === "loading" ? "opacity-50" : ""
            }`}
          >
            {loginState === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
            {loginState === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
