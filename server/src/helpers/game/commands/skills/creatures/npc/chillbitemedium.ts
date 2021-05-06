

import { DamageClass, distanceFrom, ICharacter, Stat } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class ChillBiteMedium extends SpellCommand {

  override aliases = ['chillbitemedium'];
  override requiresLearn = true;

  override canUse(caster: ICharacter, target: ICharacter): boolean {
    return distanceFrom(caster, target) === 0
        && !this.game.effectHelper.hasEffect(target, 'Frosted')
        && !this.game.effectHelper.hasEffect(target, 'RecentlyFrosted');
  }

  override use(executor: ICharacter, target: ICharacter) {
    if (this.game.characterHelper.isPlayer(executor)) return;

    const damage = this.game.diceRollerHelper.diceRoll(4, this.game.characterHelper.getStat(executor, Stat.STR));

    this.game.combatHelper.magicalAttack(executor, target, {
      damage,
      damageClass: DamageClass.Ice,
      atkMsg: 'You sunk cold fangs into %0!',
      defMsg: '%0 sunk cold fangs into you!'
    });
  }
}
