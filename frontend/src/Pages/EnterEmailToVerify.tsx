import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux'; // Redux related
import { setEmail as setGlobalEmail } from '../Store/authSlice';// Redux Related :  " Email is shared"

import { Mail, ArrowRight } from 'lucide-react';

// Not Deployable Logic Yet
function useEnterEmailToVerify(){
  
  const [email, setEmail] = useState('');
  
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {

    // guard against page reload.
    e.preventDefault();

    dispatch(setGlobalEmail(email));

    navigate("/EmailVerification")
  
  };
  return{
   email,
   handleSubmit,
   setEmail
  };
}

export default function EnterEmailToVerify() {
   const {email,setEmail,handleSubmit}=useEnterEmailToVerify();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" aria-hidden="true" />
            </div>
          </div>
          
          <h1 className="text-slate-900 mb-3 text-center">
            Enter Your Email
          </h1>
          <p className="text-slate-600 mb-8 text-center">
            We'll use this email to send you a verification code
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 active:scale-98 transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
