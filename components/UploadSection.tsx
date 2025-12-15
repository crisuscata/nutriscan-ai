import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Utensils } from 'lucide-react';

interface UploadSectionProps {
  onAnalyze: (image: string, context: string) => void;
  isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPreview(null);
    setContext('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (preview) {
      onAnalyze(preview, context);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {!preview ? (
        <div className="p-8 md:p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
               <Utensils className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sube una foto de tu comida</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Analiza instantáneamente las calorías y macronutrientes usando IA.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-indigo-200"
              >
                <Camera className="w-5 h-5" />
                Tomar / Subir Foto
              </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col">
           {/* Image Preview Area */}
          <div className="relative w-full h-64 md:h-80 bg-slate-900">
            <img 
              src={preview} 
              alt="Food Preview" 
              className="w-full h-full object-cover opacity-90"
            />
            <button 
              onClick={handleReset}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Input */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-slate-700 mb-2">
                Contexto Adicional (Opcional)
              </label>
              <textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ej: Es media ración, cocinado con aceite de oliva, sin sal..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400 resize-none h-24"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all
                ${isLoading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 transform hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </span>
              ) : (
                'Analizar Plato'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
