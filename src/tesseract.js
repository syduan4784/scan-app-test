import Tesseract from 'tesseract.js'; // Import Tesseract

// Hàm để nhận diện văn bản từ hình ảnh
export const recognizeText = (image) => {
  return Tesseract.recognize(image, 'kor+eng', {
    logger: (info) => console.log(info), // Theo dõi tiến trình nhận diện
  });
};

export default Tesseract;
