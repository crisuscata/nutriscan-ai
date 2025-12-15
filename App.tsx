import React, { useState } from 'react';
import { ChefHat, Github } from 'lucide-react';
import UploadSection from './components/UploadSection';
import NutritionCard from './components/NutritionCard';
import { analyzeFoodImage } from './services/geminiService';
import { NutritionalResponse } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NutritionalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (image: string, context: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeFoodImage(image, context);
      setResult(data);
    } catch (err) {
      setError("No pudimos analizar la imagen. Por favor intenta con una foto más clara o revisa tu conexión.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50/50">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              NutriScan AI
            </h1>
          </div>
          <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          {error && (
            <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-center shadow-sm">
              {error}
            </div>
          )}

          {!result ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="text-center mb-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Tu Nutricionista Visual
                </h2>
                <p className="text-lg text-slate-600">
                  Sube una foto de tu plato y obtén un desglose nutricional detallado impulsado por inteligencia artificial.
                </p>
              </div>
              <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          ) : (
            <NutritionCard data={result} onReset={resetApp} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} NutriScan AI. Powered by Cristian Uscata.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
