// =============================================================================
// CONFIGURACIÓN DE i18next — Club Ariadne
// Para añadir un nuevo idioma: importar el JSON de traducciones y añadirlo
// al objeto `resources` con su código de idioma (ej. 'en', 'fr').
// =============================================================================
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './translations/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      // FUTURO: en: { translation: en },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
  });

export default i18n;
