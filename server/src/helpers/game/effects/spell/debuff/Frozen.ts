import { ICharacter, IStatusEffect } from '../../../../../interfaces';
import { Effect } from '../../../../../models';

export class Frozen extends Effect {

  override apply(char: ICharacter, effect: IStatusEffect) {
    effect.effectInfo.isFrozen = true;
  }

}
