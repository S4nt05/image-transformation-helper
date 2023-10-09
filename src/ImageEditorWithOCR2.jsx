import React, { useState, useRef, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; 
import Tesseract from "tesseract.js";
import CustomerFileInput from "./components/FileInput";
import CustomButton from "./components/CustomButton";

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
    <div style={{ paddingLeft: "10px" }}>
      <h1>Convert images to text</h1>

      <CustomerFileInput onChange={handleImageChange} />
      {src && (
        <div style={{ width: "100%" }}>
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
          <CustomButton
            onClick={handleCrop}
            className="custom-button"
            style={{ fontSize: "18", marginTop: "10px" }}
            disabled={false}
          >
            Cropp
          </CustomButton>
        </div>
      )}

      {croppedImage && (
        <div style={{ paddingLeft: "10px" }}>
          <div>
            <div className="box" style={{ width: "50%", float: "right" }}>
              
            <div className="containerdiv">
                <h1><span>Cropped</span></h1>
                <button
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>
              <img
                className="img-preview"
                src={croppedImage}
                alt="Cropped Image"
                style={{ maxWidth: "100%" }}
              />
            </div>
            {ocrText && (
              <div
                className="box"
                style={{ width: "50%", float: "left", height: "300px" }}
              >
                <div className="containerdiv">
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
          <br style={{ clear: "both" }} />
        </div>
      )}
    </div>
  );
};
export default ImageCropperOCR2;
