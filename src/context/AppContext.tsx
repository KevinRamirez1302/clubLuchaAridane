// =============================================================================
// CONTEXTO GLOBAL — AppContext
// Gestiona el estado de los datos del club (noticias, plantilla, patrocinadores, etc.)
// Conectado con la API REST de Node.js + Express
// =============================================================================
import { createContext, useContext, useEffect, useState } from 'react';
import type { Noticia, Fichaje, Jugador, Patrocinador, HitoHistorico, ElementoGaleria, Partido, PosicionClasificacion } from '../types';
import { apiFetch } from '../services/api';

// Mock data fallbacks en caso de desconexión
import fichajesMock from '../data/fichajes.json';
import patrocinadorMock from '../data/patrocinadores.json';
import historiaMock from '../data/historia.json';
import galeriaMock from '../data/galeria.json';

import { useDataStore } from '../store/useDataStore';
import { useAuthStore } from '../store/useAuthStore';

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
  recargarDatos: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const storeData = useDataStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [estado, setEstado] = useState<AppState>({
    noticias: storeData.noticias,
    fichajes: [],
    plantilla: storeData.plantilla,
    patrocinadores: [],
    historia: [],
    galeria: [],
    partidos: storeData.partidos,
    clasificacion: storeData.clasificacion,
    cargando: true,
  });

  const cargarDatosAuxiliares = async () => {
    try {
      const [patrosRes, historiaRes, galeriaRes] = await Promise.allSettled([
        apiFetch<Patrocinador[]>('/patrocinadores'),
        apiFetch<HitoHistorico[]>('/historia'),
        apiFetch<ElementoGaleria[]>('/galeria'),
      ]);

      setEstado((prev) => ({
        ...prev,
        fichajes: fichajesMock as Fichaje[],
        patrocinadores: patrosRes.status === 'fulfilled' ? patrosRes.value.data : (patrocinadorMock as Patrocinador[]),
        historia: historiaRes.status === 'fulfilled' ? historiaRes.value.data : (historiaMock as HitoHistorico[]),
        galeria: galeriaRes.status === 'fulfilled' ? galeriaRes.value.data : (galeriaMock as ElementoGaleria[]),
        cargando: false,
      }));
    } catch {
      setEstado((prev) => ({
        ...prev,
        fichajes: fichajesMock as Fichaje[],
        patrocinadores: patrocinadorMock as Patrocinador[],
        historia: historiaMock as HitoHistorico[],
        galeria: galeriaMock as ElementoGaleria[],
        cargando: false,
      }));
    }
  };

  // Carga inicial y comprobación de sesión al arrancar la app
  useEffect(() => {
    checkAuth();
    storeData.fetchInitialData();
    cargarDatosAuxiliares();
  }, []);

  // Sincronizar Zustand en tiempo real con este contexto
  useEffect(() => {
    setEstado((prev) => ({
      ...prev,
      noticias: storeData.noticias,
      plantilla: storeData.plantilla,
      partidos: storeData.partidos,
      clasificacion: storeData.clasificacion,
    }));
  }, [storeData.noticias, storeData.plantilla, storeData.partidos, storeData.clasificacion]);

  const recargarDatos = async () => {
    await storeData.fetchInitialData();
    await cargarDatosAuxiliares();
  };

  return (
    <AppContext.Provider value={{ ...estado, recargarDatos }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
