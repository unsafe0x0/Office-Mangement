import React from 'react'

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    icon?: React.ReactNode
    type?: "button" | "submit" | "reset"
    disabled?: boolean
}

const RedButton = ({ children, onClick, className, icon, type = "button", disabled }: ButtonProps) => {
  return (
    <button 
      type={type}
      className={`bg-red-500 text-white px-4 py-2.5 rounded-md text-sm hover:bg-red-600 transition cursor-pointer flex items-center justify-center gap-2 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={onClick}
      disabled={disabled}
    >
        {children}
        {icon && icon}
    </button>
  )
}

export default RedButton