import { render, screen, fireEvent } from '@testing-library/react'
import { Select } from '@/components/ui/select'
import userEvent from '@testing-library/user-event'

describe('Select Mock', () => {
  const defaultProps = {
    label: 'Test select',
    options: ['Option 1', 'Option 2', 'Option 3'],
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<Select {...defaultProps} />)
    expect(screen.getByTestId('select-container')).toBeInTheDocument()
    expect(screen.getByTestId(`select-trigger-${defaultProps.label}`)).toBeInTheDocument()
  })

  it('handles date range selection correctly', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()

    render(
      <Select
        label="Date Range"
        options={['7d', '30d', '90d']}
        value="30d"
        onChange={onChange}
      />
    )

    const trigger = screen.getByTestId('select-trigger-Date Range')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const option = screen.getByTestId('select-item-7d')
    await user.click(option)

    expect(onChange).toHaveBeenCalledWith('7d')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId(`select-trigger-${defaultProps.label}`)
    
    // Open with Enter
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('select-content')).toHaveAttribute('data-state', 'open')

    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}')
    expect(screen.getByTestId('select-item-Option 1')).toHaveFocus()

    // Select with Enter
    await user.keyboard('{Enter}')
    expect(defaultProps.onChange).toHaveBeenCalledWith('Option 1')
  })

  it('handles disabled state', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} disabled />)

    const trigger = screen.getByTestId(`select-trigger-${defaultProps.label}`)
    expect(trigger).toHaveAttribute('aria-disabled', 'true')

    // Try to open when disabled
    await user.click(trigger)
    expect(screen.queryByTestId('select-content')).not.toHaveAttribute('data-state', 'open')
  })
})
