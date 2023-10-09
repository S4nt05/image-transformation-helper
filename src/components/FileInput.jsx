import React, { useState } from "react";
import '../CSS/StyleCropper.css' 

const CustomerFileInput = ({onChange}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    onChange(event);
  };

  return (
    <div className="file-input-container">
      <label className="file-input-label">
        Select File
        <input
          type="file"
          accept="image/*" 
          className="file-input-hidden"
          onChange={handleFileChange}
        />
      </label>

      {selectedFile && (
        <span className="file-name">
          Selected file: {selectedFile.name}
        </span>
      )}
    </div>
  );
};

export default CustomerFileInput;
