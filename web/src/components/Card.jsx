export const FormCard = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-lg p-8 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
)