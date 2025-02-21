export const PrimaryLabel = ({ children, className = '', ...props }) => (
  <span
    className={`text-primary ${className}`}
    {...props}
  >
    {children}
  </span>
)

export const SecondaryLabel = ({ children, className = '', ...props }) => (
  <span
    className={`text-secondary text-xs ${className}`}
    {...props}
  >
    {children}
  </span>
)