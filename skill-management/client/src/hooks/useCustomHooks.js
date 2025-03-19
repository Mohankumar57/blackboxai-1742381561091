import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { errorUtils } from '../utils/helpers';

// Hook for handling async operations with loading and error states
export const useAsync = (asyncFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await asyncFunction(...params);
      setData(response);
      return response;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, data, loading, error };
};

// Hook for handling form submissions
export const useFormSubmit = (submitFunction, successMessage, redirectPath) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      await submitFunction(values);
      toast.success(successMessage);
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      const errorMessage = errorUtils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, submitting };
};

// Hook for handling infinite scroll
export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, fetchMore]);

  return { lastElementRef, loading };
};

// Hook for handling debounced search
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for handling window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for handling outside clicks
export const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
};

// Hook for handling keyboard shortcuts
export const useKeyPress = (targetKey, callback) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === targetKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, callback]);
};

// Hook for handling local storage state
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Hook for handling previous value
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

// Hook for handling API polling
export const usePolling = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

// Hook for handling form validation
export const useFormValidation = (initialState, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
  };

  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    resetForm
  };
};
