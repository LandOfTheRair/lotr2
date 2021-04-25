
import { DamageClass, ICharacter } from '../../../../../../interfaces';
import { SpellCommand } from '../../../../../../models/macro';

export class ShredTenPercent extends SpellCommand {

  override aliases = ['shredtenpercent'];
  override requiresLearn = true;

  override canUse(caster: ICharacter, target: ICharacter): boolean {
    return this.game.directionHelper.distFrom(caster, target) <= this.range(caster)
        && target.hp.current > target.hp.maximum * 0.4
        && !this.game.effectHelper.hasEffect(target, 'Dangerous');
  }

  override use(executor: ICharacter, target: ICharacter) {
    if (this.game.characterHelper.isPlayer(executor)) return;

    const damage = Math.floor(target.hp.maximum / 10);

    this.game.combatHelper.dealDamage(executor, target, {
      damage,
      damageClass: DamageClass.Sonic,
      attackerDamageMessage: 'You shredded the flesh of %0!',
      defenderDamageMessage: '%0 shreds your flesh!'
    });
  }
}
