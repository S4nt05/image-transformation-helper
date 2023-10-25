import React, { useEffect, useState } from 'react';
import '../CSS/pasteimage.css'

export default function PasteImage({ setSrc }) {
  const [image, setImage] = useState(null);

  const handleChange = async (e) => {
    var item = await e.clipboardData.items[0];
  
    if (item.type.indexOf('image') === 0) {
      const img = URL.createObjectURL(item.getAsFile());
      setImage(image);
      setSrc(img);
    } else {
      alert('Solo se aceptan imágenes');
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(img);
      }
    };
  }, [image]);

  return (
    <>
      <input
        type='text'
        className='input-paste-image'
        placeholder='Pegar Imagen Ctrl + V'
        id='image'
        onPaste={handleChange}
        disabled
      />
    </>
  );
}
