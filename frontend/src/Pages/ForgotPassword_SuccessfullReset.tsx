import { Link } from "react-router-dom";

export default function ForgotPassword_SuccessfullReset() {
  return (
    <div className="min-h-screen bg-[#2a2d34] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Success Message */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-white">
            Success!
          </h1>
          <p className="text-xl text-[#b0b0b0] leading-relaxed px-4">
            Your password has been changed. Be sure to take note of your new password.
          </p>
        </div>

        {/* Sign In Button */}
        <div className="pt-32">
          <Link
            to ="/Login"
            className="w-full max-w-sm mx-auto bg-[#c94848] hover:bg-[#b23e3e] text-white text-xl font-semibold py-5 px-8 rounded-lg transition-colors duration-200"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    </div>
  );
}
