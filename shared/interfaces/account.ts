import { IAccountPremium } from './accountpremium';

export interface IAccount {
  username: string;
  password?: string;
  originalEmail: string;
  email: string;

  verificationCode?: string;
  emailVerified: boolean;

  players: any;

  isGameMaster: boolean;
  isTester: boolean;

  isMuted: boolean;
  isBanned: boolean;

  discordTag: string;
  alwaysOnline: boolean;
  eventWatcher: boolean;

  premium: IAccountPremium;
}
