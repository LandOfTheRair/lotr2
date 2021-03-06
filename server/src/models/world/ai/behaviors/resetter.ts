import { Parser } from 'muud';

import { Game } from '../../../../helpers';
import {
  distanceFrom, GameServerResponse, IAIBehavior, IDialogChatAction,
  INPC, IResetterBehavior, ItemSlot } from '../../../../interfaces';

export class ResetterBehavior implements IAIBehavior {

  init(game: Game, npc: INPC, parser: Parser, behavior: IResetterBehavior) {

    parser.addCommand('hello')
      .setSyntax(['hello'])
      .setLogic(async ({ env }) => {
        const player = env?.player;
        if (!player) return 'You do not exist.';

        if (distanceFrom(player, npc) > 0) return 'Closer move.';

        const message = `Greetings, ${player.name}! Can RESET weapons! Back to brand new.
        Irreversible. All upgrades gone.`;

        const formattedChat: IDialogChatAction = {
          message,
          displayTitle: npc.name,
          displayNPCName: npc.name,
          displayNPCSprite: npc.sprite,
          displayNPCUUID: npc.uuid,
          options: [
            { text: 'Reset my item', action: 'reset' },
            { text: 'Leave', action: 'noop' },
          ]
        };

        game.transmissionHelper.sendResponseToAccount(player.username, GameServerResponse.DialogChat, formattedChat);

        return message;
      });

    parser.addCommand('reset')
      .setSyntax(['reset'])
      .setLogic(async ({ env }) => {
        const player = env?.player;
        if (!player) return 'You do not exist.';

        if (distanceFrom(player, npc) > 0) return 'Closer move.';

        const message = 'Are you sure? YES?';

        const formattedChat: IDialogChatAction = {
          message,
          displayTitle: npc.name,
          displayNPCName: npc.name,
          displayNPCSprite: npc.sprite,
          displayNPCUUID: npc.uuid,
          options: [
            { text: 'Yes, reset my item', action: 'yes' },
            { text: 'Leave', action: 'noop' },
          ]
        };

        game.transmissionHelper.sendResponseToAccount(player.username, GameServerResponse.DialogChat, formattedChat);

        return message;
      });

    parser.addCommand('yes')
      .setSyntax(['yes'])
      .setLogic(async ({ env }) => {
        const player = env?.player;
        if (!player) return 'You do not exist.';

        if (distanceFrom(player, npc) > 0) return 'Closer move.';

        const item = player.items.equipment[ItemSlot.RightHand];
        if (!item) return 'Not holding anything!';
        if (!game.itemHelper.isOwnedBy(player, item)) return 'Not yours!';

        item.mods.upgrades = [];

        game.characterHelper.recalculateEverything(player);

        return 'Done!';
      });
  }

  tick() {}
}
