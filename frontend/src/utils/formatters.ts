/**
 * Utility functions for formatting data
 */

/**
 * Format number as Vietnamese currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(date);
}

/**
 * Format date with time to Vietnamese locale
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format time from Date object
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDurationSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format kWh with unit
 */
export function formatEnergy(kWh: number): string {
  return `${kWh.toFixed(2)} kWh`;
}

/**
 * Format power in kW
 */
export function formatPower(kW: number): string {
  return `${kW} kW`;
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Get relative time string (e.g., "5 minutes ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
}

/**
 * Calculate estimated charging time based on battery capacity and charger power
 */
export function calculateChargingTime(
  batteryCapacityKWh: number,
  currentSOC: number,
  targetSOC: number,
  chargerPowerKW: number
): number {
  const energyNeeded = batteryCapacityKWh * ((targetSOC - currentSOC) / 100);
  const timeHours = energyNeeded / chargerPowerKW;
  return Math.round(timeHours * 60); // Return in minutes
}

/**
 * Calculate cost based on kWh and rate
 */
export function calculateCost(kWh: number, pricePerKWh: number, discount: number = 0): number {
  const baseCost = kWh * pricePerKWh;
  const discountAmount = baseCost * (discount / 100);
  return baseCost - discountAmount;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnamese format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Format phone number to Vietnamese format
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+84')) {
    return `+84 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get status color class for Tailwind
 */
export function getStatusColorClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'active':
    case 'available':
    case 'completed':
      return 'bg-green-500';
    case 'offline':
    case 'failed':
    case 'error':
      return 'bg-red-500';
    case 'maintenance':
    case 'occupied':
    case 'pending':
      return 'bg-orange-500';
    case 'inactive':
    case 'cancelled':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
}

/**
 * Get status text color class for Tailwind
 */
export function getStatusTextClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'active':
    case 'available':
    case 'completed':
      return 'text-green-600';
    case 'offline':
    case 'failed':
    case 'error':
      return 'text-red-600';
    case 'maintenance':
    case 'occupied':
    case 'pending':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Generate a random ID (for demo purposes only - use UUID in production)
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${randomStr}`;
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert 24-hour time to 12-hour format
 */
export function to12HourFormat(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get battery icon based on SOC percentage
 */
export function getBatteryStatus(soc: number): 'full' | 'high' | 'medium' | 'low' | 'critical' {
  if (soc >= 80) return 'full';
  if (soc >= 60) return 'high';
  if (soc >= 40) return 'medium';
  if (soc >= 20) return 'low';
  return 'critical';
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
