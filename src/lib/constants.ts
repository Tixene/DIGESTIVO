export const MEAL_LABELS: Record<string, string> = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  cena: 'Cena',
  snacks: 'Snacks',
};

export const MEAL_ORDER = ['desayuno', 'almuerzo', 'cena', 'snacks'] as const;

export const BRISTOL_INFO: { type: number; label: string; desc: string }[] = [
  { type: 1, label: 'Tipo 1', desc: 'Grumos duros separados (estreñimiento severo)' },
  { type: 2, label: 'Tipo 2', desc: 'Forma de salchicha pero grumosa (estreñimiento)' },
  { type: 3, label: 'Tipo 3', desc: 'Salchicha con grietas en la superficie' },
  { type: 4, label: 'Tipo 4', desc: 'Salchicha o serpiente lisa y suave (ideal)' },
  { type: 5, label: 'Tipo 5', desc: 'Blobs suaves con bordes definidos (falta fibra)' },
  { type: 6, label: 'Tipo 6', desc: 'Piezas esponjosas con bordes irregulares (diarrea leve)' },
  { type: 7, label: 'Tipo 7', desc: 'Acuoso, sin piezas sólidas (diarrea severa)' },
];

export interface FodmapFood {
  name: string;
  category: string;
  level: 'low' | 'moderate' | 'high';
  note: string;
}

