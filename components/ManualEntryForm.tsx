import React, { useState, useRef } from 'react';
import { Plus, Coffee, Save, Sparkles, X } from 'lucide-react';
import { DailyLogEntry } from '../types';
import { analyzeFoodImage } from '../services/geminiService';

interface ManualEntryFormProps {
    onAdd: (entry: Omit<DailyLogEntry, 'id' | 'timestamp' | 'source'>) => void;
    onCancel: () => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            name: name || 'Alimento Manual',
            calories: Number(calories) || 0,
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
            imageUrl: preview || undefined
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setPreview(base64);

            // Submit to AI
            setIsAnalyzing(true);
            try {
                const data = await analyzeFoodImage(base64, "Identifica este alimento (o etiqueta nutricional) y extrae sus macros exactos. Sé conciso.");

                // Auto-fill fields
                setName(data.nombre_plato_estimado);
                setCalories(String(data.analisis_total.calorias_totales_kcal));
                setProtein(String(data.analisis_total.proteinas_g));
                setCarbs(String(data.analisis_total.carbohidratos_g));
                setFat(String(data.analisis_total.grasas_g));
            } catch (err) {
                console.error("Autofill failed", err);
                // We could show a toast here, but for now we just stop loading
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
            <div className="glass-panel p-8 rounded-3xl shadow-premium">

                {/* Header with Magic Fill */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                            <Coffee className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-secondary-900">Registro Manual</h2>
                            <p className="text-secondary-500 text-sm">Escribe los detalles o usa una foto.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="group relative overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md transition-all hover:shadow-lg hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12" />
                        <span className="relative flex items-center gap-2 text-sm">
                            {isAnalyzing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Autocompletar con IA
                                </>
                            )}
                        </span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Image Preview strip */}
                {preview && (
                    <div className="mb-6 relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm group">
                        <img src={preview} alt="Referencia" className="w-full h-full object-cover" />
                        <button
                            onClick={clearImage}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">Nombre del Alimento</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Manzana Verde, Barra de Proteína..."
                            className={`w-full p-4 bg-white/50 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${isAnalyzing ? 'animate-pulse bg-slate-100 text-transparent' : 'border-secondary-200'}`}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">Calorías (kcal)</label>
                            <input
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                placeholder="0"
                                className={`w-full p-4 bg-white/50 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${isAnalyzing ? 'animate-pulse bg-slate-100 text-transparent' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2 text-primary-600">Proteínas (g)</label>
                            <input
                                type="number"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                placeholder="0"
                                className={`w-full p-4 bg-primary-50/50 border border-primary-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${isAnalyzing ? 'animate-pulse bg-slate-100 text-transparent' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2 text-amber-500">Carbohidratos (g)</label>
                            <input
                                type="number"
                                value={carbs}
                                onChange={(e) => setCarbs(e.target.value)}
                                placeholder="0"
                                className={`w-full p-4 bg-amber-50/50 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all ${isAnalyzing ? 'animate-pulse bg-slate-100 text-transparent' : ''}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2 text-slate-500">Grasas (g)</label>
                            <input
                                type="number"
                                value={fat}
                                onChange={(e) => setFat(e.target.value)}
                                placeholder="0"
                                className={`w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all ${isAnalyzing ? 'animate-pulse bg-slate-100 text-transparent' : ''}`}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="flex-1 py-3 px-6 rounded-xl border border-secondary-200 text-secondary-600 font-medium hover:bg-secondary-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isAnalyzing} className="flex-2 flex-grow py-3 px-6 rounded-xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-primary-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            <Save className="w-5 h-5" />
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualEntryForm;
