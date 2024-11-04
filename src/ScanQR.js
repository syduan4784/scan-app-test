import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Tesseract from 'tesseract.js';

const OpenCVComponent = lazy(() => import('./OpenCVComponent'));

const ErrorDisplay = ({ message }) => {
  return message ? <p style={{ color: 'red' }}>{message}</p> : null;
};

const ScanQR = () => {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [qrDataList, setQrDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const qrCodeRegionId = "reader";
  let html5QrCode;

  useEffect(() => {
    if (isScanning) {
      html5QrCode = new Html5Qrcode(qrCodeRegionId);

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeMessage => {
          setScannedData(qrCodeMessage);
          setQrDataList(prevList => [...prevList, qrCodeMessage]);
          setIsScanning(false);
          setErrorMessage(null);
        },
        error => setErrorMessage(`QR Code scanning error: ${error}`)
      ).catch(err => setErrorMessage(`Unable to start scanning, error: ${err}`));
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleNext = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  const handleTextScan = (image) => {
    Tesseract.recognize(
      image,
      'kor+eng',
      { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
      if (text) {
        setScannedData(text);
        setQrDataList(prevList => [...prevList, text]);
      } else {
        setErrorMessage('No text found in the image.');
      }
    }).catch(err => setErrorMessage('Error recognizing text, please try again.'));
  };

  const captureTextFromCamera = () => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth * 2;
          canvas.height = video.videoHeight * 2;
        };
        setTimeout(() => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          handleTextScan(canvas.toDataURL('image/png'));
          video.srcObject.getTracks().forEach(track => track.stop());
        }, 3000);
      }).catch(err => setErrorMessage('Cannot access the camera, please allow permissions.'));
  };

  useEffect(() => {
    setFilteredData(
      qrDataList.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, qrDataList]);

  // Hàm xử lý kết quả của OpenCV
  const handleProcessComplete = (processedData) => {
    console.log('Processed data:', processedData);
    // Xử lý hoặc lưu trữ kết quả từ OpenCV sau khi hoàn thành
  };

  // Hàm xử lý lỗi từ OpenCV
  const handleError = (error) => {
    console.error(error);
    setErrorMessage(error);
  };

  return (
    <div>
      <h2>QR Code Scanner & Text Scanner</h2>

      <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "350px", height: "250px", margin: "0 auto" }}></div>

      {scannedData ? (
        <div>
          <p>Scanned Data: {scannedData}</p>
          <button onClick={handleNext}>Next</button>
        </div>
      ) : (
        <p>No data scanned yet. Position the QR code in front of the camera.</p>
      )}

      <ErrorDisplay message={errorMessage} />

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder='Search scanned data...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        <h3>Search Results</h3>
        {filteredData.length > 0 ? (
          <ul>
            {filteredData.map((data, index) => (
              <li key={index}>{data}</li>
            ))}
          </ul>
        ) : (
          <p>No matching results found.</p>
        )}
      </div>

      <button onClick={captureTextFromCamera}>Scan Text from Camera</button>

      {/* Render OpenCV component */}
      <Suspense fallback={<div>Loading OpenCV Component...</div>}>
        <OpenCVComponent onProcessComplete={handleProcessComplete} onError={handleError} />
      </Suspense>
    </div>
  );
};

export default ScanQR;
