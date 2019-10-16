
import { Inject, Singleton } from 'typescript-ioc';

import { Database } from './Database';
import { Logger } from './Logger';

import { ProfanityHelper } from '../chat/ProfanityHelper';
import { ContentManager, ItemCreator, NPCCreator, WorldManager } from '../data';
import { CharacterRoller, LobbyManager } from '../lobby';
import { AccountDB, CharacterDB, WorldDB } from './db';

@Singleton
export class Game {
  @Inject public logger: Logger;
  @Inject public contentManager: ContentManager;

  @Inject public db: Database;

  @Inject public accountDB: AccountDB;
  @Inject public characterDB: CharacterDB;
  @Inject public worldDB: WorldDB;

  @Inject public profanityHelper: ProfanityHelper;

  @Inject public lobbyManager: LobbyManager;
  @Inject public characterRoller: CharacterRoller;
  @Inject public itemCreator: ItemCreator;
  @Inject public npcCreator: NPCCreator;

  @Inject public worldManager: WorldManager;

  public async init() {

    const initOrder = [
      'logger',
      'contentManager',
      'db', 'worldDB', 'characterDB', 'accountDB',
      'profanityHelper',
      'lobbyManager',
      'characterRoller',
      'itemCreator', 'npcCreator',
      'worldManager'
  ];

    for (const i of initOrder) {
      this.logger.log('Game', `Initializing ${i}...`);
      await this[i].init();
    }

    this.loop();
  }

  public loop() {
    // setTimeout(() => this.loop(), 100);
  }
}
