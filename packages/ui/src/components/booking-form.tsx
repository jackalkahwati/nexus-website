import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './button';

/**
 * Booking form data structure
 */
export interface BookingFormData {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  location?: string;
  participants?: number;
  notes?: string;
  bookingType?: 'STANDARD' | 'PREMIUM' | 'GROUP';
  usePoints?: boolean;
}

/**
 * Booking form props
 */
export interface BookingFormProps {
  /**
   * Optional initial form data
   */
  initialData?: Partial<BookingFormData>;
  /**
   * Whether the form is in loading state
   */
  isLoading?: boolean;
  /**
   * CSS class name for the form
   */
  className?: string;
  /**
   * Validate the form data
   */
  onValidate?: (data: BookingFormData) => { isValid: boolean; errors?: Record<string, string> };
  /**
   * Submit handler for the form
   */
  onSubmit: (data: BookingFormData) => void;
  /**
   * Cancel handler
   */
  onCancel?: () => void;
  /**
   * Whether to show advanced options
   */
  showAdvancedOptions?: boolean;
  /**
   * Whether to show loyalty points option
   */
  showLoyaltyPoints?: boolean;
  /**
   * Available loyalty points
   */
  availablePoints?: number;
  /**
   * Submit button text
   */
  submitButtonText?: string;
  /**
   * Whether booking type selection is enabled
   */
  bookingTypeEnabled?: boolean;
  /**
   * Optional pricing component
   */
  pricingComponent?: React.ReactNode;
}

/**
 * Booking form component for creating and editing bookings
 * 
 * @example
 * ```tsx
 * <BookingForm
 *   initialData={{ startDate: new Date() }}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   showAdvancedOptions
 * />
 * ```
 */
export const BookingForm: React.FC<BookingFormProps> = ({
  initialData,
  isLoading = false,
  className,
  onValidate,
  onSubmit,
  onCancel,
  showAdvancedOptions = false,
  showLoyaltyPoints = false,
  availablePoints = 0,
  submitButtonText = 'Book Now',
  bookingTypeEnabled = false,
  pricingComponent,
}) => {
  const [formData, setFormData] = React.useState<BookingFormData>({
    startDate: initialData?.startDate || new Date(),
    startTime: initialData?.startTime || '09:00',
    endDate: initialData?.endDate || new Date(),
    endTime: initialData?.endTime || '17:00',
    location: initialData?.location || '',
    participants: initialData?.participants || 1,
    notes: initialData?.notes || '',
    bookingType: initialData?.bookingType || 'STANDARD',
    usePoints: initialData?.usePoints || false,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showExtras, setShowExtras] = React.useState(showAdvancedOptions);

  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'startDate' | 'endDate'
  ) => {
    const date = new Date(e.target.value + 'T00:00:00');
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form if validator is provided
    if (onValidate) {
      const validation = onValidate(formData);
      if (!validation.isValid) {
        setErrors(validation.errors || {});
        return;
      }
    }
    
    // Submit the form
    onSubmit(formData);
  };

  // Format the date as YYYY-MM-DD for the date input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <form 
      className={cn('space-y-4', className)} 
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label 
            htmlFor="startDate" 
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formatDateForInput(formData.startDate)}
            onChange={(e) => handleDateChange(e, 'startDate')}
            className={cn(
              'w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              errors.startDate && 'border-red-500'
            )}
            required
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label 
            htmlFor="startTime" 
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            className={cn(
              'w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              errors.startTime && 'border-red-500'
            )}
            required
          />
          {errors.startTime && (
            <p className="text-xs text-red-500">{errors.startTime}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label 
            htmlFor="endDate" 
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formatDateForInput(formData.endDate)}
            onChange={(e) => handleDateChange(e, 'endDate')}
            className={cn(
              'w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              errors.endDate && 'border-red-500'
            )}
            required
          />
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <label 
            htmlFor="endTime" 
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            className={cn(
              'w-full rounded-md border border-gray-300 px-3 py-2 text-sm',
              errors.endTime && 'border-red-500'
            )}
            required
          />
          {errors.endTime && (
            <p className="text-xs text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
          onClick={() => setShowExtras(!showExtras)}
        >
          {showExtras ? 'Hide' : 'Show'} additional options
        </button>
      </div>
      
      {showExtras && (
        <div className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="space-y-1">
            <label 
              htmlFor="location" 
              className="block text-sm font-medium text-gray-700"
            >
              Pickup Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Enter pickup location"
            />
          </div>
          
          <div className="space-y-1">
            <label 
              htmlFor="participants" 
              className="block text-sm font-medium text-gray-700"
            >
              Number of Passengers
            </label>
            <input
              type="number"
              id="participants"
              name="participants"
              value={formData.participants || 1}
              min={1}
              max={8}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          
          {bookingTypeEnabled && (
            <div className="space-y-1">
              <label 
                htmlFor="bookingType" 
                className="block text-sm font-medium text-gray-700"
              >
                Booking Type
              </label>
              <select
                id="bookingType"
                name="bookingType"
                value={formData.bookingType}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
                <option value="GROUP">Group</option>
              </select>
            </div>
          )}
          
          <div className="space-y-1">
            <label 
              htmlFor="notes" 
              className="block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Add any special requirements or notes"
            />
          </div>
          
          {showLoyaltyPoints && availablePoints > 0 && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="usePoints"
                name="usePoints"
                checked={formData.usePoints}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor="usePoints" 
                className="text-sm font-medium text-gray-700"
              >
                Use loyalty points ({availablePoints} available)
              </label>
            </div>
          )}
        </div>
      )}
      
      {pricingComponent && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          {pricingComponent}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};