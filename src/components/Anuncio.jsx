import React, { useEffect } from 'react';

function Anuncio() {
  useEffect(() => {
    // Pega aquí el código de anuncio de AdSense
   (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div>
      <h2>Contenido de tu sitio</h2>
      <div>
        {/* Contenedor para el anuncio */}
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-8591176787868089"
          data-ad-slot="8591176787868089"
          data-ad-format="auto"
          data-full-width-responsive="true">
       </ins>
      </div>
    </div>
  );
}
export default Anuncio;
