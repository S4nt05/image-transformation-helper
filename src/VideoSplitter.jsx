import React, { useState, useEffect, useRef } from 'react';
import 'cropperjs/dist/cropper.css';
import './CSS/StyleCropper.css';

const VideoSplitter = () => {
  const [file, setFile] = useState(null);
  const [segmentDuration, setSegmentDuration] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [titleText, setTitleText] = useState('');
  const [footerText, setFooterText] = useState('');
  const xhrRef = useRef(null);

  const stopSimulatingProgress = () => {
    clearInterval(intervalId);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSegmentDurationChange = (event) => {
    // setSegmentDuration(event.target.value);
    const value = parseInt(event.target.value, 10);
    setSegmentDuration(Math.min(10, Math.max(1, value)));
  };

  const handleTitleTextChange = (event) => {
    setTitleText(event.target.value);
  };

  const handleFooterTextChange = (event) => {
    setFooterText(event.target.value);
  };
  // Función para mostrar el error durante 3 segundos
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  //const url = 'https://localhost:44379/api/SegmentacionVideo';
  //const url = 'http://localhost:8082/api/';
  //const url = 'http://moises07-001-site1.ctempurl.com/';
  const url = 'https://videosplitter.azurewebsites.net/api/SegmentacionVideo';

    let intervalId;
  useEffect(() => {

    const simulateProgress = () => {
      intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = (prevProgress + 2) % 101;
          return newProgress >= 100 ? 0 : newProgress;
        });
      }, 200);
    };

    const stopSimulatingProgress = () => {
      clearInterval(intervalId);
    };

    if (uploading && progress < 100) {
      simulateProgress();
    } else {
      stopSimulatingProgress();
    }

    return stopSimulatingProgress;
  }, [uploading, progress]);

  const handleUpload = async () => {
    try {
      handleError(null);
      if (!file) {
        handleError('Please select a file.');
        return;
      }
      const apiIsAvailable = await checkApiHealth();
      if (!apiIsAvailable) {
        handleError('API is not available.');
        setLoading(true);
        return;
      }
      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progressPercentage = (e.loaded / e.total) * 100;
          setProgress(progressPercentage);
          if (progressPercentage >= 100) {
            setProgress(0);
          }
        }
      };

      xhr.onload = async () => {
        // Independientemente de la respuesta del API, detenemos la simulación
        setUploading(false);
        setProgress(0);

        if (xhr.status === 200) {
          try {
            // Validar si la respuesta es un archivo ZIP
            const contentType = xhr.getResponseHeader('Content-Type');
            if (contentType === 'application/zip') {
              const compressBlob = new Blob([xhr.response], { type: 'application/zip' });
  
              const downloadLink = document.createElement('a');
              downloadLink.href = URL.createObjectURL(compressBlob);
          downloadLink.download = (footerText !== "" ? footerText : titleText) + '_segments.zip';
              document.body.appendChild(downloadLink);
  
              downloadLink.click();
              setProgress(100);
              document.body.removeChild(downloadLink);
  
              handleError(null);
              setFile(null);
              setSegmentDuration(1);
              setFooterText('');
              setTitleText('');
              document.getElementById('idInput').value = '';
              stopSimulatingProgress(); // Detener la simulación cuando se complete la descarga
            } else {
              handleError('La respuesta no es un archivo ZIP válido.');
            }
          } catch (error) {
            handleError(`Error during download: ${error.message}`);
          }
        } else {
          handleError(`Error uploading file: ${xhr.statusText}`);
        }

        setLoading(false);
      };
      // Agregar datos de video al objeto
      const videoData = {
        segmentDuration: segmentDuration,
        titulo: titleText,
        pieVideo: footerText,
      };

      // Convertir el objeto a una cadena JSON y agregarlo al formulario
      formData.append('video', JSON.stringify(videoData));

      xhr.open('POST', `${url}/upload`, true);
      xhr.responseType = 'blob'; // Configurar responseType para manejar la respuesta como Blob
      xhr.send(formData);

      xhrRef.current = xhr;
    } catch (error) {
      handleError(`Error: ${error.message}`);
      setLoading(true);
      setUploading(false);
    }
  };

  const handleAbort = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setLoading(true);
      handleError('File upload aborted.');
      setProgress(0);
      setUploading(false);
      stopSimulatingProgress(); // Detener la simulación de progreso
    }
  };

    // Nuevo método para consultar el estado de salud del API
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${url}/health`);
        return response.ok;
      } catch (error) {
        return false;
      }
    };
    useEffect(() => {
      // Lógica de verificación de salud al cargar el componente
      const checkServerAvailability = async () => {
        try {
          const response = await checkApiHealth();
          if (!response) {
            handleError('API is not available.');
            setLoading(true);
          } else {
            setLoading(false);
          }
        } catch (error) {
          handleError(`Error: ${error.message}`);
          setLoading(true);
        }
      };
  
      // Llamada a la función al montar el componente
      checkServerAvailability();
      // Configurar la verificación de salud cada 15 minutos
      const healthCheckInterval = setInterval(checkServerAvailability, 1 * 60 * 1000);
      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(healthCheckInterval);
    }, []); // El array de dependencias está vacío para que esta efecto solo se ejecute al montar y desmontar el componente
  
  return (
    <div className="container">
      <h1 className="title">Video Splitter</h1>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div className="input-container">
        <h3> <span>Archivo a segmentar</span> </h3>
        <input
          type="file"
          className="input file-input-label"
          id="idInput"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      <div className="input-container">
        <h3> <span>Intervalo en minutos</span> </h3>
        <input
          type="number"
          className="input number-input"
          min="1"
          max="10"
          value={segmentDuration}
          onChange={handleSegmentDurationChange}
          disabled={loading}
        />
      </div>

      <div className="input-container">
        <h3> <span>Título de Video</span> </h3>
        <input
          type="text"
          className="input form-control"
          value={titleText}
          onChange={handleTitleTextChange}
          disabled={loading}
        />
      </div>

      <div className="input-container">
        <h3> <span>Pie de Video</span> </h3>
        <input
          type="text"
          className="input form-control"
          value={footerText}
          onChange={handleFooterTextChange}
          disabled={loading}
        />
      </div>

      <div className="video-controls-container">
        <button className="video-control-button" onClick={handleUpload} disabled={loading}>
          Upload and Process
        </button>
        <button onClick={handleAbort} disabled={loading}>
          Abort Upload
        </button>
        {uploading && (
          <div className="progress-container">
            <progress value={progress} max="100" />
            {/* {progress.toFixed(2)}% */}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSplitter;
