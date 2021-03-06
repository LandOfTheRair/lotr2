import { ICharacter, IMacroCommandArgs, IPlayer } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class Revive extends SpellCommand {

  override aliases = ['revive', 'cast revive'];
  override requiresLearn = true;
  override targetsFriendly = true;
  override canTargetSelf = true;
  override spellRef = 'Revive';

  override canUse(caster: ICharacter, target: ICharacter): boolean {
    return false;
  }

  override execute(player: IPlayer, args: IMacroCommandArgs) {
    args.stringArgs = player.name;
    super.execute(player, args);
  }
}
