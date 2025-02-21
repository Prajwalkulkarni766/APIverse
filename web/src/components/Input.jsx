export const Input = ({ className = '', ...props }) => (
  <input
    className={`bg-white text-textPrimary border border-inputBorder rounded 
    p-2.5 text-sm placeholder-textSecondary focus:outline-none 
    focus:ring-2 focus:ring-primary/20 ${className}`}
    {...props}
  />
)

export const TextArea = ({ className = '', ...props }) => (
  <textarea
    className={`bg-white text-textPrimary border border-inputBorder rounded 
    p-2.5 text-sm placeholder-textSecondary focus:outline-none 
    focus:ring-2 focus:ring-primary/20 resize-none ${className}`}
    {...props}
  />
)