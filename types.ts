export interface Macros {
  proteina: number;
  carbohidrato: number;
  grasa: number;
}

export interface DetalleComponente {
  alimento: string;
  cantidad_estimada: string;
  calorias_kcal: number;
  macros_g: Macros;
}

export interface AnalisisTotal {
  calorias_totales_kcal: number;
  proteinas_g: number;
  carbohidratos_g: number;
  grasas_g: number;
}

export interface NutritionalResponse {
  nombre_plato_estimado: string;
  analisis_total: AnalisisTotal;
  detalle_componentes: DetalleComponente[];
  aviso_precision: string;
}

export interface DailyLogEntry {
  id: string;
  name: string;
  timestamp: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: 'scan' | 'manual';
  imageUrl?: string;
}
