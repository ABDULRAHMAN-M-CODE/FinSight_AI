import { useState } from 'react';
import { Brain, Bell, TrendingUp, LayoutDashboard, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
interface Step {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  points: string[];
}

const steps: Step[] = [
  {
    id: 1,
    icon: Brain,
    title: 'Your AI Financial Partner',
    subtitle: 'Professional Guidance, Personalized for You',
    points: [
      'Behavioral spending analysis',
      'CFP®-aligned financial recommendations',
      'Improves continuously with usage'
    ]
  },
  {
    id: 2,
    icon: Bell,
    title: 'Real-Time Adaptive Alerts',
    subtitle: 'Intelligence that never sleeps',
    points: [
      'Hourly financial monitoring',
      'Context-aware alerts (in-app + email)',
      'Goal deviation notifications'
    ]
  },
  {
    id: 3,
    icon: TrendingUp,
    title: '"What-If" Financial Simulations',
    subtitle: 'Predict your future with confidence',
    points: [
      'Decision scenario testing',
      'Thousands of outcome simulations',
      'Long-term trajectory charts'
    ]
  },
  {
    id: 4,
    icon: LayoutDashboard,
    title: 'Your Financial Command Center',
    subtitle: 'Everything in one place',
    points: [
      'Interactive dashboards',
      'Goal status indicators',
      'Secure, read-only baseline data'
    ]
  }
];

function useIntroStepper(){

  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const Icon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const navigate=useNavigate();// rule: called out outside conditional
  const handleNext = () => {
    if (isLastStep) {
      // I want to redirect user to other page,I do not know if I should use Link or useNavigate(): user-intention based vs side-effect navigation
      // decision using if statement : I will use useNavigate() !
      navigate ("/DataCollectionIntro")
    } else {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  return{
    Icon,
    isFirstStep,
    handleNext,
    handleBack,
    currentStep,
    step,
    isLastStep
  };
}
export default function IntroStepper() {
  const{
    Icon,
    isFirstStep,
    handleNext,
    handleBack,
    currentStep,
    step,
    isLastStep
  }=useIntroStepper();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={steps.length}>
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index < currentStep 
                        ? 'bg-blue-600 text-white' 
                        : index === currentStep 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-2 text-slate-600 hidden sm:block text-center">
                    Step {index + 1}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Icon with animated background */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-2xl blur-xl opacity-60 animate-pulse" aria-hidden="true" />
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg">
                  <Icon className="w-10 h-10 text-white" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h1 className="mb-3 text-slate-900">
                {step.title}
              </h1>
              <p className="text-slate-600 text-lg">
                {step.subtitle}
              </p>
            </div>

            {/* Feature Points */}
            <ul className="space-y-4 mb-8" role="list">
              {step.points.map((point, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 text-slate-700 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600" aria-hidden="true" />
                  </div>
                  <span className="flex-1">{point}</span>
                </li>
              ))}
            </ul>

            {/* Navigation Buttons */}
            <div className="flex gap-3 items-center">
              <button
                onClick={handleBack}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isFirstStep
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
                }`}
                aria-label="Go to previous step"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/20"
                aria-label={isLastStep ? "Complete introduction and get started" : "Go to next step"}
              >
                <span>
                  {isLastStep ? "Let's get to know more about you" : 'Next'}
                </span>
                {!isLastStep && <ChevronRight className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Footer indicator */}
          <div className="bg-slate-50 px-8 sm:px-12 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 text-center">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Skip option */}
        <div className="mt-6 text-center">
          <Link 
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 underline underline-offset-4"
            to="/DataCollectionIntro"
            aria-label="Skip introduction"
          >
            Skip introduction
          </Link>
        </div>
      </div>
    </div>
  );
}