export const FODMAP_FOODS: FodmapFood[] = [
  // Lácteos
  { name: 'Leche de vaca', category: 'Lácteos', level: 'high', note: 'Contiene lactosa; alta fermentación.' },
  { name: 'Yogur natural', category: 'Lácteos', level: 'moderate', note: 'Algo de lactosa residual.' },
  { name: 'Queso curado', category: 'Lácteos', level: 'low', note: 'Bajo en lactosa por fermentación.' },
  { name: 'Leche de almendras', category: 'Lácteos', level: 'low', note: 'Sin lactosa, apta.' },
  { name: 'Helado de leche', category: 'Lácteos', level: 'high', note: 'Alta lactosa y azúcar.' },
  // Frutas
  { name: 'Manzana', category: 'Frutas', level: 'high', note: 'Alta en fructanos y sorbitol.' },
  { name: 'Banana madura', category: 'Frutas', level: 'low', note: 'Baja en FODMAPs cuando está madura.' },
  { name: 'Banana verde', category: 'Frutas', level: 'moderate', note: 'Mayor contenido de fructanos.' },
  { name: 'Sandía', category: 'Frutas', level: 'high', note: 'Alta en fructosa.' },
  { name: 'Frutillas', category: 'Frutas', level: 'low', note: 'Apta, baja en FODMAPs.' },
  { name: 'Palta', category: 'Frutas', level: 'low', note: 'Baja en FODMAPs (porción pequeña).' },
  { name: 'Durazno', category: 'Frutas', level: 'high', note: 'Alto en sorbitol.' },
  { name: 'Kiwi', category: 'Frutas', level: 'low', note: 'Apto en porciones moderadas.' },
  { name: 'Pera', category: 'Frutas', level: 'high', note: 'Alta en sorbitol y fructosa.' },
  { name: 'Arándanos', category: 'Frutas', level: 'low', note: 'Aptos en porción pequeña.' },
  { name: 'Ciruela', category: 'Frutas', level: 'high', note: 'Alta en sorbitol, muy fermentable.' },
  { name: 'Uva', category: 'Frutas', level: 'low', note: 'Apta en porciones moderadas.' },
  // Vegetales
  { name: 'Cebolla', category: 'Vegetales', level: 'high', note: 'Alta en fructanos, muy gatillante.' },
  { name: 'Ajo', category: 'Vegetales', level: 'high', note: 'Alto en fructanos. Usar aceite infusionado.' },
  { name: 'Brócoli', category: 'Vegetales', level: 'moderate', note: 'Moderado en fructanos; vigilar porción.' },
  { name: 'Zanahoria', category: 'Vegetales', level: 'low', note: 'Apta, baja en FODMAPs.' },
  { name: 'Espinaca', category: 'Vegetales', level: 'low', note: 'Apta, muy baja en FODMAPs.' },
  { name: 'Tomate', category: 'Vegetales', level: 'low', note: 'Apto en porciones moderadas.' },
  { name: 'Pimiento', category: 'Vegetales', level: 'low', note: 'Apto (rojo o verde).' },
  { name: 'Coliflor', category: 'Vegetales', level: 'moderate', note: 'Moderado; controlar porción.' },
  { name: 'Champiñones', category: 'Vegetales', level: 'low', note: 'Aptos (no pleurotus).' },
  { name: 'Papa', category: 'Vegetales', level: 'low', note: 'Apta, sin FODMAPs relevantes.' },
  { name: 'Betarraga', category: 'Vegetales', level: 'moderate', note: 'Moderado en fructanos.' },
  { name: 'Apio', category: 'Vegetales', level: 'moderate', note: 'Moderado en manitol.' },
  { name: 'Espárragos', category: 'Vegetales', level: 'high', note: 'Altos en fructanos.' },
  { name: 'Lechuga', category: 'Vegetales', level: 'low', note: 'Apta, muy baja en FODMAPs.' },
  { name: 'Pepino', category: 'Vegetales', level: 'low', note: 'Apto en porciones moderadas.' },
  // Legumbres
  { name: 'Lentejas', category: 'Legumbres', level: 'moderate', note: 'Moderado en galactanos (enlatadas mejor).' },
  { name: 'Garbanzos', category: 'Legumbres', level: 'moderate', note: 'Moderado; enlatados y escurridos.' },
  { name: 'Porotos negros', category: 'Legumbres', level: 'high', note: 'Altos en galactanos.' },
  // Cereales
  { name: 'Pan de trigo', category: 'Cereales', level: 'high', note: 'Alto en fructanos.' },
  { name: 'Pan de masa madre', category: 'Cereales', level: 'moderate', note: 'Fermentación reduce fructanos.' },
  { name: 'Arroz', category: 'Cereales', level: 'low', note: 'Apto, sin FODMAPs.' },
  { name: 'Quinoa', category: 'Cereales', level: 'low', note: 'Apta, buena alternativa.' },
  { name: 'Avena', category: 'Cereales', level: 'low', note: 'Apta en porción moderada.' },
  { name: 'Pasta de trigo', category: 'Cereales', level: 'high', note: 'Alta en fructanos.' },
  { name: 'Fideos de arroz', category: 'Cereales', level: 'low', note: 'Aptos, sin gluten ni fructanos.' },
  { name: 'Galletas de trigo', category: 'Cereales', level: 'high', note: 'Altas en fructanos.' },
  // Endulzantes
  { name: 'Miel', category: 'Endulzantes', level: 'high', note: 'Alta en fructosa.' },
  { name: 'Azúcar común', category: 'Endulzantes', level: 'low', note: 'Apta en cantidades moderadas.' },
  { name: 'Stevia', category: 'Endulzantes', level: 'low', note: 'Apta, no fermentable.' },
  { name: 'Xilitol', category: 'Endulzantes', level: 'moderate', note: 'Polialcohol; vigilar tolerancia.' },
  { name: 'Sorbitol', category: 'Endulzantes', level: 'high', note: 'Polialcohol muy fermentable.' },
  { name: 'Jarabe de maíz', category: 'Endulzantes', level: 'high', note: 'Alto en fructosa.' },
  // Proteínas
  { name: 'Pollo', category: 'Proteínas', level: 'low', note: 'Apto, sin FODMAPs.' },
  { name: 'Pescado', category: 'Proteínas', level: 'low', note: 'Apto, sin FODMAPs.' },
  { name: 'Huevo', category: 'Proteínas', level: 'low', note: 'Apto, sin FODMAPs.' },
  { name: 'Tofu', category: 'Proteínas', level: 'low', note: 'Apto (firme), sin FODMAPs.' },
  { name: 'Carne roja', category: 'Proteínas', level: 'low', note: 'Apta, sin FODMAPs.' },
  // Bebidas
  { name: 'Café', category: 'Bebidas', level: 'low', note: 'Bajo en FODMAP; vigilar acidez.' },
  { name: 'Té de manzanilla', category: 'Bebidas', level: 'low', note: 'Apto, calmante digestivo.' },
  { name: 'Té de menta', category: 'Bebidas', level: 'low', note: 'Apto, alivia la distensión.' },
  { name: 'Cerveza', category: 'Bebidas', level: 'moderate', note: 'Moderado en fructanos.' },
  { name: 'Jugo de manzana', category: 'Bebidas', level: 'high', note: 'Alto en sorbitol y fructosa.' },
  { name: 'Vino tinto', category: 'Bebidas', level: 'low', note: 'Bajo en FODMAP (copa).' },
  // Frutos secos
  { name: 'Almendras', category: 'Frutos secos', level: 'low', note: 'Aptas (máx ~10 unidades).' },
  { name: 'Nueces', category: 'Frutos secos', level: 'low', note: 'Aptas (porción pequeña).' },
  { name: 'Maní', category: 'Frutos secos', level: 'low', note: 'Apto en porciones moderadas.' },
  { name: 'Avellanas', category: 'Frutos secos', level: 'low', note: 'Aptas en porción pequeña.' },
  { name: 'Pistachos', category: 'Frutos secos', level: 'moderate', note: 'Moderados en fructanos.' },
  { name: 'Castañas de cajú', category: 'Frutos secos', level: 'high', note: 'Altas en fructanos.' },
];

export const FODMAP_LEVELS = {
  low: { label: 'Apto', color: 'bg-sage-100 text-sage-700 border-sage-300', dot: 'bg-sage-500', text: 'text-sage-600' },
  moderate: { label: 'Moderado', color: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-400', text: 'text-amber-600' },
  high: { label: 'Prohibido', color: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500', text: 'text-red-600' },
} as const;
