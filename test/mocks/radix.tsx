import React from 'react'
import type { ComponentProps } from 'react'

interface SelectProps {
  children: React.ReactNode
  onValueChange?: (value: string) => void
  defaultValue?: string
  value?: string
}

interface SelectTriggerProps extends ComponentProps<'button'> {
  'aria-label'?: string
  children: React.ReactNode
}

interface SelectItemProps extends ComponentProps<'div'> {
  value: string
  children: React.ReactNode
}

// Mock Radix UI Select components
export const Select = {
  Root: ({ children, onValueChange, defaultValue, value }: SelectProps) => (
    <div data-testid="select-root" data-value={value || defaultValue}>
      {children}
    </div>
  ),
  
  Trigger: React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ children, 'aria-label': ariaLabel, ...props }, ref) => (
      <button
        ref={ref}
        role="combobox"
        aria-label={ariaLabel}
        data-testid="select-trigger"
        {...props}
      >
        {children}
      </button>
    )
  ),
  
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-portal">{children}</div>
  ),
  
  Content: React.forwardRef<HTMLDivElement, ComponentProps<'div'>>(
    ({ children, ...props }, ref) => (
      <div 
        ref={ref}
        role="listbox"
        data-testid="select-content"
        {...props}
      >
        {children}
      </div>
    )
  ),
  
  Viewport: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="select-viewport">{children}</div>
  ),
  
  Item: React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, value, ...props }, ref) => (
      <div
        ref={ref}
        role="option"
        data-value={value}
        data-testid="select-item"
        {...props}
      >
        {children}
      </div>
    )
  ),
  
  ItemText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="select-item-text">{children}</span>
  ),
}

interface TabsProps {
  children: React.ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

interface TabTriggerProps extends ComponentProps<'button'> {
  value: string
  children: React.ReactNode
}

interface TabContentProps extends ComponentProps<'div'> {
  value: string
  children: React.ReactNode
}

// Mock Radix UI Tabs components
export const Tabs = {
  Root: ({ children, defaultValue, value, onValueChange }: TabsProps) => (
    <div data-testid="tabs-root" data-value={value || defaultValue}>
      {children}
    </div>
  ),
  
  List: ({ children }: { children: React.ReactNode }) => (
    <div role="tablist" data-testid="tabs-list">
      {children}
    </div>
  ),
  
  Trigger: ({ children, value, ...props }: TabTriggerProps) => (
    <button
      role="tab"
      data-value={value}
      data-testid="tabs-trigger"
      {...props}
    >
      {children}
    </button>
  ),
  
  Content: ({ children, value, ...props }: TabContentProps) => (
    <div
      role="tabpanel"
      data-value={value}
      data-testid="tabs-content"
      {...props}
    >
      {children}
    </div>
  ),
}

// Add displayNames to match Radix UI components
Object.entries(Select).forEach(([key, component]) => {
  const comp = component as React.FC<any>
  comp.displayName = `Select.${key}`
})

Object.entries(Tabs).forEach(([key, component]) => {
  const comp = component as React.FC<any>
  comp.displayName = `Tabs.${key}`
}) 