import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ARProduct from './ARProduct';
import ErrorBoundary from '../ErrorBoundary';
import AnalyticsDashboard from '../AnalyticsDashboard/AnalyticsDashboard';
import { fetchAnalytics } from '../../services/api';

export default function ARViewer({ isVisible }) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [scanTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting recovery...');
      setTimeout(() => window.location.reload(), 1000);
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
      }
    };
  }, []);

  const handleBuyNow = async () => {
    setLoading(true);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
      setError(null);
      setShowAnalytics(true);
      
      // Smooth scroll to analytics section on mobile
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('analytics-section')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 100);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <div className="h-[50vh] min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center p-6 shadow-inner">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Scan the QR code to activate AR experience
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Point your camera at the QR code to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* AR Viewer Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Interactive AR Experience
        </h2>
      </div>

      {/* AR Content Area */}
      <div className="p-4 md:p-6">
        <div className="relative aspect-square md:aspect-video w-full bg-gray-50 rounded-lg overflow-hidden shadow-inner">
          <ErrorBoundary fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 p-4">
              AR failed to load. Please try refreshing.
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{
                antialias: true,
                preserveDrawingBuffer: true,
                powerPreference: "high-performance"
              }}
              className="absolute inset-0 w-full h-full"
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <ARProduct />
              <OrbitControls enableZoom={false} />
            </Canvas>
          </ErrorBoundary>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleBuyNow}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Buy Now'
            )}
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div id="analytics-section" className="border-t border-gray-200 bg-gray-50 p-6 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Campaign Analytics
          </h3>
          <AnalyticsDashboard 
            analytics={analytics} 
            scanTime={scanTime}
            error={error}
          />
        </div>
      )}
    </div>
  );
}