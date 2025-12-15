import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalisisTotal } from '../types';

interface MacroChartProps {
  totals: AnalisisTotal;
}

const MacroChart: React.FC<MacroChartProps> = ({ totals }) => {
  const parseValue = (val: string | number | undefined) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
  };

  if (!totals) {
    return (
        <div className="h-64 w-full flex items-center justify-center text-slate-400">
            No data available
        </div>
    );
  }

  const data = [
    { name: 'Proteínas', value: parseValue(totals.proteinas_g), fill: '#10B981' }, // Emerald 500
    { name: 'Carbohidratos', value: parseValue(totals.carbohidratos_g), fill: '#3B82F6' }, // Blue 500
    { name: 'Grasas', value: parseValue(totals.grasas_g), fill: '#F59E0B' }, // Amber 500
  ];

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}g`, '']}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-4">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</span>
        <div className="text-xl font-bold text-slate-800">{totals.calorias_totales_kcal}</div>
        <div className="text-xs text-slate-400">kcal</div>
      </div>
    </div>
  );
};

export default MacroChart;