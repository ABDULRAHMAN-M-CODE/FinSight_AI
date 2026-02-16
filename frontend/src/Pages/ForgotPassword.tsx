 
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import svgPaths from "../Imports/svg-i38a9njwbx";
type ResetState = "default" | "loading" | "success" | "error";


function useForgotPassword(){
  const [resetState, setResetState] = useState<ResetState>("default");
  const [resetEmail, setResetEmail] = useState("");
  const [msg, setMsg]=useState("");
  // Simulate password reset
  const handlePasswordReset = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg("");
    setResetState("loading");

      try {
          const response = await fetch("http://127.0.0.1:8000/auth/forgot-password", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email:resetEmail.trim().toLowerCase()
          }),
        });
        // no condition, always set the same genericMsg.
        setResetState("success");
        const genericMsg =await response.json();
        setMsg(genericMsg.message);
        
      }catch{
        setResetState("error");
        setMsg("Network error, check your internet connection.");
      }
      }

      return{
        handlePasswordReset,
        resetState,
        resetEmail,
        setResetEmail,
        msg
      };
}

export default function ForgotPassword() {
  const {
     handlePasswordReset,
     resetState,
     resetEmail,
     setResetEmail,
    msg}= useForgotPassword();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f5] p-4">
      <div className="bg-white rounded-[14px] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] border-[0.635px] border-[rgba(0,0,0,0.1)] w-full max-w-[448px] p-6">
        <div className="mb-6">
          <Link
            to="/Login"
            className="flex items-center gap-2 text-[#717182] text-[14px] hover:text-[#030213] transition-colors mb-8 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9921 15.9921">
              <g>
                <path d="M3.33168 7.99603L1.33168 7.99603M3.33168 7.99603L4.66501 6.66269M3.33168 7.99603L4.66501 9.32936" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                <path d="M12.6604 7.99603H3.33168" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
              </g>
            </svg>
            Back to login
          </Link>
          <h1 className="text-[24px] text-[#0a0a0a] mb-4">Reset Password</h1>
          <p className="text-[16px] text-[#717182]">
            Email is Required to reset your password 
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-6">
          {resetState === "error" &&(   
            <div className="bg-white border-[0.635px] border-[rgba(0,0,0,0.1)] rounded-[10px] p-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9921 15.9921">
                    <g clipPath="url(#clip0_error)">
                      <path d={svgPaths.p2d997d00} stroke="#D4183D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                      <path d="M7.99603 5.33069V7.99603" stroke="#D4183D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                      <path d="M7.99603 10.6614H8.00269" stroke="#D4183D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                    </g>
                    <defs>
                      <clipPath id="clip0_error">
                        <rect fill="white" height="15.9921" width="15.9921" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p 
                  className="text-[14px] leading-[20px] text-[rgba(212,24,61,0.9)] " 
                    
                >
                  {msg}
                </p>
              </div>
            </div>
           ) }
            {resetState === "success" && (
              <div className="bg-white border-[0.635px] border-[rgba(0,0,0,0.1)] rounded-[10px] p-3">
                <div className="flex gap-3">
                  {/* Optional success icon */}
                  <div className="flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="green"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-[14px] leading-[20px] text-green-500">{msg}</p>
                </div>
              </div>
            )}


          <div>
            <label className="block text-[14px] text-[#0a0a0a] mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={resetState === "loading"}
                className={`w-full bg-[#f3f3f5] rounded-[8px] pl-10 pr-3 py-2 text-[14px] text-[#0a0a0a] placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-[#030213] ${
                  resetState === "loading" ? "opacity-50" : ""
                }`}
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9921 15.9921">
                  <g clipPath="url(#clip0_email)">
                    <path d={svgPaths.p1b29e200} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                    <path d={svgPaths.p24d56a00} stroke="#717182" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33267" />
                  </g>
                  <defs>
                    <clipPath id="clip0_email">
                      <rect fill="white" height="15.9921" width="15.9921" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>  
          {resetState!=="success" ? 
          (<button
            type="submit"
            disabled={resetState === "loading"}
            className={`w-full bg-[#030213] text-white rounded-[8px] px-4 py-2 text-[14px] flex items-center justify-center gap-2 hover:bg-[#1a1a2e] transition-colors ${
              resetState === "loading" ? "opacity-50" : ""
            }`}
          >
            {resetState === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
            {resetState === "loading" ? "Sending..." : "continue"}
          </button>) : (<Link to="/Login" className="w-full bg-[#030213] text-white rounded-[8px] px-4 py-2 text-[14px] flex items-center justify-center gap-2 hover:bg-[#1a1a2e]"  >Go to Login</Link>) }

        </form>
      </div>
    </div>
  );
}


  
  