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
      <div className="h-64 w-full flex items-center justify-center text-secondary-400 font-medium">
        No data available
      </div>
    );
  }

  const data = [
    { name: 'Proteínas', value: parseValue(totals.proteinas_g), fill: '#38A172' }, // Primary-500
    { name: 'Carbohidratos', value: parseValue(totals.carbohidratos_g), fill: '#FBBF24' }, // Amber-400
    { name: 'Grasas', value: parseValue(totals.grasas_g), fill: '#94A3B8' }, // Slate-400
  ];

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={85}
            paddingAngle={6}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}g`, '']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#18181B' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', color: '#71717A' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-4">
        <span className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest block mb-0.5">Total</span>
        <div className="text-2xl font-bold text-secondary-800 tracking-tight">{totals.calorias_totales_kcal}</div>
        <div className="text-[10px] text-secondary-400 font-bold uppercase tracking-widest">kcal</div>
      </div>
    </div>
  );
};

export default MacroChart;