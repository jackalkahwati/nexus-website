import React, { useState } from 'react';

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  ref?: React.Ref<any>;
  [key: string]: any;
}

interface SelectProps extends ComponentProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

interface SelectItemProps extends ComponentProps {
  value: string;
  onSelect?: () => void;
  disabled?: boolean;
}

// Create base components first
const SelectPrimitive = {
  Root: React.forwardRef<HTMLDivElement, SelectProps>(({ children, onValueChange, value, defaultValue, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue);

    // Store callback globally for testing
    if (typeof window !== 'undefined') {
      (window as any).__selectCallback = onValueChange;
    }

    return (
      <div 
        ref={ref}
        data-testid="select-root"
        data-value={selectedValue}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              'aria-expanded': isOpen,
              onClick: () => setIsOpen(!isOpen),
              disabled,
              value: selectedValue,
            });
          }
          return child;
        })}
      </div>
    );
  }),

  Trigger: React.forwardRef<HTMLButtonElement, ComponentProps>(({ children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="combobox"
      data-testid="select-trigger"
      aria-expanded={props['aria-expanded']}
      disabled={props.disabled}
      {...props}
    >
      {children}
    </button>
  )),

  Portal: React.forwardRef<HTMLDivElement, ComponentProps>(({ children, ...props }, ref) => (
    <div ref={ref} data-testid="select-portal" {...props}>
      {children}
    </div>
  )),

  Content: React.forwardRef<HTMLDivElement, ComponentProps>(({ children, ...props }, ref) => (
    <div
      ref={ref}
      role="listbox"
      data-testid="select-content"
      {...props}
    >
      {children}
    </div>
  )),

  Item: React.forwardRef<HTMLDivElement, SelectItemProps>(({ children, value, onSelect, disabled, ...props }, ref) => (
    <div
      ref={ref}
      role="option"
      data-testid={`select-item-${value}`}
      data-value={value}
      aria-selected={props['aria-selected']}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled && typeof window !== 'undefined') {
          (window as any).__selectCallback?.(value);
          onSelect?.();
        }
      }}
      {...props}
    >
      {children}
    </div>
  )),

  ItemText: React.forwardRef<HTMLSpanElement, ComponentProps>(({ children, ...props }, ref) => (
    <span ref={ref} data-testid="select-item-text" {...props}>
      {children}
    </span>
  )),
};

// Add displayNames
Object.entries(SelectPrimitive).forEach(([key, Component]) => {
  Component.displayName = `Select.${key}`;
});

// Define Tabs components
const TabsPrimitive = {
  Root: React.forwardRef<HTMLDivElement, ComponentProps & { defaultValue?: string; value?: string; onValueChange?: (value: string) => void }>(
    ({ children, defaultValue, value, onValueChange, className }, ref) => (
      <div
        ref={ref}
        data-testid="tabs-root"
        data-value={value || defaultValue}
        className={className}
      >
        {children}
      </div>
    )
  ),
  
  List: React.forwardRef<HTMLDivElement, ComponentProps>(
    ({ children, className }, ref) => (
      <div
        ref={ref}
        role="tablist"
        data-testid="tabs-list"
        className={className}
      >
        {children}
      </div>
    )
  ),
  
  Trigger: React.forwardRef<HTMLButtonElement, ComponentProps & { value: string }>(
    ({ children, value, className }, ref) => (
      <button
        ref={ref}
        role="tab"
        data-value={value}
        data-testid="tabs-trigger"
        className={className}
      >
        {children}
      </button>
    )
  ),
  
  Content: React.forwardRef<HTMLDivElement, ComponentProps & { value: string }>(
    ({ children, value, className }, ref) => (
      <div
        ref={ref}
        role="tabpanel"
        data-value={value}
        data-testid="tabs-content"
        className={className}
      >
        {children}
      </div>
    )
  )
};

// Add displayNames to Tabs components
TabsPrimitive.Root.displayName = 'Tabs.Root';
TabsPrimitive.List.displayName = 'Tabs.List';
TabsPrimitive.Trigger.displayName = 'Tabs.Trigger';
TabsPrimitive.Content.displayName = 'Tabs.Content';

// Export the components
export const Select = SelectPrimitive;
export const Tabs = TabsPrimitive;
