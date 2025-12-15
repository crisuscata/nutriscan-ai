import React, { useState } from 'react';
import { ChefHat, Github, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col mesh-gradient relative">
      {/* Background Decor Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Floating Header */}
      <header className="w-full pt-6 px-4 z-50 flex justify-center">
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-full text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-secondary-800 tracking-tight">
              NutriScan <span className="text-primary-600">AI</span>
            </h1>
          </div>
          <div className="h-4 w-px bg-secondary-200" />
          <nav className="flex items-center gap-4 text-sm font-medium text-secondary-500">
            <a href="#" className="hover:text-primary-600 transition-colors">Historial</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Perfil</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 mt-4">
        <div className="w-full max-w-5xl">
          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50/50 border border-red-100 text-red-700 rounded-2xl text-center shadow-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {!result ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-xs font-bold tracking-wide uppercase mb-4 border border-primary-200/50">
                  Powered by Cristian Uscata
                </span>
                <h2 className="text-5xl md:text-6xl font-extrabold text-secondary-900 mb-6 tracking-tight leading-[1.1]">
                  Tu nutricionista, <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                    reimaginado.
                  </span>
                </h2>
                <p className="text-lg text-secondary-500 max-w-lg mx-auto leading-relaxed">
                  Transforma tus comidas en datos accionables. Simplemente escanea tu plato para obtener un análisis nutricional profundo al instante.
                </p>
              </div>
              <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          ) : (
            <NutritionCard data={result} onReset={resetApp} />
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-8 mt-auto text-center z-10">
        <p className="text-xs text-secondary-400 font-medium tracking-wide">
          © {new Date().getFullYear()} NUTRISCAN AI
        </p>
      </footer>
    </div>
  );
};

export default App;
