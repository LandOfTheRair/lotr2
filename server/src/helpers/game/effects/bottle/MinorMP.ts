import { ICharacter, IStatusEffect, Stat } from '../../../../interfaces';
import { Effect } from '../../../../models';

export class MinorMP extends Effect {

  override apply(char: ICharacter, effect: IStatusEffect) {

    if (this.game.characterHelper.getBaseStat(char, Stat.MP) >= 300) {
      return this.sendMessage(char, { message: 'The fluid was tasteless.' });
    }

    this.game.characterHelper.gainPermanentStat(char, Stat.MP, effect.effectInfo.potency);
    this.sendMessage(char, { message: 'Your mental capacity has increased!' });
  }

}
