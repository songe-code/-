import React, { useEffect, useState, useRef } from 'react';
import { FuturesElement, ExplanationResponse, AudioState } from '../types';
import { CATEGORY_TEXT_COLORS } from '../constants';
import { fetchConceptExplanation, fetchConceptSpeech, decodeAudioData } from '../services/geminiService';

interface DetailModalProps {
  element: FuturesElement;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ element, onClose }) => {
  const [data, setData] = useState<ExplanationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    hasAudio: false
  });
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchConceptExplanation(element.name);
        if (isMounted) {
          setData(result);
        }
      } catch (e) {
        console.error("Failed to load explanation", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    // Cleanup audio on unmount or element change
    return () => {
      isMounted = false;
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  };

  const handlePlayAudio = async () => {
    if (audioState.isPlaying) {
      stopAudio();
      return;
    }

    if (!data) return;

    // Initialize AudioContext if not exists (must be after user interaction)
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Resume context if suspended
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // If we already have the buffer, just play it
    if (audioBufferRef.current) {
      playBuffer(audioBufferRef.current);
      return;
    }

    // Fetch and decode audio
    setAudioState(prev => ({ ...prev, isLoading: true }));
    try {
      // Construct text to read
      const textToRead = `关于${element.name}。${data.definition}。举个例子：${data.analogy}。记住：${data.keyPoint}`;
      
      const audioData = await fetchConceptSpeech(textToRead);
      const decodedBuffer = await decodeAudioData(audioData, audioContextRef.current);
      
      audioBufferRef.current = decodedBuffer;
      setAudioState(prev => ({ ...prev, hasAudio: true }));
      playBuffer(decodedBuffer);
      
    } catch (error) {
      console.error("Audio playback failed", error);
      alert("无法生成音频，请稍后再试。");
    } finally {
      setAudioState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const playBuffer = (buffer: AudioBuffer) => {
    if (!audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      sourceNodeRef.current = null;
    };

    source.start();
    sourceNodeRef.current = source;
    setAudioState(prev => ({ ...prev, isPlaying: true }));
  };

  const categoryColor = CATEGORY_TEXT_COLORS[element.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-gray-800 ${categoryColor} border border-current`}>
              {element.symbol}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{element.name}</h2>
              <span className={`text-sm ${categoryColor} uppercase tracking-wider`}>{element.category}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 animate-pulse">AI 正在生成期货投教内容...</p>
            </div>
          ) : data ? (
            <>
              {/* Definition */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm uppercase text-gray-400 mb-2 font-bold tracking-widest">核心定义</h3>
                <p className="text-lg leading-relaxed text-gray-100">{data.definition}</p>
              </div>

              {/* Analogy & Key Point Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 p-4 rounded-xl border border-indigo-500/20">
                  <h3 className="flex items-center gap-2 text-indigo-300 font-bold mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    形象比喻
                  </h3>
                  <p className="text-indigo-100 text-sm">{data.analogy}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 p-4 rounded-xl border border-emerald-500/20">
                  <h3 className="flex items-center gap-2 text-emerald-300 font-bold mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    划重点
                  </h3>
                  <p className="text-emerald-100 text-sm">{data.keyPoint}</p>
                </div>
              </div>

              {/* Example */}
              <div className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-amber-500">
                 <h3 className="text-amber-500 font-bold mb-1 text-sm">实战举例</h3>
                 <p className="text-gray-300 italic">"{data.example}"</p>
              </div>
            </>
          ) : (
            <div className="text-center text-red-400">内容加载失败，请检查网络或 API Key。</div>
          )}
        </div>

        {/* Footer / Audio Controls */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/80 flex justify-between items-center">
            <div className="text-xs text-gray-500">
               Content by Gemini 2.5 Flash • TTS by Gemini 2.5 TTS
            </div>
            
            <button 
              disabled={loading}
              onClick={handlePlayAudio}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${audioState.isPlaying 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/50' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50'
                }
              `}
            >
              {audioState.isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>生成语音中...</span>
                </>
              ) : audioState.isPlaying ? (
                <>
                  <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
                  <span>停止解说</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  <span>听AI解说</span>
                </>
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;