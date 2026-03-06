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
  type: string;
  duration: number;
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
  geoLongitude: number;
}
export type MissionAssignment = {
  id: string;
  missionId: string;
  satelliteId: string;
  userId: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  endsAt: Date | null;
}