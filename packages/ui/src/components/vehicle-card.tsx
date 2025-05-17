import * as React from 'react';
import { cn } from '../lib/utils';

/**
 * Vehicle type representation
 */
export interface VehicleData {
  id: string;
  name: string;
  type: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  imageUrl?: string;
  mileage?: number;
  batteryLevel?: number;
  price?: number;
  priceUnit?: 'hour' | 'day' | 'minute';
  location?: string;
  rating?: number;
  description?: string;
  features?: string[];
}

/**
 * Vehicle card props
 */
export interface VehicleCardProps {
  /**
   * Vehicle data to display
   */
  vehicle: VehicleData;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: (vehicle: VehicleData) => void;
  /**
   * Whether the vehicle card is selectable
   */
  selectable?: boolean;
  /**
   * Whether the vehicle card is selected
   */
  selected?: boolean;
  /**
   * Whether to show the booking button
   */
  showBookingButton?: boolean;
  /**
   * Custom booking button text
   */
  bookingButtonText?: string;
  /**
   * Booking button click handler
   */
  onBookingClick?: (vehicle: VehicleData) => void;
  /**
   * Optional UI variant
   */
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Vehicle status badge component
 */
const VehicleStatusBadge: React.FC<{ status: VehicleData['status'] }> = ({ status }) => {
  const statusStyles = {
    AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
    IN_USE: 'bg-blue-100 text-blue-800 border-blue-200',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    OUT_OF_SERVICE: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusText = {
    AVAILABLE: 'Available',
    IN_USE: 'In Use',
    MAINTENANCE: 'Maintenance',
    OUT_OF_SERVICE: 'Out of Service',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        statusStyles[status]
      )}
    >
      {statusText[status]}
    </span>
  );
};

/**
 * Vehicle card component
 * 
 * @example
 * ```tsx
 * <VehicleCard
 *   vehicle={vehicle}
 *   onClick={handleVehicleClick}
 *   showBookingButton
 *   onBookingClick={handleBooking}
 * />
 * ```
 */
export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  className,
  onClick,
  selectable = false,
  selected = false,
  showBookingButton = false,
  bookingButtonText = 'Book Now',
  onBookingClick,
  variant = 'default',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(vehicle);
    }
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookingClick) {
      onBookingClick(vehicle);
    }
  };

  const renderVehicleImage = () => {
    return (
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <VehicleStatusBadge status={vehicle.status} />
        </div>
      </div>
    );
  };

  const renderCompactView = () => {
    return (
      <div className="flex h-24 w-full">
        <div className="relative h-24 w-24 overflow-hidden rounded-l-lg">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-3">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-medium">{vehicle.name}</h3>
              <VehicleStatusBadge status={vehicle.status} />
            </div>
            <p className="text-xs text-gray-500">{vehicle.type}</p>
          </div>
          {showBookingButton && (
            <button
              onClick={handleBookingClick}
              className="mt-1 w-full rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
              disabled={vehicle.status !== 'AVAILABLE'}
            >
              {bookingButtonText}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderDetailedView = () => {
    return (
      <div className="flex flex-col">
        {renderVehicleImage()}
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium">{vehicle.name}</h3>
              <p className="text-sm text-gray-500">{vehicle.type}</p>
            </div>
            {vehicle.price && (
              <div className="text-right">
                <p className="text-lg font-bold">${vehicle.price}</p>
                <p className="text-xs text-gray-500">
                  per {vehicle.priceUnit || 'hour'}
                </p>
              </div>
            )}
          </div>

          {vehicle.description && (
            <p className="mb-3 text-sm text-gray-700">{vehicle.description}</p>
          )}

          <div className="mb-3 grid grid-cols-2 gap-2">
            {vehicle.mileage !== undefined && (
              <div className="text-sm">
                <span className="font-medium">Mileage:</span>{' '}
                {vehicle.mileage.toLocaleString()} mi
              </div>
            )}
            {vehicle.batteryLevel !== undefined && (
              <div className="text-sm">
                <span className="font-medium">Battery:</span>{' '}
                {vehicle.batteryLevel}%
              </div>
            )}
            {vehicle.location && (
              <div className="text-sm">
                <span className="font-medium">Location:</span> {vehicle.location}
              </div>
            )}
            {vehicle.rating !== undefined && (
              <div className="text-sm">
                <span className="font-medium">Rating:</span> {vehicle.rating}/5
              </div>
            )}
          </div>

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="mb-3">
              <h4 className="mb-1 text-sm font-medium">Features</h4>
              <div className="flex flex-wrap gap-1">
                {vehicle.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showBookingButton && (
            <button
              onClick={handleBookingClick}
              className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              disabled={vehicle.status !== 'AVAILABLE'}
            >
              {bookingButtonText}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Main rendering logic
  const cardContent = () => {
    switch (variant) {
      case 'compact':
        return renderCompactView();
      case 'detailed':
        return renderDetailedView();
      default:
        return (
          <div className="flex flex-col">
            {renderVehicleImage()}
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-base font-medium">{vehicle.name}</h3>
                {vehicle.price && (
                  <p className="font-medium">
                    ${vehicle.price}/{vehicle.priceUnit || 'hr'}
                  </p>
                )}
              </div>
              <p className="mb-3 text-sm text-gray-500">{vehicle.type}</p>
              {showBookingButton && (
                <button
                  onClick={handleBookingClick}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                  disabled={vehicle.status !== 'AVAILABLE'}
                >
                  {bookingButtonText}
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow',
        selectable && 'cursor-pointer hover:border-blue-300',
        selected && 'border-2 border-blue-500 ring-2 ring-blue-200',
        vehicle.status !== 'AVAILABLE' && 'opacity-75',
        className
      )}
      onClick={handleClick}
    >
      {cardContent()}
    </div>
  );
};