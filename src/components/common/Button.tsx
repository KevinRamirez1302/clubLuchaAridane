// Componente Button reutilizable con variantes

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'orange';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  as?: 'button' | 'a';
  href?: string;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-club-blue text-white hover:bg-club-blue-dark active:scale-95 shadow-md hover:shadow-lg',
  secondary:
    'bg-club-green text-white hover:bg-club-green-dark active:scale-95 shadow-md hover:shadow-lg',
  outline:
    'border-2 border-club-blue text-club-blue hover:bg-club-blue hover:text-white dark:border-club-blue-light dark:text-club-blue-light',
  ghost:
    'text-club-blue hover:bg-club-blue/10 dark:text-club-blue-light dark:hover:bg-club-blue/20',
  orange:
    'bg-club-orange text-white hover:bg-club-orange-dark active:scale-95 shadow-md hover:shadow-lg',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
