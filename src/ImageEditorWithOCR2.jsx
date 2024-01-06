import React, { useState, useRef, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Tesseract from "tesseract.js";
import CustomFileInput from "./components/FileInput";
import CustomButton from "./components/CustomButton";
import Anuncio from "./components/Anuncio";
import PasteImage from "./components/PasteImage";
import './CSS/StyleImageEditorWithOCR2.css'; // Importa tus estilos CSS

const ImageCropperOCR2 = () => {
  const [src, setSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [useCrop, setUseCrop] = useState(true);
  const cropperRef = useRef(null);
  const cropperRefNewState = useRef(useCrop);

  useEffect(() => {
    if (src && useCrop) {
      handleCrop();
    }
  }, [src, useCrop]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSrc(reader.result);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const scaledImage = croppedCanvas.toDataURL("image/jpeg");
        setCroppedImage(scaledImage);
        performOCR(scaledImage);
      }
    }
  };

  const onCropMove = (e) => {
    if (cropperRefNewState.current) {
      handleCrop();
    }
  };

  const performOCR = async (imageData) => {
    setOcrText("Processing...");
    try {
      const result = await Tesseract.recognize(imageData, "eng");
      const ocrText = result.data.text;
      setOcrText(ocrText);
    } catch (error) {
      setOcrText("Error processing image.");
    }
  };

  const handleDownload = () => {
    if (croppedImage) {
      const link = document.createElement("a");
      link.href = croppedImage;
      link.download = "cropped_image.png";
      link.click();
    }
  };

  return (
    <div className="cropper-main-container" >
      <Anuncio />
        <div className="cropper-title-div">
          <h1 className="cropper-title">Convert images to text</h1>
        </div>

        <div className="cropper-inputs-container">
          <div className="cropper-file-input-div">
            <CustomFileInput onChange={handleImageChange} />
          </div>
          <div className="cropper-paste-image-div">
            <PasteImage setSrc={setSrc} />
          </div>
        </div>
        {src && (
          <>
          <hr style={{width: '100%', border: 'none', borderBottom: '1px solid #3498db'}}></hr>
          <div className="cropper-cropper-container">
            <div className="cropper-checkbox-div">
              <label>
                <input
                  type="checkbox"
                  checked={useCrop}
                  onChange={() => {
                    cropperRefNewState.current = !useCrop;
                    setUseCrop(!useCrop);
                  }}
                />
                automatic
              </label>
            </div>

            <div className="cropper-cropper-div">
              <Cropper
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                preview=".img-preview"
                src={src}
                ref={cropperRef}
                viewMode={1}
                guides={true}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                checkOrientation={false}
                cropend={() => onCropMove()}
              />
            </div>

            <div className="cropper-button-div">
              <CustomButton
                onClick={handleCrop}
                className="cropper-custom-button"
                style={{ fontSize: "18", marginTop: "10px" }}
                disabled={false}
              >
                Crop
              </CustomButton>
            </div>
          </div>
          </>
        )}
        
        {croppedImage && (
          <>
          <hr style={{width: '100%', border: 'none', borderBottom: '1px solid #3498db'}}></hr>
          <div className="cropper-result-container">
            <div className="cropper-cropped-image-box">
              <div className="cropper-containerdiv">
                <h1>
                  <span>Cropped</span>
                </h1>
                <button onClick={handleDownload}>Download</button>
              </div>
              <img
                className="img-preview"
                src={croppedImage}
                alt="Cropped Image"
                style={{ maxWidth: "100%" }}
              />
            </div>
            <hr style={{width: '100%', border: 'none', borderBottom: '1px solid #3498db'}}></hr>
            {ocrText && (
              <div className="cropper-ocr-text-box">
                <div className="cropper-containerdiv">
                  <h1>
                    <span>Image Text</span>
                  </h1>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ocrText);
                    }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{ whiteSpace: "pre-line", paddingLeft: "10px" }}>
                  {ocrText}
                </div>
              </div>
            )}
          </div>
          </>
        )}
    </div>
  );
};

export default ImageCropperOCR2;
