import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Plus, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import UploadSection from './components/UploadSection';
import NutritionCard from './components/NutritionCard';
import ManualEntryForm from './components/ManualEntryForm';
import DailyDashboard from './components/DailyDashboard';
import { analyzeFoodImage } from './services/geminiService';
import { NutritionalResponse, DailyLogEntry } from './types';

type ViewState = 'dashboard' | 'scan' | 'manual' | 'result';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NutritionalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<DailyLogEntry[]>(() => {
    const saved = localStorage.getItem('dailyLog');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dailyLog', JSON.stringify(entries));
  }, [entries]);

  const handleAnalyze = async (image: string, context: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeFoodImage(image, context);
      setResult(data);
      setView('result');
    } catch (err) {
      setError("No pudimos analizar la imagen. Por favor intenta con una foto más clara o revisa tu conexión.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFromScan = () => {
    if (result) {
      const newEntry: DailyLogEntry = {
        id: crypto.randomUUID(),
        name: result.nombre_plato_estimado,
        timestamp: Date.now(),
        calories: Number(result.analisis_total.calorias_totales_kcal),
        protein: Number(result.analisis_total.proteinas_g),
        carbs: Number(result.analisis_total.carbohidratos_g),
        fat: Number(result.analisis_total.grasas_g),
        source: 'scan'
      };
      setEntries([newEntry, ...entries]);
      setResult(null);
      setView('dashboard');
    }
  };

  const handleAddManual = (entry: Omit<DailyLogEntry, 'id' | 'timestamp' | 'source'>) => {
    const newEntry: DailyLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source: 'manual'
    };
    setEntries([newEntry, ...entries]);
    setView('dashboard');
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col mesh-gradient relative pb-20 md:pb-0">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Header */}
      <header className="w-full pt-6 px-4 z-50 flex justify-center sticky top-0">
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="bg-primary-600 p-1.5 rounded-full text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-secondary-800 tracking-tight hidden sm:block">
              NutriScan <span className="text-primary-600">AI</span>
            </h1>
          </div>

          {/* NavigationTabs (Desktop) */}
          <div className="h-4 w-px bg-secondary-200 hidden sm:block" />
          <nav className="hidden sm:flex items-center gap-1">
            <NavTab active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Dashboard" />
            <NavTab active={view === 'scan'} onClick={() => setView('scan')} label="Escanear" />
            <NavTab active={view === 'manual'} onClick={() => setView('manual')} label="Manual" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8 mt-4 w-full max-w-5xl mx-auto">
        {error && (
          <div className="w-full max-w-2xl mb-8 p-4 bg-red-50/50 border border-red-100 text-red-700 rounded-2xl text-center shadow-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {view === 'dashboard' && (
          <DailyDashboard
            entries={entries}
            onDelete={handleDeleteEntry}
            onAddMore={() => setView('scan')}
          />
        )}

        {view === 'scan' && (
          <div className="w-full flex flex-col items-center animate-fade-in-up">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-4 tracking-tight">
                Escanear Comida
              </h2>
              <p className="text-lg text-secondary-500 max-w-lg mx-auto">
                Sube una foto y deja que la IA calcule tus macros instantáneamente.
              </p>
            </div>
            <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            <div className="mt-8">
              <button onClick={() => setView('manual')} className="text-sm font-medium text-secondary-500 hover:text-primary-600 underline decoration-dotted underline-offset-4">
                ¿Prefieres escribirlo manualmente?
              </button>
            </div>
          </div>
        )}

        {view === 'manual' && (
          <ManualEntryForm onAdd={handleAddManual} onCancel={() => setView('dashboard')} />
        )}

        {view === 'result' && result && (
          <div className="w-full max-w-4xl animate-fade-in-up">
            <NutritionCard data={result} onReset={() => setView('scan')} />
            <div className="flex justify-center mt-8 gap-4 pb-12">
              <button
                onClick={() => setView('scan')}
                className="px-6 py-3 rounded-xl border border-secondary-200 text-secondary-600 font-medium hover:bg-secondary-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddFromScan}
                className="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-primary-600/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar al Diario
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Navigation Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 glass-panel px-2 py-2 rounded-full flex sm:hidden gap-1 z-50 shadow-2xl scale-90 md:scale-100">
        <MobileNavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={20} />} />
        <div className="w-px h-6 bg-secondary-200 mx-1 my-auto" />
        <MobileNavBtn active={view === 'scan'} onClick={() => setView('scan')} icon={<UtensilsCrossed size={20} />} />
        <MobileNavBtn active={view === 'manual'} onClick={() => setView('manual')} icon={<Plus size={24} />} isMain />
      </div>
    </div>
  );
};

const NavTab = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${active ? 'bg-secondary-900 text-white shadow-md' : 'text-secondary-500 hover:text-primary-600 hover:bg-primary-50'}`}
  >
    {label}
  </button>
);

const MobileNavBtn = ({ active, onClick, icon, isMain }: any) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-full transition-all flex items-center justify-center 
         ${isMain
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:scale-105'
        : active ? 'bg-secondary-900 text-white' : 'text-secondary-400 hover:bg-secondary-50'}`}
  >
    {icon}
  </button>
);

export default App;
