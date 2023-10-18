import React, { useEffect } from 'react';

function Anuncio() {
  useEffect(() => {
    // Pega aquí el código de anuncio de AdSense
   (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="2491733330"
          data-ad-slot="ca-pub-8591176787868089"
          data-ad-format="auto"
          data-full-width-responsive="true">
       </ins>
    </div>
  );
}
export default Anuncio;
