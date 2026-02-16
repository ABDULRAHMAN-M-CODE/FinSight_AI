// React Router Related
import { Routes,Route} from 'react-router-dom';

// components related
import IntroStepper from './Pages/IntroStepper';
import WelcomePage from "./Pages/welcomePage";
import Login from "./Pages/Login";
import SignUpForm  from "./Pages/Signup";
import EmailVerification from './Pages/EmailVerification';

import PostSignup from './Pages/PostSignup';
import DataCollectionIntro from './Pages/DataCollectionIntro';
import ResetPassword from './Pages/ForgotPassword';
import EnterEmailToVerify from './Pages/EnterEmailToVerify';
import Dashboard from './Pages/Dashboard';
import ForgotPassword from './Pages/ForgotPassword';
import SetPasswordPage from './Pages/SetPasswordPage';
import ForgotPassword_SuccessfullReset from './Pages/ForgotPassword_SuccessfullReset';
import MultiStepFlow from './Pages/MultiStepFlow';
import InsuranceAdvice from './Pages/InsuranceAdvice';
import DebtAnalysis from './Pages/DebtAnalysis';
import MultiStepContex from './Pages/MultiStepContex';
function App() {    
   // [path="/"] is the  default route to be rendered 
   
   return(
    <Routes>

      <Route path="/" element={<WelcomePage />}/>
      <Route path='/Login' element={<Login />} />
      <Route path="/EmailVerification" element={<EmailVerification/>}/>
      <Route path="/IntroStepper"  element={<IntroStepper />}/>
      <Route path="/Signup"  element={ <SignUpForm /> } />
      <Route path="/PostSignup" element={<PostSignup />}/>
      <Route path="/DataCollectionIntro" element={<DataCollectionIntro />}/>
      <Route path="/ResetPassword" element={  <ResetPassword/>   } />
      <Route path="/EnterEmailToVerify" element={<EnterEmailToVerify />}/>
      <Route path="/Dashboard" element={<Dashboard />}/>
      <Route path="/ForgotPassword" element={<ForgotPassword />}/>
      <Route path="/SetPasswordPage" element={<SetPasswordPage />}/>
      <Route path="/ForgotPassword_SuccessfullReset" element={<ForgotPassword_SuccessfullReset />}/>
      <Route path="/MultiStepFlow" element={<MultiStepFlow />}/>
      <Route path="/InsuranceAdvice" element={<InsuranceAdvice />}/>
      <Route path="/DebtAnalysis" element={<DebtAnalysis />}/>
      <Route path='/MultiStepContex' element={<MultiStepContex />} />
      
    </Routes>
  );
      
}
export default App
