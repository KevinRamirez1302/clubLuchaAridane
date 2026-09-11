// InputText accesible con WCAG AAA, soporte para autocomplete, estados de error y dark mode
import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
  helperText?: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  error,
  optional = false,
  helperText,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const errorId = `error-${generatedId}`;
  const helperId = `help-${generatedId}`;

  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Etiqueta accesible sin asteriscos ruidosos */}
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
        {optional && (
          <span className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
            (Opcional)
          </span>
        )}
      </div>

      {/* Campo de entrada con focus-visible contrastado */}
      <div className="relative">
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm rounded-xl border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-club-orange focus-visible:ring-offset-1 text-gray-950 dark:text-white bg-white dark:bg-gray-800 ${
            error
              ? 'border-red-500 dark:border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-club-blue dark:focus:border-club-blue-light'
          } ${disabled ? 'opacity-60 bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
          {...props}
        />
      </div>

      {/* Texto de ayuda descriptivo (opcional) */}
      {helperText && !error && (
        <p id={helperId} className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}

      {/* Mensaje de error accesible con icono */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 mt-1"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default InputText;
