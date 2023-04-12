/*import React, { useState, useEffect } from 'react';

function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const historialGuardado = localStorage.getItem('historial');
    if (historialGuardado) {
      setHistorial(JSON.parse(historialGuardado));
    }
  }, []);

  function agregarPalabra(palabra) {
    setHistorial([...historial, palabra]);
    localStorage.setItem('historial', JSON.stringify([...historial, palabra]));
  }

  return (
    <div>
      <h1>Historial de palabras</h1>
      <ul>
        {historial.map(palabra => <li key={palabra}>{palabra}</li>)}
      </ul>
    </div>
  );
}

export default Historial;*/
