// For navigation between  components
import { Routes,Route} from 'react-router-dom';


// Reusable components
import IntroStepper from './Pages/IntroStepper';
import WelcomePage from "./Pages/WelcomePage";
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
import MultiStepContext from './Pages/MultiStepContext';
import PostMultiStepContext from './Pages/PostMultiStepContext';
import InsuranceAdvice from './Pages/InsuranceAdvice';
import SuccessiveValueFormulaModeling from './Pages/SuccessiveValueFormulaModeling';
import GoalsAndInvestementsAdvice  from './Pages/GoalsAndInvestementsAdvice';
import SettingsPage from './Pages/SettingsPage';
import MainLayout from './Pages/MainLayout';
import RiskAssessment from './Components/InvestementsRiskProfileAssasementCard';

//import PortfolioAnalytics from './Pages/PortfolioAnalytics';
import PortfolioAnalytics from './Pages/PortfolioAnalytics';
function App() {    
   // [path="/"] is the  default route to be rendered 
   
   return(
    <Routes>

      <Route path="/" element={<WelcomePage />}/>{/**flat */}
      <Route path='/Login' element={<Login />} />
      <Route path="/EmailVerification" element={<EmailVerification/>}/>{/**flat */}
      <Route path="/IntroStepper"  element={<IntroStepper />}/>{/**flat */}
      <Route path="/Signup"  element={ <SignUpForm /> } />{/**flat */}
      <Route path="/PostSignup" element={<PostSignup />}/>{/**flat */}
      <Route path="/DataCollectionIntro" element={<DataCollectionIntro />}/>{/**flat */}
      <Route path="/ResetPassword" element={  <ResetPassword/>   } />{/**flat */}
      <Route path="/EnterEmailToVerify" element={<EnterEmailToVerify />}/>{/**flat */}
      <Route path="/Dashboard" element={<Dashboard />}/>{/**flat */}
      <Route path="/ForgotPassword" element={<ForgotPassword />}/>{/**flat */}
      <Route path="/SetPasswordPage" element={<SetPasswordPage />}/>{/**flat */}
      <Route path="/ForgotPassword_SuccessfullReset" element={<ForgotPassword_SuccessfullReset />}/>{/**flat */}
      <Route path="/MultiStepFlow" element={<MultiStepFlow />}/>{/**flat */}
      <Route path='/MultiStepContext' element={<MultiStepContext />} />{/**flat */}
      <Route path="/PostMultiStepContext" element={<PostMultiStepContext />}/>{/**flat */}
      {/**<Route path="/RiskAssessment" element={<RiskAssessment />}/> }
      {/**The following is supposed to be Main dashabord which have 3  components inside it , but this is new knoweldge to me ! , all I'm used to is flat things, I did not face a problem where I need nested components tell today! */}
      
      <Route path="MainLayout" element={<MainLayout />}> 

          <Route index element={<PortfolioAnalytics />}/>
          <Route path="DebtsAdvice" element={<SuccessiveValueFormulaModeling />}/>
          <Route path="InsuranceAdvice" element={<InsuranceAdvice />}/>
          <Route path="SettingsPage" element={<SettingsPage />}/>
      </Route>  {/** but I wnder, Why not to use createBrowserRouter ? so that I get to know new mechanism?  can I keep all the flat routes as they are , and just add nested routes using createBrowserRouter for the MainLayout? */}
    </Routes>

  );
      
}
export default App
