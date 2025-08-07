import { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { recordScan } from '../../services/api';
import ErrorBoundary from '../ErrorBoundary';

export default function QRScanner({ onScan, isScanned }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleScanSimulation = async () => {
    setIsLoading(true);
    const scanTimestamp = new Date();
    
    try {
      await recordScan();
      onScan(scanTimestamp);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Scan the QR Code</h2>
      <div className="flex justify-center mb-4">
        <ErrorBoundary>
          <QRCode 
            value="https://ar-campaign.example.com" 
            size={200}
            level="H"
            includeMargin
          />
        </ErrorBoundary>
      </div>
     
        <p className="text-gray-600 mb-4">
         Point your camera at the QR code to experience augmented reality.
     </p>
      <button
        onClick={handleScanSimulation}
        disabled={isLoading || isScanned}
        className={`w-full py-2 px-4 rounded-md ${
           isLoading || isScanned 
             ? 'bg-gray-400' 
             : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white font-medium`}
       >
         {isLoading ? 'Loading...' : (isScanned ? 'Already Scanned' : 'Simulate Scan')}
       </button>
    </div>
  );
}




//  <p className="text-gray-600 mb-4">
//         Point your camera at the QR code to experience augmented reality.
//       </p>
//       <button
//         onClick={handleScanSimulation}
//         disabled={isLoading || isScanned}
//         className={`w-full py-2 px-4 rounded-md ${
//           isLoading || isScanned 
//             ? 'bg-gray-400' 
//             : 'bg-indigo-600 hover:bg-indigo-700'
//         } text-white font-medium`}
//       >
//         {isLoading ? 'Loading...' : (isScanned ? 'Already Scanned' : 'Simulate Scan')}
//       </button>