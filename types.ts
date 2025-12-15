export interface Macros {
  proteina: string | number;
  carbohidrato: string | number;
  grasa: string | number;
}

export interface DetalleComponente {
  alimento: string;
  cantidad_estimada: string;
  calorias_kcal: string | number;
  macros_g: Macros;
}

export interface AnalisisTotal {
  calorias_totales_kcal: string | number;
  proteinas_g: string | number;
  carbohidratos_g: string | number;
  grasas_g: string | number;
}

export interface NutritionalResponse {
  nombre_plato_estimado: string;
  analisis_total: AnalisisTotal;
  detalle_componentes: DetalleComponente[];
  aviso_precision: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}
