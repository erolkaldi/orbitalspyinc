export type MissionData = {
  id: string;
  country: string;
  flag: string;
  title: string;
  reward: number;
  tier: number;
  urgent: boolean;
  latitude: number;
  longitude: number;
}

export type SatelliteData = {
  id: string;
  name: string;
  tier: number;
  status: string;
  launchPad: string;
  orbitOffset: number;
  inclination: number;
  orbitType: string;
}