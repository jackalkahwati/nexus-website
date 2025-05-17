import React from 'react';
import { Button } from './Button';

export interface SearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
  className?: string;
  initialValues?: Partial<SearchParams>;
  showLocationField?: boolean;
  showDateFields?: boolean;
  showTypeField?: boolean;
  showPriceRangeField?: boolean;
  customFields?: Array<{
    id: string;
    label: string;
    type: 'text' | 'select' | 'checkbox' | 'number';
    options?: Array<{ value: string; label: string }>;
  }>;
  whiteLabel?: {
    primaryColor?: string;
    buttonText?: string;
    placeholderText?: string;
  };
}

export interface SearchParams {
  location: string;
  startDate: string;
  endDate: string;
  vehicleType: string;
  priceMin: number;
  priceMax: number;
  [key: string]: string | number | boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  className,
  initialValues = {},
  showLocationField = true,
  showDateFields = true,
  showTypeField = true,
  showPriceRangeField = true,
  customFields = [],
  whiteLabel,
}) => {
  const [searchParams, setSearchParams] = React.useState<SearchParams>({
    location: '',
    startDate: '',
    endDate: '',
    vehicleType: '',
    priceMin: 0,
    priceMax: 1000,
    ...initialValues,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setSearchParams(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  // Apply white label styling if provided
  const buttonStyle = whiteLabel?.primaryColor 
    ? { backgroundColor: whiteLabel.primaryColor } 
    : {};

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`rounded-lg border bg-card p-6 shadow-sm ${className || ''}`}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {showLocationField && (
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder={whiteLabel?.placeholderText || "Enter location"}
              value={searchParams.location}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        )}

        {showDateFields && (
          <>
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={searchParams.startDate}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={searchParams.endDate}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </>
        )}

        {showTypeField && (
          <div className="space-y-2">
            <label htmlFor="vehicleType" className="text-sm font-medium">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={searchParams.vehicleType}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="luxury">Luxury</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        )}

        {showPriceRangeField && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Price Range</label>
            <div className="flex items-center space-x-2">
              <input
                id="priceMin"
                name="priceMin"
                type="number"
                min="0"
                placeholder="Min"
                value={searchParams.priceMin}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <span>-</span>
              <input
                id="priceMax"
                name="priceMax"
                type="number"
                min="0"
                placeholder="Max"
                value={searchParams.priceMax}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {customFields.map(field => (
          <div key={field.id} className="space-y-2">
            <label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                value={searchParams[field.id] as string || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center">
                <input
                  id={field.id}
                  name={field.id}
                  type="checkbox"
                  checked={Boolean(searchParams[field.id])}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor={field.id} className="ml-2 text-sm text-gray-600">
                  {field.label}
                </label>
              </div>
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={searchParams[field.id] as string || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          type="submit" 
          style={buttonStyle}
        >
          {whiteLabel?.buttonText || "Search"}
        </Button>
      </div>
    </form>
  );
};