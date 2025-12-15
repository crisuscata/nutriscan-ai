import React from 'react';
import { NutritionalResponse } from '../types';
import MacroChart from './MacroChart';
import { ChevronRight, Info } from 'lucide-react';

interface NutritionCardProps {
  data: NutritionalResponse;
  onReset: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data, onReset }) => {
  // Defensive checks to ensure data exists before rendering
  const totals = data?.analisis_total || {
    calorias_totales_kcal: 0,
    proteinas_g: 0,
    carbohidratos_g: 0,
    grasas_g: 0
  };
  
  const componentes = data?.detalle_componentes || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {data.nombre_plato_estimado || "Plato Analizado"}
            </h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Estimación basada en análisis visual
            </p>
          </div>
          <button 
            onClick={onReset}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors text-sm"
          >
            Analizar otro plato
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Chart Section */}
          <div className="bg-slate-50 rounded-2xl p-4">
             <MacroChart totals={totals} />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <span className="block text-emerald-600 text-sm font-semibold mb-1">Proteínas</span>
              <span className="text-2xl font-bold text-emerald-900">{totals.proteinas_g}g</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="block text-blue-600 text-sm font-semibold mb-1">Carbohidratos</span>
              <span className="text-2xl font-bold text-blue-900">{totals.carbohidratos_g}g</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <span className="block text-amber-600 text-sm font-semibold mb-1">Grasas</span>
              <span className="text-2xl font-bold text-amber-900">{totals.grasas_g}g</span>
            </div>
             <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <span className="block text-rose-600 text-sm font-semibold mb-1">Calorías</span>
              <span className="text-2xl font-bold text-rose-900">{totals.calorias_totales_kcal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Components Breakdown */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Desglose de Componentes</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {componentes.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">{item.alimento}</h4>
                  <p className="text-slate-500 text-sm mt-1">
                    Cantidad estimada: <span className="font-medium text-slate-700">{item.cantidad_estimada}</span>
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{item.calorias_kcal} kcal</div>
                    <div className="text-xs text-slate-400 mt-1 flex gap-2">
                      <span className="text-emerald-600">P: {item.macros_g?.proteina || 0}g</span>
                      <span className="text-blue-600">C: {item.macros_g?.carbohidrato || 0}g</span>
                      <span className="text-amber-600">G: {item.macros_g?.grasa || 0}g</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto">
        {data.aviso_precision}
      </p>
    </div>
  );
};

export default NutritionCard;