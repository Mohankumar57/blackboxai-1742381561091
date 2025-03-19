import { format, formatDistance, formatRelative, isValid } from 'date-fns';

// Date formatting utilities
export const dateUtils = {
  format: (date, formatStr = 'PPP') => {
    if (!date) return '';
    const dateObj = new Date(date);
    return isValid(dateObj) ? format(dateObj, formatStr) : '';
  },

  formatDistance: (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return isValid(dateObj) ? formatDistance(dateObj, new Date(), { addSuffix: true }) : '';
  },

  formatRelative: (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return isValid(dateObj) ? formatRelative(dateObj, new Date()) : '';
  },

  isValidDate: (date) => {
    if (!date) return false;
    const dateObj = new Date(date);
    return isValid(dateObj);
  }
};

// Form validation utilities
export const validationUtils = {
  required: (value) => (value ? undefined : 'This field is required'),
  
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? undefined : 'Invalid email address';
  },

  bitsathyEmail: (value) => {
    if (!value) return 'Email is required';
    return value.endsWith('@bitsathy.ac.in') ? undefined : 'Must be a @bitsathy.ac.in email';
  },

  minLength: (min) => (value) => {
    if (!value) return undefined;
    return value.length >= min ? undefined : `Must be at least ${min} characters`;
  },

  maxLength: (max) => (value) => {
    if (!value) return undefined;
    return value.length <= max ? undefined : `Must be no more than ${max} characters`;
  },

  number: (value) => {
    if (!value) return undefined;
    return isNaN(value) ? 'Must be a number' : undefined;
  },

  positiveNumber: (value) => {
    if (!value) return undefined;
    return value > 0 ? undefined : 'Must be a positive number';
  },

  composeValidators: (...validators) => (value) =>
    validators.reduce((error, validator) => error || validator(value), undefined)
};

// String utilities
export const stringUtils = {
  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str, length = 50) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  slugify: (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};

// Array utilities
export const arrayUtils = {
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const group = item[key];
      return {
        ...result,
        [group]: [...(result[group] || []), item]
      };
    }, {});
  },

  sortBy: (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
  },

  unique: (array) => [...new Set(array)]
};

// Number utilities
export const numberUtils = {
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  },

  formatPercentage: (value) => {
    return `${Math.round(value * 100) / 100}%`;
  },

  roundTo: (number, decimals = 2) => {
    return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
  }
};

// File utilities
export const fileUtils = {
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  isImageFile: (filename) => {
    const ext = fileUtils.getFileExtension(filename).toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext);
  }
};

// Color utilities
export const colorUtils = {
  getStatusColor: (status) => {
    const statusColors = {
      active: '#4caf50',
      pending: '#ff9800',
      completed: '#2196f3',
      rejected: '#f44336',
      draft: '#9e9e9e'
    };
    return statusColors[status.toLowerCase()] || '#000000';
  },

  getRoleColor: (role) => {
    const roleColors = {
      faculty: '#1976d2',
      student: '#2e7d32',
      skillTeam: '#9c27b0'
    };
    return roleColors[role.toLowerCase()] || '#000000';
  },

  getScoreColor: (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#ff9800';
    return '#f44336';
  }
};

// Error handling utilities
export const errorUtils = {
  getErrorMessage: (error) => {
    if (!error) return 'An unknown error occurred';
    
    if (typeof error === 'string') return error;
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) return error.message;
    
    return 'An unknown error occurred';
  },

  parseValidationErrors: (error) => {
    if (!error.response?.data?.errors) return {};
    
    return error.response.data.errors.reduce((acc, curr) => {
      acc[curr.field] = curr.message;
      return acc;
    }, {});
  }
};

// Local storage utilities
export const storageUtils = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
