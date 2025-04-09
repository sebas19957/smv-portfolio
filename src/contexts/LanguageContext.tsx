"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import translations from "@/translations";

type Language = "es" | "en";

// Definir tipos para los valores de traducción que pueden ser strings o arreglos
type TranslationValue = string | string[];

// Definimos el tipo para las claves de traducción basado en el objeto es
type TranslationKey = keyof typeof translations.es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string) => TranslationValue;
  tArray: (key: TranslationKey | string) => string[]; // Nueva función para garantizar arrays
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en", // Idioma predeterminado
  setLanguage: () => {},
  t: (key) => String(key), // Función de traducción por defecto
  tArray: () => [], // Función por defecto para arrays
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Estado para almacenar el idioma actual
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Recuperar el idioma guardado en localStorage al cargar la página
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Guardar la preferencia en localStorage cuando cambia
    localStorage.setItem("language", language);
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Función de traducción que puede devolver strings o arrays
  const t = (key: TranslationKey | string): TranslationValue => {
    // Verificar si la clave existe en las traducciones
    if (language && translations[language] && key in translations[language]) {
      return translations[language][key as TranslationKey];
    }
    // Si no existe, devolvemos la clave original
    return String(key);
  };

  // Función específica para obtener arrays de traducción
  const tArray = (key: TranslationKey | string): string[] => {
    const result = t(key);
    // Si el resultado ya es un array, lo devolvemos
    if (Array.isArray(result)) {
      return result;
    }
    // Si es un string, lo convertimos en un array de un elemento
    return [String(result)];
  };

  // Proporcionamos los valores y funciones a los componentes hijos
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
};
