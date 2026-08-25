// Componente Badge reutilizable para categorías y etiquetas

type BadgeVariant = 'green' | 'orange' | 'blue' | 'gray' | 'red';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  green: 'bg-club-green/15 text-club-green-dark dark:bg-club-green/25 dark:text-club-green-light',
  orange: 'bg-club-orange/15 text-club-orange-dark dark:bg-club-orange/25 dark:text-club-orange-light',
  blue: 'bg-club-blue/15 text-club-blue dark:bg-club-blue/25 dark:text-club-blue-light',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Badge({ children, variant = 'blue', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
