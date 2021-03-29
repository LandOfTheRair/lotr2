
import { ICharacter } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class Leash extends SpellCommand {

  aliases = ['leash'];
  requiresLearn = true;

  canUse() {
    return true;
  }

  use(executor: ICharacter) {
    if (this.game.characterHelper.isPlayer(executor)) return;

    const state = this.game.worldManager.getMap(executor.map).state;
    const spawner = state.getNPCSpawner(executor.uuid);
    if (!spawner) return;

    spawner?.getNPCAI(executor.uuid).sendLeashMessage();

    const oldX = executor.x;
    const oldY = executor.y;

    executor.x = spawner.pos.x;
    executor.y = spawner.pos.y;

    state.moveNPCOrPlayer(executor, { oldX, oldY });
  }
}