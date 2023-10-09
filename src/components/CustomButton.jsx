import React from "react";
import '../CSS/StyleCropper.css'

const CustomButton = (props) => {
  const { className, style, children, ...rest } = props;

  return (
    <button
      className={`custom-button ${className || ""}`}
      style={{ ...style }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;
