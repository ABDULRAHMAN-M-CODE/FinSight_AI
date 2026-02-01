//import { useDispatch } from 'react-redux';
//import { setPage } from '../mainSlice';

import {useNavigate } from 'react-router-dom';
import screenshot1 from '../assets/Dashboard2.png';
import screenshot3 from '../assets/whatIF.png';
import screenshot2 from '../assets/image.png';
import FinanceLogo from './Logo';
export default function WelcomePage() {
  //what the first div styling is doing: min-h-screen makes sure the div takes at least the full height of the viewport,the reason we want the first div to have full heigh is to ensure that the welcome page covers the entire screen height regardless of the content inside it.
  //bg-[#0a2540] sets the background color to a dark blue shade
  //text-white sets the default text color to white for better contrast against the dark background
  // in css, I used to say "border: solid red", how to make this effect in tailwind? -> border border-red-500
    const navigateTO= useNavigate();
  return (
    <div className="min-h-screen bg-[#0a2540] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <FinanceLogo size={60} />
            </div>
            <span className="text-xl font-medium ">FinSight AI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 border border-white/30 rounded-md text-white hover:bg-white/10 cursor-pointer  transition-colors" onClick={()=>navigateTO("/Login") }>
            Login
          </button>
          <button className="px-6 py-2.5 border border-white/30 rounded-md text-white hover:bg-white/10 cursor-pointer transition-colors" onClick={() => navigateTO("/Signup")}>
            Sign up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Hero Text */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl leading-tight">
                reach your goals with AI-powered financial guidance
              </h1>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                track progress and receive personalized financial recommendations with adaptive AI that helps you make smarter decisions every day.
              </p>
            </div>
            
            <div>
              <button className="px-8 py-3.5 bg-white text-[#0a2540] rounded-md font-medium hover:bg-gray-100 transition-colors" onClick={()=> navigateTO("/Questionarry")}>
                See a Demo
              </button>
            </div>
          </div>

          {/* Right Column - Product Illustration */}
          <div className="relative">
            <div className="bg-[#0f3d5c]/50 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              {/* Platform Preview Container */}
              <div className="space-y-6">
                {/* Top Screenshot */}
                <div className="bg-white rounded-lg overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform">
                  <img 
                    src={screenshot3} 
                    alt="Investment Performance Dashboard"
                    className="w-full h-auto"
                  />
                </div>
                
                {/* Bottom Screenshots Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
                    <img 
                      src={screenshot1} 
                      alt="Financial Dashboard"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="bg-white rounded-lg overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
                    <img 
                      src={screenshot2} 
                      alt="What If Simulation"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
