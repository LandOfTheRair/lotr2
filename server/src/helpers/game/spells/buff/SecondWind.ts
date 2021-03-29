import { ICharacter, SpellCastArgs, Stat } from '../../../../interfaces';
import { Spell } from '../../../../models/world/Spell';

export class SecondWind extends Spell {

  getDuration(caster: ICharacter | null) {
    return caster ? this.game.characterHelper.getStat(caster, Stat.WIS) * 100 : 600;
  }

  cast(caster: ICharacter | null, target: ICharacter | null, spellCastArgs: SpellCastArgs): void {
  }

}