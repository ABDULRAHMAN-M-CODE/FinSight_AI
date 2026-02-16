


//reusable UI components
import { AlertCircle, Clock,  Loader2, Mail } from "lucide-react";

//  hooks
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


//Redux Related: Reading State from Store
import { useSelector } from "react-redux";
import type { RootState } from "../Store";


// Logic and States Lives here
function useEmailVerification({email}:{email:string}) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const[emailResendingSucceded,setEmailResendingSucceded]= useState(false);
  const navigate=useNavigate();
  
  const handleVerificationSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!verificationCode.trim()) {                     // if user clicked button without providing verification code.
      setError("Please enter the verification code");
      setIsLoading(false);
      return;
      
    }
                                                        // if user provided verification code and clicked the button
  try {
      const response = await fetch("http://127.0.0.1:8000/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           
          code: verificationCode.trim() 
        }),
      });

      if (!response.ok) {
    
        const data = await response.json();
        setError(data.detail || "Verification failed");
        return;
      }
       
      // success , verification succeeded, I can redirect user to other UI 
      // should navigate to the Signup Success.
      navigate("/PostSignup");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }


  };


  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/auth/resend-verification", {// asking backend to resend the code
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {// if this if statement is not executed , email is resented successfully
        const data = await response.json();
        setError(data.detail || "Failed to resend code");
        return;
      }
     
      setEmailResendingSucceded(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return{

    handleVerificationSubmit,
    error,
    verificationCode,
    setVerificationCode,
    isLoading,
    handleResendCode,
    emailResendingSucceded,
    setEmailResendingSucceded

  }
}


//Rendering Lives here 
export default function EmailVerification() {
    // Redux Related : Read state from the store
    const email= useSelector((state:RootState)=>state.auth.email);
    
    const
     {
        handleVerificationSubmit, 
        error, 
        verificationCode, 
        setVerificationCode, 
        isLoading, 
        handleResendCode, 
        emailResendingSucceded,
        setEmailResendingSucceded
    }= useEmailVerification({email});
    
    //I do not understand why I needed this useEffect.
    useEffect(() => { //  
    if (emailResendingSucceded) {
      const timer = setTimeout(() => {
        setEmailResendingSucceded(false);
      }, 5000); // hide message after 5 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [emailResendingSucceded]); 

  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="text-center px-6 pt-8 pb-6">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Email</h1>
        <p className="text-gray-600">
          We've sent a verification code to your email address
        </p>
      </div>

      <form onSubmit={handleVerificationSubmit}>
        <div className="px-6 pb-6 space-y-4">
          {/* Info Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Verification Code Sent</p>
              <p className="text-sm text-blue-800 mt-1">
                Please check your email for the verification code. The code will expire in{" "}
                <span className="font-semibold">10 minutes</span>.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Input Field */}
          <div className="space-y-2">
            <label 
              htmlFor="verificationCode" 
              className="block text-sm font-medium text-gray-700"
            >
              Enter Verification Code
            </label>
            <input
              id="verificationCode"
              type="text"
              placeholder="Enter your code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : "border-gray-300"
              } ${isLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500">
              Please enter the code exactly as it appears in your email
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } flex items-center justify-center`}
            
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>

          <div className="text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-blue-600 hover:underline font-medium disabled:text-gray-400"
              disabled={isLoading}
            >
              Resend Code
            </button>
            {emailResendingSucceded && (
  <p className="text-green-600 text-sm mt-2">Verification code resent successfully! please check your email again</p>
)}

          </div>
        </div>
      </form>
    </div>
  );

}