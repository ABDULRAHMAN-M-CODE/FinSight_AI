import { Eye, EyeOff, ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import svgPaths from "./imports/svg-i38a9njwbx";
import { useSearchParams } from "react-router-dom";
type PasswordStrength = "weak" | "medium" | "strong" | null;

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      {met ? (<Check className="w-3.5 h-3.5 text-[#10b981]" />) : (<div className="w-3.5 h-3.5 rounded-full border border-[#4a4a5e]" />)}
      
      <span className={met ? "text-[#10b981]" : "text-[#6a6a7e]"}>{text}</span>
    </div>
  );
}


function useSetPasswordPage(){ 
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isThereError,setIsThereError]= useState(false);
    const [errorMsg,setErrorMsg]= useState(""); // think of How we should use it using conditional rendering  
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({ password: false, confirm: false });
    const passwordsMatch = confirmPassword && password === confirmPassword;
    const passwordsDontMatch = confirmPassword && password !== confirmPassword;
    //const isValid = password.length >= 12 && passwordsMatch;
    const isValid =password.length >= 12 &&/[A-Z]/.test(password) &&/[0-9]/.test(password) &&/[^A-Za-z0-9]/.test(password) &&
    passwordsMatch;

    const strengthColor = {
        weak: "#ef4444",
        medium: "#f59e0b",
        strong: "#10b981",
    };

    const strengthWidth = {
        weak: "33.33%",
        medium: "66.66%",
        strong: "100%",
    };

    const getPasswordStrength = (pwd: string): PasswordStrength => {
        if (!pwd) return null;
        if (pwd.length < 6) return "weak";
        if (pwd.length < 10) return "medium";
        if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) {
        return "strong";
        }
        return "medium";
    };
    const passwordStrength = getPasswordStrength(password);

    // this function is used By Form Element
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!isValid) return;
            setIsLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/reset-password", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                new_password:password.trim()
            }),
            });
            if (!response.ok){
                setIsLoading(false);
                setIsThereError(true);
                setErrorMsg("Unable to reset password. Please try again."); // Static massege.
                return;   
            }
        

                //cleean UI before navigation
                setIsLoading(false);
                setIsThereError(false);
                setPassword("");
                setConfirmPassword("");
                setTouched({ password: false, confirm: false });
                // naviage to other UI
                navigate("/ForgotPassword_SuccessfullReset");                   
        
            // catch Network Errors.
        }catch{
            setIsThereError(true);
            setErrorMsg("Network Error , check your internet connection.")
        }
    }
               
    // Return All the required Logic and states.
    return {

        password,
        setPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        isLoading,
        touched,
        passwordStrength,
        passwordsDontMatch,
        handleSubmit,
        strengthColor,
        strengthWidth,
        setTouched,
        confirmPassword,
        setConfirmPassword,
        passwordsMatch,
        isValid,
        isThereError,
        errorMsg
    };

}


export default  function SetPasswordPage() {
  const {

       
       password,
       setPassword,
       showPassword,
       setShowPassword,
       showConfirmPassword,
       setShowConfirmPassword,
       isLoading,
       touched,
       passwordStrength,
       passwordsDontMatch,
       handleSubmit,
       strengthColor,
       strengthWidth,
       setTouched,
       confirmPassword,
       setConfirmPassword,
       passwordsMatch,
       isValid,
       isThereError,
       errorMsg
    }= useSetPasswordPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-[#ef4444] rounded-full animate-pulse" />
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-[#ef4444] rounded-full animate-pulse delay-300" />
      <div className="absolute top-1/3 left-20 w-1.5 h-1.5 bg-[#f59e0b] rounded-full animate-pulse delay-700" />

      <div className="w-full max-w-[500px] relative">
        <div className="mb-12">
          <h1 className="text-[42px] text-white mb-4 tracking-tight">
            Enter a new password
          </h1>
          <p className="text-[18px] text-[#9ca3af]">
            Make sure it's a good one.
          </p>
        </div>
          {isThereError &&(   
            <div className="bg-white border-[0.635px] border-[rgba(0,0,0,0.1)] rounded-[10px] p-3 mb-5">
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
                  {errorMsg}
                </p>
              </div>
            </div>
           ) }

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Password Field */}
          <div>
            <label className="block text-[11px] text-[#9ca3af] uppercase tracking-[0.1em] mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="Enter your new password"
                disabled={isLoading}
                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-[12px] px-4 py-4 text-[16px] text-white placeholder:text-[#4a4a5e] focus:outline-none focus:border-[#3a3a4e] focus:ring-2 focus:ring-[#3a3a4e]/50 transition-all disabled:opacity-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6a7e] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1 h-1">
                  <div className="flex-1 bg-[#2a2a3e] rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: passwordStrength ? strengthWidth[passwordStrength] : "0%",
                        backgroundColor: passwordStrength ? strengthColor[passwordStrength] : "transparent",
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span
                    className="capitalize transition-colors"
                    style={{
                      color: passwordStrength ? strengthColor[passwordStrength] : "#6a6a7e",
                    }}
                  >
                    {passwordStrength ? `${passwordStrength} password` : ""}
                  </span>
                  <span className="text-[#6a6a7e]">{password.length} characters</span>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            {touched.password && password && (
              <div className="mt-3 space-y-1.5">
                <PasswordRequirement met={password.length >= 8} text="At least 12 characters" />
                <PasswordRequirement met={/[A-Z]/.test(password)} text="One uppercase letter" />
                <PasswordRequirement met={/[0-9]/.test(password)} text="One number" />
                <PasswordRequirement met={/[^A-Za-z0-9]/.test(password)} text="One special character" />
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-[11px] text-[#9ca3af] uppercase tracking-[0.1em] mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched({ ...touched, confirm: true })}
                placeholder="Re-enter your password"
                disabled={isLoading}
                className={`w-full bg-[#1a1a2e] border rounded-[12px] px-4 py-4 text-[16px] text-white placeholder:text-[#4a4a5e] focus:outline-none transition-all disabled:opacity-50 ${
                  passwordsDontMatch && touched.confirm
                    ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-2 focus:ring-[#ef4444]/50"
                    : passwordsMatch
                    ? "border-[#10b981] focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/50"
                    : "border-[#2a2a3e] focus:border-[#3a3a4e] focus:ring-2 focus:ring-[#3a3a4e]/50"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6a7e] hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Match Status */}
            {confirmPassword && (
              <div className="mt-3">
                {passwordsMatch ? (
                  <div className="flex items-center gap-2 text-[#10b981] text-[13px]">
                    <Check className="w-4 h-4" />
                    <span>Passwords match</span>
                  </div>
                ) : (
                  touched.confirm && (
                    <div className="flex items-center gap-2 text-[#ef4444] text-[13px]">
                      <X className="w-4 h-4" />
                      <span>Passwords don't match</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="group relative w-[80px] h-[80px] bg-transparent border-2 border-[#3a3a4e] rounded-[24px] flex items-center justify-center hover:border-white hover:bg-white/5 transition-all duration-300 disabled:opacity-40 disabled:hover:border-[#3a3a4e] disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

