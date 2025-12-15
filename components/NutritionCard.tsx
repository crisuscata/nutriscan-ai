import React from 'react';
import { NutritionalResponse } from '../types';
import MacroChart from './MacroChart';
import { RefreshCcw, Info, Droplet, Zap, Activity, Flame } from 'lucide-react';

interface NutritionCardProps {
  data: NutritionalResponse;
  onReset: () => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ data, onReset }) => {
  const totals = data?.analisis_total || {
    calorias_totales_kcal: 0,
    proteinas_g: 0,
    carbohidratos_g: 0,
    grasas_g: 0
  };

  const componentes = data?.detalle_componentes || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">

      {/* Main Analysis Card */}
      <div className="glass-panel rounded-3xl shadow-premium p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 leading-tight tracking-tight">
              {data.nombre_plato_estimado || "Plato Detectado"}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                <Info className="w-3 h-3 mr-1" />
                Análisis AI
              </span>
              <span className="text-secondary-400 text-xs">Confianza Alta</span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-secondary-200 hover:border-primary-500 text-secondary-600 hover:text-primary-600 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Nuevo Análisis</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Chart Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-secondary-50 rounded-full blur-2xl opacity-50 transform scale-90" />
            <MacroChart totals={totals} />
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <StatItem
              label="Proteínas"
              value={`${totals.proteinas_g}g`}
              icon={<Activity className="w-4 h-4 text-primary-500" />}
              colorClass="text-primary-600"
              bgColorClass="bg-primary-50"
            />
            <StatItem
              label="Carbohidratos"
              value={`${totals.carbohidratos_g}g`}
              icon={<Zap className="w-4 h-4 text-amber-400" />}
              colorClass="text-amber-500"
              bgColorClass="bg-amber-50"
            />
            <StatItem
              label="Grasas"
              value={`${totals.grasas_g}g`}
              icon={<Droplet className="w-4 h-4 text-slate-400" />}
              colorClass="text-slate-500"
              bgColorClass="bg-slate-100"
            />
            <StatItem
              label="Calorías"
              value={`${totals.calorias_totales_kcal}`}
              icon={<Flame className="w-4 h-4 text-rose-400" />}
              colorClass="text-rose-500"
              bgColorClass="bg-rose-50"
              subValue="kcal"
            />
          </div>
        </div>
      </div>

      {/* Components Breakdown */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 overflow-hidden">
        <div className="p-6 border-b border-secondary-100/50">
          <h3 className="text-lg font-bold text-secondary-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary-500 rounded-full" />
            Desglose de Ingredientes
          </h3>
        </div>
        <div className="divide-y divide-secondary-100/50">
          {componentes.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-white/80 transition-colors group">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-semibold text-secondary-900 text-lg group-hover:text-primary-700 transition-colors">{item.alimento}</h4>
                  <p className="text-secondary-400 text-sm mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-200" />
                    {item.cantidad_estimada}
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Proteína</div>
                    <div className="font-medium text-secondary-700">{item.macros_g?.proteina || 0}g</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-1">Carbs</div>
                    <div className="font-medium text-secondary-700">{item.macros_g?.carbohidrato || 0}g</div>
                  </div>
                  <div className="text-right pl-6 border-l border-secondary-100">
                    <div className="font-bold text-xl text-secondary-900 tabular-nums">{item.calorias_kcal}</div>
                    <div className="text-[10px] text-secondary-400 font-bold uppercase tracking-wider">kcal</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-secondary-400 max-w-2xl mx-auto py-4 opacity-60">
        {data.aviso_precision}
      </p>
    </div>
  );
};

const StatItem = ({ label, value, icon, colorClass, bgColorClass, subValue }: any) => (
  <div className="flex flex-col p-4 rounded-2xl bg-white border border-secondary-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className={`w-8 h-8 rounded-full ${bgColorClass} flex items-center justify-center mb-3`}>
      {icon}
    </div>
    <span className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
    <div className={`text-2xl font-bold ${colorClass} tracking-tight`}>
      {value}
      {subValue && <span className="text-sm text-secondary-400 font-normal ml-1">{subValue}</span>}
    </div>
  </div>
);

export default NutritionCard;