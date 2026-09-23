import { useState, useEffect } from "react";

// Avanza un índice de 0..length-1 cada `intervalMs`, en pausa si hay 0 o 1 elementos.
// Se usa para las galerías rotativas de Hero, Historia, Programa y Equipo.
export default function useRotatingIndex(length, intervalMs = 5000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) { setIndex(0); return; }
    const id = setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => clearInterval(id);
  }, [length, intervalMs]);

  // Protege contra el caso en que `length` se reduzca (se borró una imagen)
  // y el índice guardado haya quedado fuera de rango.
  return length ? index % length : 0;
}
