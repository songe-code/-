import React, { useState } from 'react';
import PeriodicTable from './components/PeriodicTable';
import DetailModal from './components/DetailModal';
import { FuturesElement } from './types';

function App() {
  const [selectedElement, setSelectedElement] = useState<FuturesElement | null>(null);

  const handleElementSelect = (element: FuturesElement) => {
    setSelectedElement(element);
  };

  const handleCloseModal = () => {
    setSelectedElement(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="pt-10 pb-6 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          期货元素周期表
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          点击元素，探索期货交易的核心奥秘。
          <br />
          <span className="text-sm opacity-60">
            Powered by Gemini AI (Deep Analysis + TTS)
          </span>
        </p>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <PeriodicTable onElementSelect={handleElementSelect} />
      </main>

      {/* Modal Overlay */}
      {selectedElement && (
        <DetailModal 
          element={selectedElement} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default App;