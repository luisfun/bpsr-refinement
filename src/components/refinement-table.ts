export type RefinementData = {
  readonly level: number
  readonly star: number
  readonly craft: number
  readonly success: number
}

export const weaponRefinementTable = [
  //{ level: 11, star: 4, craft: 60, success: 0.8 },
  { level: 12, star: 4, craft: 60, success: 0.75 },
  { level: 13, star: 4, craft: 70, success: 0.7 },
  { level: 14, star: 6, craft: 70, success: 0.65 },
  { level: 15, star: 8, craft: 80, success: 0.6 },
  { level: 16, star: 8, craft: 80, success: 0.55 },
  { level: 17, star: 8, craft: 80, success: 0.5 },
  { level: 18, star: 10, craft: 100, success: 0.5 },
  { level: 19, star: 12, craft: 100, success: 0.45 },
  { level: 20, star: 16, craft: 120, success: 0.45 },
] as const satisfies readonly RefinementData[]

export const gearRefinementTable = [
  //{ level: 11, star: 4, craft: 30, success: 0.8 },
  { level: 12, star: 4, craft: 30, success: 0.75 },
  { level: 13, star: 4, craft: 35, success: 0.7 },
  { level: 14, star: 6, craft: 35, success: 0.65 },
  { level: 15, star: 8, craft: 40, success: 0.6 },
  { level: 16, star: 8, craft: 40, success: 0.55 },
  { level: 17, star: 8, craft: 40, success: 0.5 },
  { level: 18, star: 10, craft: 50, success: 0.5 },
  { level: 19, star: 12, craft: 50, success: 0.45 },
  { level: 20, star: 16, craft: 60, success: 0.45 },
] as const satisfies readonly RefinementData[]
