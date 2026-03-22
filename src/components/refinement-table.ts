export type RefinementData =
  | {
      readonly level: number
      readonly star2: number
      readonly craft: number
      readonly success: number
    }
  | {
      readonly level: number
      readonly star3: number
      readonly craft: number
      readonly success: number
    }

export const weaponRefinementTable = [
  //{ level: 11, star: 4, craft: 60, success: 0.8 },
  //{ level: 12, star: 4, craft: 60, success: 0.75 },
  { level: 13, star2: 4, craft: 70, success: 0.7 },
  { level: 14, star2: 6, craft: 70, success: 0.65 },
  { level: 15, star2: 8, craft: 80, success: 0.6 },
  { level: 16, star2: 8, craft: 80, success: 0.55 },
  { level: 17, star2: 8, craft: 80, success: 0.5 },
  { level: 18, star2: 10, craft: 100, success: 0.5 },
  { level: 19, star2: 12, craft: 100, success: 0.45 },
  { level: 20, star2: 16, craft: 120, success: 0.45 },
  { level: 21, star3: 4, craft: 120, success: 0.45 },
  { level: 22, star3: 4, craft: 120, success: 0.45 },
  { level: 23, star3: 6, craft: 120, success: 0.45 },
  { level: 24, star3: 6, craft: 120, success: 0.45 },
  { level: 25, star3: 8, craft: 120, success: 0.45 },
  { level: 26, star3: 8, craft: 120, success: 0.45 },
  { level: 27, star3: 10, craft: 120, success: 0.45 },
  { level: 28, star3: 12, craft: 120, success: 0.45 },
  { level: 29, star3: 14, craft: 120, success: 0.45 },
  { level: 30, star3: 16, craft: 120, success: 0.45 },
] as const satisfies readonly RefinementData[]

export const gearRefinementTable = [
  //{ level: 11, star: 2, craft: 30, success: 0.8 },
  //{ level: 12, star: 2, craft: 30, success: 0.75 },
  { level: 13, star2: 2, craft: 35, success: 0.7 },
  { level: 14, star2: 3, craft: 35, success: 0.65 },
  { level: 15, star2: 4, craft: 40, success: 0.6 },
  { level: 16, star2: 4, craft: 40, success: 0.55 },
  { level: 17, star2: 4, craft: 40, success: 0.5 },
  { level: 18, star2: 5, craft: 50, success: 0.5 },
  { level: 19, star2: 6, craft: 50, success: 0.45 },
  { level: 20, star2: 8, craft: 60, success: 0.45 },
  { level: 21, star3: 2, craft: 60, success: 0.45 },
  { level: 22, star3: 2, craft: 60, success: 0.45 },
  { level: 23, star3: 3, craft: 60, success: 0.45 },
  { level: 24, star3: 3, craft: 60, success: 0.45 },
  { level: 25, star3: 4, craft: 60, success: 0.45 },
  { level: 26, star3: 4, craft: 60, success: 0.45 },
  { level: 27, star3: 5, craft: 60, success: 0.45 },
  { level: 28, star3: 6, craft: 60, success: 0.45 },
  { level: 29, star3: 7, craft: 60, success: 0.45 },
  { level: 30, star3: 8, craft: 60, success: 0.45 },
] as const satisfies readonly RefinementData[]
