import { ICharacter, IStatusEffect, Stat } from '../../../../interfaces';
import { Effect } from '../../../../models';

export class PermanentCHA extends Effect {

  override apply(char: ICharacter, effect: IStatusEffect) {

    const max = this.game.configManager.MAX_POTION_STAT[effect.effectInfo.tier as string] ?? 13;
    if (this.game.characterHelper.getBaseStat(char, Stat.CHA) >= max) {
      return this.sendMessage(char, { message: 'The fluid was tasteless.' });
    }

    this.game.characterHelper.gainPermanentStat(char, Stat.CHA, effect.effectInfo.potency);
    this.sendMessage(char, { message: 'You feel like you look better!' });
  }

}
