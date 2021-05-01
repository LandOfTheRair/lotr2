import { Parser } from 'muud';

import { Game } from '../../../../helpers';
import { IAIBehavior, IItemModderBehavior, INPC } from '../../../../interfaces';

export class ItemModderBehavior implements IAIBehavior {

  init(game: Game, npc: INPC, parser: Parser, behavior: IItemModderBehavior) {

    parser.addCommand('hello')
      .setSyntax(['hello'])
      .setLogic(async ({ env }) => {
        const player = env?.player;
        if (!player) return 'You do not exist.';

        if (game.directionHelper.distFrom(player, npc) > 0) return 'Please come closer.';

        return 'Hello!';
      });
  }

  tick() {}
}