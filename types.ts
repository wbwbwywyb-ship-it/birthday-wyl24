
export enum AppPhase {
  CAKE = 'cake',
  BLOOMING = 'blooming',
  NEBULA = 'nebula',
  COLLAPSING = 'collapsing'
}

export interface PhotoData {
  id: string;
  url: string;
  aspectRatio: number;
}

export type GestureType = 'Open_Palm' | 'Closed_Fist' | 'None';
