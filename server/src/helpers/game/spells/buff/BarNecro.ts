import { ICharacter, ISpellData, SpellCastArgs, Stat } from '../../../../interfaces';
import { Spell } from '../../../../models/world/Spell';

export class BarNecro extends Spell {

  override getDuration(caster: ICharacter | null) {
    return caster ? this.game.characterHelper.getStat(caster, Stat.INT) * 100 : 600;
  }

  public override getUnformattedTooltipDesc(caster: ICharacter | null, target: ICharacter | null, spellData: ISpellData): string {
    return 'Resisting %potency necrotic damage (as well as less poison and disease damage).';
  }

  override cast(caster: ICharacter | null, target: ICharacter | null, spellCastArgs: SpellCastArgs): void {
  }

}
