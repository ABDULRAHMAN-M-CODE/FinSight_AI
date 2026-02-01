
import { Routes,Route} from 'react-router-dom';
import IntroStepper from './IntroStepper';
import WelcomePage from "./pages/welcomePage";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Questionarry from './pages/Questionarry';
function App() {    
   return(
    <Routes>
      <Route path="/" element={<WelcomePage />}/>
      <Route path='/Questionarry' element={<Questionarry />} />
      <Route path='/Login' element={<Login />} />
      <Route path="/IntroStepper"  element={<IntroStepper />}/>
      <Route path="/Signup"  element={<SignUp/>}/>
    </Routes>
  );
      
}
export default App
