// =============================================================================
// CONTEXTO DE TEMA — ThemeContext
// Gestiona el modo oscuro/claro con persistencia en localStorage.
// Tailwind v4 usa @custom-variant dark (&:where(.dark, .dark *)) en el CSS,
// por lo que este contexto añade/quita la clase "dark" en <html>.
// =============================================================================
import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * Lee el tema guardado de manera segura (por si localStorage no está disponible).
 * Aplica la clase "dark" al <html> ANTES del primer render para evitar el flash.
 */
function getInitialDark(): boolean {
  try {
    const saved = localStorage.getItem('ariadne-theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    // Sin preferencia guardada → usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('ariadne-theme', isDark ? 'dark' : 'light');
    } catch {
      // localStorage no disponible (modo privado estricto, etc.)
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
