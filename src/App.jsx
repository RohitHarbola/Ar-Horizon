import { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import QRScanner from './components/QRScanner/QRScanner';
import ARViewer from './components/ARViewer/ARViewer';

function App() {
  const [showAR, setShowAR] = useState(false);

  const handleScan = () => {
    setShowAR(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-4 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Interactive AR Experience
            </h1>
            <p className="text-sm md:text-base text-center mt-2 opacity-90">
              Scan the QR code to bring products to life
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* QR Scanner Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <QRScanner 
                  onScan={handleScan} 
                  isScanned={showAR}
                />
              </div>

              {/* AR Viewer Section */}
              <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${showAR ? 'hover:shadow-lg' : ''}`}>
                <ARViewer isVisible={showAR} />
              </div>
            </div>

            {/* Mobile Bottom Navigation (only shows when AR is visible) */}
            {showAR && (
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200">
                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Back to Scanner
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
}

export default App;