export interface CelestialPosition {
  azimuth: number;
  elevation: number;
  distance?: number;
}

export interface SunPosition extends CelestialPosition {
  isDaytime: boolean;
  solarNoon: Date;
  sunrise: Date;
  sunset: Date;
}

export interface Star {
  name: string;
  catalogId: string;
  magnitude: number;
  rightAscension: number;
  declination: number;
  spectralType: string;
  color: string;
}

export interface StarPosition extends Star {
  azimuth: number;
  elevation: number;
  isVisible: boolean;
}

export interface MoonPosition extends CelestialPosition {
  phase: number;
  illumination: number;
  age: number;
}

export interface MagneticFieldModel {
  declination: number;
  inclination: number;
  horizontalIntensity: number;
  totalIntensity: number;
  northComponent: number;
  eastComponent: number;
  verticalComponent: number;
}

export const STAR_CATALOG: Star[] = [
  {
    name: 'Sirius',
    catalogId: 'α CMa',
    magnitude: -1.46,
    rightAscension: 6.752481,
    declination: -16.716116,
    spectralType: 'A1V',
    color: '#A0C8FF'
  },
  {
    name: 'Canopus',
    catalogId: 'α Car',
    magnitude: -0.74,
    rightAscension: 6.399194,
    declination: -52.695661,
    spectralType: 'A9II',
    color: '#F8F4FF'
  },
  {
    name: 'Arcturus',
    catalogId: 'α Boo',
    magnitude: -0.05,
    rightAscension: 14.261027,
    declination: 19.182409,
    spectralType: 'K1.5III',
    color: '#FFB347'
  },
  {
    name: 'Vega',
    catalogId: 'α Lyr',
    magnitude: 0.03,
    rightAscension: 18.615648,
    declination: 38.783689,
    spectralType: 'A0V',
    color: '#A0C8FF'
  },
  {
    name: 'Capella',
    catalogId: 'α Aur',
    magnitude: 0.08,
    rightAscension: 5.278155,
    declination: 45.997991,
    spectralType: 'G5III',
    color: '#FFF4E8'
  },
  {
    name: 'Rigel',
    catalogId: 'β Ori',
    magnitude: 0.13,
    rightAscension: 5.242298,
    declination: -8.201638,
    spectralType: 'B8Ia',
    color: '#A0D8FF'
  },
  {
    name: 'Procyon',
    catalogId: 'α CMi',
    magnitude: 0.34,
    rightAscension: 7.655033,
    declination: 5.224993,
    spectralType: 'F5IV',
    color: '#FFF8E8'
  },
  {
    name: 'Betelgeuse',
    catalogId: 'α Ori',
    magnitude: 0.50,
    rightAscension: 5.919529,
    declination: 7.407064,
    spectralType: 'M1-2Ia-Iab',
    color: '#FF6347'
  },
  {
    name: 'Altair',
    catalogId: 'α Aql',
    magnitude: 0.77,
    rightAscension: 19.846340,
    declination: 8.868321,
    spectralType: 'A7V',
    color: '#F0F0FF'
  },
  {
    name: 'Aldebaran',
    catalogId: 'α Tau',
    magnitude: 0.85,
    rightAscension: 4.598677,
    declination: 16.509302,
    spectralType: 'K5III',
    color: '#FF8C00'
  },
  {
    name: 'Polaris',
    catalogId: 'α UMi',
    magnitude: 1.98,
    rightAscension: 2.530167,
    declination: 89.264109,
    spectralType: 'F7Ib',
    color: '#FFF8DC'
  },
  {
    name: 'Deneb',
    catalogId: 'α Cyg',
    magnitude: 1.25,
    rightAscension: 20.690532,
    declination: 45.280339,
    spectralType: 'A2Ia',
    color: '#F0F8FF'
  }
];
