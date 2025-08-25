import { useState, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

// Interface for form validation rules
export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors<T>;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (
    onSubmit: (values: T) => Promise<void> | void
  ) => (e: FormEvent) => Promise<void>;
  reset: () => void;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  clearErrors: () => void;
}

// Custom hook for form handling with validation
export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      // Required validation
      if (rules.required && (!value || value === '')) {
        return 'Este campo es requerido';
      }

      // Skip other validations if field is empty and not required
      if (!value || value === '') return null;

      // String validations
      if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
          return `Mínimo ${rules.minLength} caracteres`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
          return `Máximo ${rules.maxLength} caracteres`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          return 'Formato inválido';
        }
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules]
  );

  // Validate all fields
  const validateForm = useCallback((): FormErrors<T> => {
    const newErrors: FormErrors<T> = {};

    Object.keys(values).forEach(key => {
      const fieldKey = key as keyof T;
      const error = validateField(fieldKey, values[fieldKey]);
      if (error) {
        newErrors[fieldKey] = error;
      }
    });

    return newErrors;
  }, [values, validateField]);

  // Handle input changes
  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;

      // Handle different input types
      let fieldValue: any = value;
      if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value);
      } else if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      }

      setValues(prev => ({
        ...prev,
        [fieldName]: fieldValue,
      }));

      // Validate field on change
      const error = validateField(fieldName, fieldValue);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || undefined,
      }));
    },
    [validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) => async (e: FormEvent) => {
      e.preventDefault();

      const formErrors = validateForm();
      setErrors(formErrors);

      const hasErrors = Object.values(formErrors).some(error => error);
      if (hasErrors) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set specific field value
  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues(prev => ({
        ...prev,
        [field]: value,
      }));

      // Validate the field
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error || undefined,
      }));
    },
    [validateField]
  );

  // Set specific field error
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
  };
};
