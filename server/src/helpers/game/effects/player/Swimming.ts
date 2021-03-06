import { DamageClass, ICharacter, IPlayer, IStatusEffect } from '../../../../interfaces';
import { Effect } from '../../../../models';

export class Swimming extends Effect {

  override tick(char: ICharacter) {
    if ((char as IPlayer).swimElement !== DamageClass.Fire) return;
    this.game.effectHelper.removeEffectByName(char, 'Swimming');
  }

  override unapply(char: ICharacter, effect: IStatusEffect) {
    this.game.effectHelper.addEffect(char, '', 'Drowning', { effect: { duration: -1 } });
  }

}
