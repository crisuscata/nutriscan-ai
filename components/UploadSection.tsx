import React, { useState, useRef } from 'react';
import { Camera, X, ScanLine, ArrowRight } from 'lucide-react';

interface UploadSectionProps {
  onAnalyze: (image: string, context: string) => void;
  isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setContext('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (preview) onAnalyze(preview, context);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`glass-panel rounded-3xl shadow-premium overflow-hidden transition-all duration-300 ${isDragging ? 'scale-[1.02] ring-2 ring-primary-400' : ''}`}>
        {!preview ? (
          <div
            className="p-10 md:p-14 text-center cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-8 flex justify-center relative">
              <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 transition-transform group-hover:scale-110 duration-300">
                <ScanLine className="w-10 h-10" />
              </div>
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <h2 className="text-2xl font-bold text-secondary-800 mb-3">Analizar Comida</h2>
            <p className="text-secondary-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Arrastra una foto aquí o haz clic para subirla.
              <br /><span className="text-xs font-medium text-primary-600 uppercase tracking-widest mt-2 block">Soporta JPG, PNG, WEBP</span>
            </p>

            <button className="inline-flex items-center gap-2 px-8 py-3 bg-secondary-900 hover:bg-black text-white rounded-full font-medium transition-all shadow-lg shadow-secondary-900/20 group-hover:shadow-secondary-900/40">
              <Camera className="w-5 h-5" />
              <span>Seleccionar Foto</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Preview Side */}
            <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-secondary-900 group">
              <img
                src={preview}
                alt="Food Preview"
                className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
              <button
                onClick={handleReset}
                className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors border border-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context Input Side */}
            <div className="p-8 md:p-10 flex-1 flex flex-col justify-center bg-white/50 backdrop-blur-sm">
              <div className="space-y-6">
                <div>
                  <label htmlFor="context" className="block text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                    Contexto (Opcional)
                  </label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Escribe detalles como ingredientes ocultos, tipo de cocción..."
                    className="w-full p-4 bg-white border border-secondary-100 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-secondary-700 placeholder:text-secondary-300 resize-none h-32 text-sm shadow-sm"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase shadow-xl transition-all flex items-center justify-center gap-2
                    ${isLoading
                      ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30 hover:shadow-primary-600/50 hover:scale-[1.02]'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>Comenzar Análisis</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;
