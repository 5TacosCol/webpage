export const SALSAS = [
  { name: 'Cilantro Jalapeño', heat: 1 },
  { name: 'Limón Picante', heat: 2 },
  { name: 'Tomate Tatemado', heat: 2 },
  { name: 'Salsa Macha', description: 'maní y chile de árbol', heat: 2 },
  { name: 'Chile Fantasma', heat: 4 },
] as const

const MAX_HEAT = 5

export function heatChiles(level: number): string {
  return '🌶'.repeat(level) + '○'.repeat(MAX_HEAT - level)
}
