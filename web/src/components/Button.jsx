export const SecondaryButton = ({ children, className = '', ...props }) => (
  <button
    className={`border border-primary text-primary bg-transparent rounded 
    px-3 py-2 text-sm font-bold hover:bg-primary/10 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const PrimaryButton = ({ children, className = '', ...props }) => (
  <button
    className={`bg-primary text-white rounded px-3 py-2 text-sm font-bold 
    hover:bg-primary/90 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </button>
)