

import { AlertCircle, Clock,  Loader2, Mail } from "lucide-react";
import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// error's shape
  interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  full_name?: string;
  phone_number?: string;
  general?: string;
}

// formData object's shape
interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone_number: string;
}

// this interface is used as type of the props of the Default State component. 
interface DefaultProbs{
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  emailExistsError: boolean;
  errors: FormErrors;
  formData: SignupFormData;
  handleInputChange: (field: keyof SignupFormData, value: string) => void;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
}
////////////////////////////////////

function VerificationSucceded(){
  const navigate=useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-2xl mb-4 text-gray-900">Email Verified Successfully!</h1>
        
        <p className="text-gray-600 mb-8">
          Your email has been verified. You can now access all features of your account.
        </p>
        
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}

//////////////////////////////////////
function useEmailVerification({email,setVerificationSucceded}:{email:string, setVerificationSucceded:(b:boolean)=>void}) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const[emailResendingSucceded,setEmailResendingSucceded]= useState(false);
  // we will explore later how to use this state
      
  
  const handleVerificationSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }
    // email is not defined in this custome hook , who is responsible to proivde it and how ? answer is : 

    setIsLoading(true);
  try {
      const response = await fetch("/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      
        body: JSON.stringify({ email, code: verificationCode.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Verification failed");
        return;
      }

      // success , verification succeeded, I can redirect user to dashboard 
      setVerificationSucceded(true);
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
 function EmailVerification({email,  setVerificationSucceded}:{email:string, setVerificationSucceded:(b:boolean)=>void}) {
  // THE ONLY TASK TO CHATGPT , TASK A : now how can I exploit the emailResendingSucceded state to notify the user in the current UI that code was resent ? 
  
  const {handleVerificationSubmit, error, verificationCode, setVerificationCode, isLoading, handleResendCode, emailResendingSucceded,setEmailResendingSucceded} = useEmailVerification({email, setVerificationSucceded});
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
                <span className="font-semibold">24 hours</span>.
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
//////////////////////////////////////
function DefaultState( {handleSubmit, emailExistsError, errors,formData, handleInputChange, isLoading, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword}:DefaultProbs){
return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 text-center border-b">
        <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
        <p className="text-gray-600">Sign up to get started. All fields marked with * are required.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* STATE 6: Email already exists error */}
          {emailExistsError && errors.general && (
            <div className="border border-red-300 bg-red-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Email Already Exists</h3>
                  <p className="text-sm text-red-800">
                    This email is already registered. Please{" "}
                    <a href="#signin" className="underline font-medium">sign in</a>{" "}
                    or use a different email address.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* STATE 5: Weak password error */}
            {errors.password && (
              <div className="border border-red-300 bg-red-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-red-800">
                    <strong>Weak Password:</strong> {errors.password.replace("Weak password: ", "")}
                  </p>
                </div>
              </div>
            )}
            {!errors.password && (
              <p className="text-xs text-gray-500">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* STATE 4: Password mismatch error */}
            {errors.confirmPassword && (
              <div className="border border-red-300 bg-red-50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-800">
                    <strong>Password Mismatch:</strong> {errors.confirmPassword.replace("Password mismatch: ", "")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.full_name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.full_name}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone_number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone_number ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.phone_number}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* STATE 3: Loading state */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="#signin" className="text-blue-600 hover:underline">Sign in</a>
          </p>
        </div>
      </form>
    </div>
  );

}
///////////////////////////////////////////

function useSignupForm() {

const [formData, setFormData] = useState<SignupFormData>({ // 
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone_number: "",
  });

 
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  
  const [emailExistsError, setEmailExistsError] = useState(false);
  const [verificationSucceded, setVerificationSucceded] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}; // 

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) { //
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) { //
      newErrors.password = "Weak password: Must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) { //
      newErrors.password = "Weak password: Must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password mismatch: Passwords do not match";
    }

    if (formData.phone_number && !/^\+?[\d\s\-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number format";
    }

    setErrors(newErrors);//
    return Object.keys(newErrors).length === 0;//return true or flase.
  };

  
const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  setErrors({});
  setEmailExistsError(false);
  setShowEmailVerification(false);// 

  if (!validateForm()) return;

  setIsLoading(true);

  try {
  
    
    const response = await fetch("/auth/register", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
      }),
    });

if (!response.ok) {
  const data = await response.json();

  if (data.detail === "Email already registered") { // adjust to your backend message
    setEmailExistsError(true);
    setErrors({ general: data.detail });
  } else {
    setErrors({ general: typeof data.detail === "string" ? data.detail : "Registration failed" });
  }

  return;
}


    // SUCCESS: email sent, now verification is pending
    setShowEmailVerification(true); // I do not know if the name describe it's intended purpose or not , any way , does this line means the signup was succesful , or does it mean that the client side validation is passed ? answer is: the signup was succesful, the proof is : 
  } catch {
    setErrors({ general: "Network error. Try again." });
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === "email" && emailExistsError) {
      setEmailExistsError(false);
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };


   return {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showEmailVerification,
    emailExistsError,
    handleInputChange,
    handleSubmit,
    verificationSucceded,
    setVerificationSucceded
  };

}
export  default function SignupForm() {
  const 
  {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    showEmailVerification,
    emailExistsError,
    handleInputChange,
    handleSubmit,
    verificationSucceded,
    setVerificationSucceded
  } = useSignupForm();
  if (showEmailVerification) { 
    
    return (
    <EmailVerification email={formData.email}  setVerificationSucceded={setVerificationSucceded}/>
    );
     
  }
else if (verificationSucceded) {

    return (
      <VerificationSucceded/>
    );
// default state : 
  

}
else{

    return (

      <DefaultState 
       handleSubmit={ handleSubmit}
       emailExistsError={emailExistsError} 
       errors={errors} 
       formData={formData} 
       handleInputChange={handleInputChange} 
       isLoading={isLoading} 
       showPassword={showPassword} 
       setShowPassword={setShowPassword} 
       showConfirmPassword={showConfirmPassword} 
       setShowConfirmPassword={setShowConfirmPassword} 
      />
    );  
    
  }

}
export {useSignupForm};
