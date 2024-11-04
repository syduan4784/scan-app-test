import cv from 'opencv.js'; // Import OpenCV

// Xuất các hàm hoặc logic bạn muốn sử dụng trong các component khác
export const processImageWithOpenCV = (imageData) => {
  // Thực hiện xử lý hình ảnh với OpenCV, ví dụ:
  let src = cv.matFromImageData(imageData);
  let gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  return gray;
};

export default cv;