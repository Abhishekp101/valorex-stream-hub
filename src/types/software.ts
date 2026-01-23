export type PlatformType = 'windows' | 'mac' | 'android_apps' | 'android_games' | 'pc_games';

export interface SoftwareGame {
  id: string;
  name: string;
  description: string;
  version: string;
  platform: PlatformType;
  category: string;
  icon_url: string;
  download_count: number;
  file_size: string;
  reputation: number;
  download_link: string;
  created_at: string;
  updated_at: string;
}

export const platformLabels: Record<PlatformType, string> = {
  windows: 'Windows',
  mac: 'Mac',
  android_apps: 'Android Apps',
  android_games: 'Android Games',
  pc_games: 'PC Games',
};
