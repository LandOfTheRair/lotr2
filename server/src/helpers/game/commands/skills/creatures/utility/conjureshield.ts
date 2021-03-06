import { ICharacter, IMacroCommandArgs, IPlayer, ItemSlot } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class ConjureShield extends SpellCommand {

  override aliases = ['conjureshield', 'cast conjureshield'];
  override requiresLearn = true;
  override spellRef = 'ConjureShield';
  override canTargetSelf = true;

  override canUse(caster: ICharacter, target: ICharacter): boolean {
    return super.canUse(caster, caster) && !caster.items.equipment[ItemSlot.LeftHand];
  }

  override execute(player: IPlayer, args: IMacroCommandArgs) {
    this.castSpellAt(player, player, args);
  }

  override use(char: ICharacter) {
    this.castSpellAt(char, char);
  }

}
