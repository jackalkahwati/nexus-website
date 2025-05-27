import React from 'react'

interface ComponentProps {
  children?: React.ReactNode
  className?: string
}

interface ButtonProps extends ComponentProps {
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
}

interface SelectProps extends ComponentProps {
  value?: string
  onValueChange?: (value: string) => void
  'aria-label'?: string
  disabled?: boolean
}

interface SelectItemProps extends ComponentProps {
  value: string
  onClick?: () => void
  role?: string
  'aria-selected'?: boolean
}

// Skeleton mock with test ID
const Skeleton: React.FC<ComponentProps> = ({ className }) => (
  <div data-testid="skeleton" className={className} role="progressbar">Loading...</div>
)

// Card mock with proper semantics
const Card: React.FC<ComponentProps> = ({ children, className }) => (
  <div data-testid="card" className={className} role="region">{children}</div>
)

// Alert mocks with proper ARIA roles
const Alert: React.FC<ComponentProps & { variant?: string }> = ({ children, variant }) => (
  <div role="alert" data-testid="alert" data-variant={variant} aria-live="polite">
    {children}
  </div>
)

const AlertDescription: React.FC<ComponentProps> = ({ children }) => (
  <div data-testid="alert-description">{children}</div>
)

const AlertActions: React.FC<ComponentProps> = ({ children }) => (
  <div data-testid="alert-actions" role="group">{children}</div>
)

// Button mock with proper accessibility
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled,
  type = 'button',
  'aria-label': ariaLabel,
  ...props 
}) => (
  <button
    data-testid="button"
    onClick={onClick}
    disabled={disabled}
    type={type}
    aria-label={ariaLabel}
    {...props}
  >
    {children}
  </button>
)

// Select mocks with proper ARIA roles and keyboard navigation
export function Select({ defaultValue, onValueChange, children, 'aria-label': ariaLabel }: any) {
  return (
    <div data-testid="select-container">
      <button 
        data-testid={`select-trigger-${ariaLabel}`}
        onClick={() => onValueChange && onValueChange(defaultValue)}
        aria-label={ariaLabel}
        role="combobox"
      >
        {defaultValue}
      </button>
      {children}
    </div>
  )
}

export function SelectTrigger({ children, ...props }: any) {
  return (
    <button {...props} data-testid={`select-trigger-${props['aria-label']}`}>
      {children}
    </button>
  )
}

export function SelectContent({ children }: any) {
  return <div data-testid="select-content" role="listbox">{children}</div>
}

export function SelectItem({ value, children, onSelect }: any) {
  return (
    <div 
      data-testid={`select-item-${value}`}
      role="option"
      onClick={() => onSelect && onSelect(value)}
    >
      {children}
    </div>
  )
}

export {
  Skeleton,
  Card,
  Alert,
  AlertDescription,
  AlertActions,
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem
}
