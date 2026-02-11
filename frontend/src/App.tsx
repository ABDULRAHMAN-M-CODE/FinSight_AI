// React Router Related
import { Routes,Route} from 'react-router-dom';

// components related
import IntroStepper from './pages/IntroStepper';
import WelcomePage from "./pages/welcomePage";
import Login from "./pages/Login";
import SignUpForm  from "./pages/Signup";
import EmailVerification from './pages/EmailVerification';
import FinancialProfileForm from './pages/FinancialProfileForm';
import PostSignup from './pages/PostSignup';
import DataCollectionIntro from './pages/DataCollectionIntro';
import ResetPassword from './pages/ForgotPassword';
import EnterEmailToVerify from './pages/EnterEmailToVerify';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import SetPasswordPage from './pages/SetPasswordPage';
import ForgotPassword_SuccessfullReset from './pages/ForgotPassword_SuccessfullReset';
import MultiStepFlow from './pages/MultiStepFlow';
import InsuranceAdvice from './pages/InsuranceAdvice';
import DebtAnalysis from './pages/DebtAnalysis';
function App() {    
   // [path="/"] is the  default route to be rendered 
   
   return(
    <Routes>

      <Route path="/" element={<WelcomePage />}/>
      
      <Route path='/Login' element={<Login />} />
      <Route path='/FinancialProfileForm' element={<FinancialProfileForm />} />
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
      
    </Routes>
  );
      
}
export default App
