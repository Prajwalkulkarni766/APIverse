export const Dropdown = ({ children, className = '', ...props }) => (
  <select
    className={`bg-white text-textPrimary border border-inputBorder rounded 
    p-2 text-sm cursor-pointer hover:bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </select>
)