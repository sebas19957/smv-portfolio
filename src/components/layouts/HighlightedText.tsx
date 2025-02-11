import React, { ReactNode } from "react";

// Definimos las props del componente
interface HighlightedTextProps {
  children: ReactNode; // ReactNode permite cualquier tipo de contenido válido en React (texto, elementos, etc.)
}

// Componente reutilizable para texto resaltado
const HighlightedText: React.FC<HighlightedTextProps> = ({ children }) => {
  return <span className="text-primary ml-1">{children}</span>;
};

export default HighlightedText;
