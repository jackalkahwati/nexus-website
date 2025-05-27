/* global React */

interface TabsContextValue {
  selectedValue: string;
  onSelect: (value: string) => void;
}

interface TabsProps {
  children?: React.ReactNode;
  defaultValue?: string;
  value?: string;
  className?: string;
  [key: string]: any;
}

const TabsContext = React.createContext<TabsContextValue>({
  selectedValue: '',
  onSelect: () => {}
})

const Root = ({ children, defaultValue }: TabsProps) => {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ selectedValue, onSelect: setSelectedValue }}>
      <div data-testid="tabs" data-default-value={defaultValue}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const List = ({ children }: { children?: React.ReactNode }) => (
  <div data-testid="tabs-list" role="tablist">
    {children}
  </div>
)

const Trigger = React.forwardRef<HTMLButtonElement, TabsProps & { value: string }>(({ children, value, ...props }, ref) => {
  const { selectedValue, onSelect } = React.useContext(TabsContext)
  const isSelected = selectedValue === value

  return (
    <button
      ref={ref}
      data-testid="tabs-trigger"
      data-value={value}
      data-state={isSelected ? 'active' : 'inactive'}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`panel-${value}`}
      onClick={() => onSelect(value)}
      {...props}
    >
      {children}
    </button>
  )
})

const Content = ({ children, value, ...props }: TabsProps & { value: string }) => {
  const { selectedValue } = React.useContext(TabsContext)
  const isSelected = selectedValue === value

  return (
    <div
      data-testid="tabs-content"
      data-value={value}
      data-state={isSelected ? 'active' : 'inactive'}
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`trigger-${value}`}
      hidden={!isSelected}
      {...props}
    >
      {children}
    </div>
  )
}

Trigger.displayName = 'TabsTrigger'

module.exports = { Root, List, Trigger, Content }
