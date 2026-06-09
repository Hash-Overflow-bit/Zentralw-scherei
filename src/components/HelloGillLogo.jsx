
export default function HelloGillLogo({ className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 80"
      className={className}
      style={{ height: '40px', width: 'auto', display: 'block', ...style }}
    >
      {/* Background Yellow Capsule */}
      <rect x="2" y="2" width="236" height="76" rx="38" fill="#FFEB00" />
      
      {/* Text Group */}
      <g fill="#000000" fontFamily='"Arial Rounded MT Bold", "Comic Sans MS", system-ui, sans-serif' fontWeight="900" fontSize="36">
        {/* "hello g" */}
        <text x="24" y="52" letterSpacing="-0.5">hello g</text>
        
        {/* The 'i' stem - custom drawn to avoid default 'i' dot */}
        <rect x="139" y="30" width="8" height="22" rx="4" />
        
        {/* "ll" */}
        <text x="151" y="52" letterSpacing="-0.5">ll</text>
      </g>
      
      {/* Swiss Cross Dot for the "i" */}
      {/* Circle center at x=143, y=18 (radius 9) */}
      <circle cx="143" cy="18" r="9" fill="#E60000" />
      
      {/* White cross inside red circle */}
      {/* Vertical bar */}
      <rect x="141.5" y="13.5" width="3" height="9" rx="0.5" fill="#FFFFFF" />
      {/* Horizontal bar */}
      <rect x="138.5" y="16.5" width="9" height="3" rx="0.5" fill="#FFFFFF" />
    </svg>
  );
}
