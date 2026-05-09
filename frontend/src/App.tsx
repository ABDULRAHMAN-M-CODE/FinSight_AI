// For navigation between  components
import { Routes,Route} from 'react-router-dom';

// Reusable components
import IntroStepper from './Pages/IntroStepper';
import WelcomePage from "./Pages/WelcomePage";
import Login from "./Pages/Login";
import SignUpForm  from "./Pages/Signup";
import EmailVerification from './Pages/EmailVerification';
import PostSignup from './Pages/PostSignup';
import ResetPassword from './Pages/ForgotPassword';
import EnterEmailToVerify from './Pages/EnterEmailToVerify';
import Dashboard from './Pages/Dashboard';
import ForgotPassword from './Pages/ForgotPassword';
import SetPasswordPage from './Pages/SetPasswordPage';
import ForgotPassword_SuccessfullReset from './Pages/ForgotPassword_SuccessfullReset';

import MultiStepContext from './Pages/MultiStepContext';
import PostMultiStepContext from './Pages/PostMultiStepContext';

import SuccessiveValueFormulaModeling from './Pages/SuccessiveValueFormulaModeling';
import SettingsPage from './Pages/SettingsPage';
import MainLayout from './Pages/MainLayout';
import PortfolioAnalytics from './Pages/PortfolioAnalytics';
import StreamViewer from './Pages/StreamViewer';
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
      <Route path="/ResetPassword" element={  <ResetPassword/>   } /> 
      <Route path="/EnterEmailToVerify" element={<EnterEmailToVerify />}/> 
      <Route path="/Dashboard" element={<Dashboard />}/> 
      <Route path="/ForgotPassword" element={<ForgotPassword />}/> 
      <Route path="/SetPasswordPage" element={<SetPasswordPage />}/> 
      <Route path="/ForgotPassword_SuccessfullReset" element={<ForgotPassword_SuccessfullReset />}/> 
      
      <Route path='/MultiStepContext' element={<MultiStepContext />} /> 
      <Route path="/PostMultiStepContext" element={<PostMultiStepContext />}/>
      <Route path="/StreamViewer" element={<StreamViewer />}/>  
      <Route path="MainLayout" element={<MainLayout />}> 
          <Route index element={<PortfolioAnalytics />}/>
          <Route path="DebtsAdvice" element={<SuccessiveValueFormulaModeling />}/>
          <Route path="SettingsPage" element={<SettingsPage />}/>
      </Route> 
    </Routes>
  );
      
}
export default App
