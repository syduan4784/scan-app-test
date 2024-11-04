// OpenCVComponent.js
import React, { useEffect } from 'react';
import cv from 'opencv.js';

const OpenCVComponent = ({ onProcessComplete, onError }) => {
  useEffect(() => {
    // Kiểm tra OpenCV đã được load hay chưa
    if (!cv || !cv.imread) {
      onError("OpenCV chưa được load đúng cách.");
      return;
    }

    const processImage = () => {
      try {
        // Lấy ảnh từ canvas
        const src = cv.imread('inputCanvas');  // Đảm bảo rằng canvas với ID 'inputCanvas' đã được tạo
        const dst = new cv.Mat();

        // Chuyển đổi ảnh thành grayscale
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);  
        onProcessComplete(dst);  // Trả về kết quả sau khi xử lý xong

        // Giải phóng bộ nhớ
        src.delete();
        dst.delete();
      } catch (error) {
        onError(`Lỗi xử lý OpenCV: ${error.message}`);
      }
    };

    processImage();
  }, [onProcessComplete, onError]);

  return (
    <div>
      <canvas id="inputCanvas" style={{ display: 'none' }}></canvas>
      Processing image with OpenCV...
    </div>
  );
};

export default OpenCVComponent;

