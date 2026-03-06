export const SLOT_PER_LEVEL = 1 // her level 1 slot

export const TIER_LIMITS = {
  1: { orbitTypes: ["LEO"], maxInclination: 30 },
  2: { orbitTypes: ["LEO", "MEO"], maxInclination: 60 },
  3: { orbitTypes: ["LEO", "MEO", "GEO"], maxInclination: 90 },
} as const

export const SHOP_PRICES = {
  newSatellite: 5000,
  upgrade: {
    1: 8000,  // Tier 1 → 2
    2: 15000, // Tier 2 → 3
  }
} as const

export const MISSION_TYPES = {
  surveillance: { label: "Gözetleme", duration: 12, rewardMultiplier: 1 },
  reconnaissance: { label: "Keşif", duration: 24, rewardMultiplier: 2 },
  intelligence: { label: "İstihbarat", duration: 48, rewardMultiplier: 3 },
  emergency: { label: "Acil", duration: 6, rewardMultiplier: 1.5 },
} as const

export type MissionType = keyof typeof MISSION_TYPES