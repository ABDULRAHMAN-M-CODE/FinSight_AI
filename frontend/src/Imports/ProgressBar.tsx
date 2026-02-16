import { Check } from "lucide-react";


interface Step{
  number: number,
  label:string
}
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps:Step[]
}

export function ProgressBar({ currentStep, totalSteps, steps}: ProgressBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }}>
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step.number}
              </div>

              {/* Step Label */}
              <div
                className={`mt-2 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                  isActive ? "text-blue-600" : isUpcoming ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
