import React from 'react';
import { DailyLogEntry } from '../types';
import { Trash2, TrendingUp, Clock, PlusCircle } from 'lucide-react';

interface DailyDashboardProps {
    entries: DailyLogEntry[];
    onDelete: (id: string) => void;
    onAddMore: () => void;
}

const DailyDashboard: React.FC<DailyDashboardProps> = ({ entries, onDelete, onAddMore }) => {
    // Filter for Today only
    const todaysEntries = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const today = new Date();
        return entryDate.getDate() === today.getDate() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear();
    });

    const totals = todaysEntries.reduce(
        (acc, entry) => ({
            calories: acc.calories + entry.calories,
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Hardcoded goals for demo purposes
    const goals = { calories: 2000, protein: 150, carbs: 250, fat: 70 };

    const getProgress = (current: number, goal: number) => Math.min((current / goal) * 100, 100);

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            {/* Daily Summary Card */}
            <div className="glass-panel p-8 rounded-3xl shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <h2 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary-600" />
                        Resumen del Día
                    </h2>
                    <span className="text-sm font-medium text-secondary-500 bg-white/50 px-3 py-1 rounded-full border border-secondary-100">
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    {/* Calories Main Circle */}
                    <div className="col-span-1 md:col-span-1 flex flex-col items-center justify-center p-4 bg-white/60 rounded-2xl border border-secondary-100">
                        <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary-100" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary-500 transition-all duration-1000 ease-out"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * getProgress(totals.calories, goals.calories)) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-xl font-bold text-secondary-900">{Math.round(totals.calories)}</span>
                                <span className="text-[10px] uppercase text-secondary-400 font-bold">kcal</span>
                            </div>
                        </div>
                        <span className="text-xs text-secondary-500">Meta: {goals.calories}</span>
                    </div>

                    {/* Macros Bars */}
                    <div className="col-span-1 md:col-span-3 space-y-5 justify-center flex flex-col">
                        <MacroBar
                            label="Proteínas"
                            current={totals.protein}
                            max={goals.protein}
                            color="bg-primary-500"
                            bgColor="bg-primary-100"
                            textColor="text-primary-700"
                        />
                        <MacroBar
                            label="Carbohidratos"
                            current={totals.carbs}
                            max={goals.carbs}
                            color="bg-amber-400"
                            bgColor="bg-amber-100"
                            textColor="text-amber-700"
                        />
                        <MacroBar
                            label="Grasas"
                            current={totals.fat}
                            max={goals.fat}
                            color="bg-slate-400"
                            bgColor="bg-slate-100"
                            textColor="text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* Food Log List */}
            <div>
                <div className="flex justify-between items-end mb-4 px-2">
                    <h3 className="text-lg font-semibold text-secondary-800">Historial de Comidas</h3>
                    <button onClick={onAddMore} className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                        <PlusCircle className="w-4 h-4" /> Agregar más
                    </button>
                </div>

                <div className="space-y-3">
                    {todaysEntries.length === 0 ? (
                        <div className="py-12 text-center bg-white/30 rounded-3xl border border-secondary-100 border-dashed">
                            <p className="text-secondary-400">Aún no has registrado comidas hoy.</p>
                        </div>
                    ) : (
                        todaysEntries.map((entry) => (
                            <div key={entry.id} className="bg-white p-4 rounded-2xl border border-secondary-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.source === 'scan' ? 'bg-indigo-50 text-indigo-500' : 'bg-orange-50 text-orange-500'}`}>
                                        {entry.source === 'scan' ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-secondary-900">{entry.name}</h4>
                                        <div className="flex gap-3 text-xs text-secondary-500 mt-0.5">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="font-medium text-secondary-700">{entry.calories} kcal</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex gap-3 text-xs tabular-nums text-secondary-400">
                                        <span>P: <b className="text-secondary-600">{entry.protein}</b></span>
                                        <span>C: <b className="text-secondary-600">{entry.carbs}</b></span>
                                        <span>G: <b className="text-secondary-600">{entry.fat}</b></span>
                                    </div>
                                    <button
                                        onClick={() => onDelete(entry.id)}
                                        className="p-2 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const MacroBar = ({ label, current, max, color, bgColor, textColor }: any) => {
    const percent = Math.min((current / max) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className={textColor}>{label}</span>
                <span className="text-secondary-400">{Math.round(current)} / {max}g</span>
            </div>
            <div className={`w-full h-2.5 ${bgColor} rounded-full overflow-hidden`}>
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default DailyDashboard;
