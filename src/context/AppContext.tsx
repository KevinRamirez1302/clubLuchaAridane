// =============================================================================
// CONTEXTO GLOBAL — AppContext
// Gestiona el estado de los datos del club (noticias, fichajes, plantilla, etc.)
// ----------------------------------------------------------------------------
// INTEGRACIÓN BACKEND: sustituir los imports de datos mock por llamadas fetch/axios
// a los endpoints correspondientes dentro del useEffect de AppProvider.
// Ejemplo: GET /api/noticias → setNoticias(data)
// =============================================================================
import { createContext, useContext, useEffect, useState } from 'react';
import type { Noticia, Fichaje, Jugador, Patrocinador, HitoHistorico, ElementoGaleria, Partido, PosicionClasificacion } from '../types';

// ── Mock data imports (reemplazar por fetch al integrar backend) ──
import noticiasMock from '../data/noticias.json';
import fichajesMock from '../data/fichajes.json';
import plantillaMock from '../data/plantilla.json';
import patrocinadorMock from '../data/patrocinadores.json';
import historiaMock from '../data/historia.json';
import galeriaMock from '../data/galeria.json';
import partidosMock from '../data/partidos.json';
import clasificacionMock from '../data/clasificacion.json';

interface AppState {
  noticias: Noticia[];
  fichajes: Fichaje[];
  plantilla: Jugador[];
  patrocinadores: Patrocinador[];
  historia: HitoHistorico[];
  galeria: ElementoGaleria[];
  partidos: Partido[];
  clasificacion: PosicionClasificacion[];
  cargando: boolean;
}

interface AppContextType extends AppState {
  // Métodos futuros para CRUD cuando el admin panel esté listo
  // FUTURO: recargarNoticias: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<AppState>({
    noticias: [],
    fichajes: [],
    plantilla: [],
    patrocinadores: [],
    historia: [],
    galeria: [],
    partidos: [],
    clasificacion: [],
    cargando: true,
  });

  useEffect(() => {
    // ── INTEGRACIÓN BACKEND: reemplazar este bloque por llamadas reales ──
    // Ejemplo con fetch:
    // const [noticias, fichajes] = await Promise.all([
    //   fetch('/api/noticias').then(r => r.json()),
    //   fetch('/api/fichajes').then(r => r.json()),
    // ]);
    // ──────────────────────────────────────────────────────────────────────

    // Simulamos latencia de red para probar skeleton loaders
    const timer = setTimeout(() => {
      setEstado({
        noticias: noticiasMock as Noticia[],
        fichajes: fichajesMock as Fichaje[],
        plantilla: plantillaMock as Jugador[],
        patrocinadores: patrocinadorMock as Patrocinador[],
        historia: historiaMock as HitoHistorico[],
        galeria: galeriaMock as ElementoGaleria[],
        partidos: partidosMock as Partido[],
        clasificacion: clasificacionMock as PosicionClasificacion[],
        cargando: false,
      });
    }, 800); // Simula 800ms de carga de red

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={estado}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado con comprobación de contexto
export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
