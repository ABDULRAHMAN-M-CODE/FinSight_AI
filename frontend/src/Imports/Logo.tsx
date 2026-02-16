export default function FinanceLogo({ size = 200, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="greenGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#047857" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer protective shield ring - represents security and trust */}
      <circle
        cx="100"
        cy="100"
        r="85"
        stroke="url(#blueGradient)"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Inner orbit ring - represents continuous growth and monitoring */}
      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
        strokeDasharray="8 4"
      />
      
      {/* Central ascending bars - represents financial growth trajectory */}
      <g filter="url(#glow)">
        {/* Bar 1 - shortest */}
        <path
          d="M 60 130 L 60 115 Q 60 110 65 110 L 73 110 Q 78 110 78 115 L 78 130 Q 78 135 73 135 L 65 135 Q 60 135 60 130 Z"
          fill="url(#blueGradient)"
          opacity="0.9"
        />
        
        {/* Bar 2 - medium */}
        <path
          d="M 85 130 L 85 100 Q 85 95 90 95 L 98 95 Q 103 95 103 100 L 103 130 Q 103 135 98 135 L 90 135 Q 85 135 85 130 Z"
          fill="url(#blueGradient)"
          opacity="0.95"
        />
        
        {/* Bar 3 - tallest */}
        <path
          d="M 110 130 L 110 80 Q 110 75 115 75 L 123 75 Q 128 75 128 80 L 128 130 Q 128 135 123 135 L 115 135 Q 110 135 110 130 Z"
          fill="url(#greenGradient)"
          opacity="1"
        />
      </g>
      
      {/* Upward arrow integrated with growth curve - represents advisory guidance */}
      <path
        d="M 55 125 Q 75 110, 95 95 Q 115 80, 135 70"
        stroke="url(#goldGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* Arrow head */}
      <path
        d="M 135 70 L 125 74 L 131 80 Z"
        fill="url(#goldGradient)"
        filter="url(#glow)"
      />
      
      {/* Compass points - represents navigation and direction in finance */}
      <g opacity="0.5">
        <circle cx="100" cy="35" r="3" fill="url(#goldGradient)" />
        <circle cx="165" cy="100" r="3" fill="url(#goldGradient)" />
        <circle cx="100" cy="165" r="3" fill="url(#goldGradient)" />
        <circle cx="35" cy="100" r="3" fill="url(#goldGradient)" />
      </g>
      
      {/* Subtle connecting lines - represents interconnected financial strategies */}
      <path
        d="M 100 35 L 100 50"
        stroke="url(#blueGradient)"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="2 2"
      />
      <path
        d="M 165 100 L 150 100"
        stroke="url(#blueGradient)"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="2 2"
      />
      <path
        d="M 100 165 L 100 150"
        stroke="url(#blueGradient)"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="2 2"
      />
      <path
        d="M 35 100 L 50 100"
        stroke="url(#blueGradient)"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="2 2"
      />
      
      {/* Central focal point - represents the core advisory service */}
      <circle
        cx="100"
        cy="100"
        r="8"
        fill="url(#goldGradient)"
        filter="url(#glow)"
      />
      <circle
        cx="100"
        cy="100"
        r="4"
        fill="#FFF"
        opacity="0.8"
      />
    </svg>
  );
}
