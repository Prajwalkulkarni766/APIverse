export const PrimaryHeading = ({ children, className = '', ...props }) => (
  <h1
    className={`text-2xl font-bold text-textPrimary ${className}`}
    {...props}
  >
    {children}
  </h1>
)

export const SecondaryHeading = ({ children, className = '', ...props }) => (
  <h2
    className={`text-sm text-secondary ${className}`}
    {...props}
  >
    {children}
  </h2>
)