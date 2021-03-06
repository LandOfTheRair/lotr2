import { ICharacter, IMacroCommandArgs, IPlayer, ItemClass, ItemSlot, Skill } from '../../../../../../interfaces';
import { SkillCommand } from '../../../../../../models/macro';

export class Set extends SkillCommand {

  override aliases = ['set'];
  override requiresLearn = true;

  override range(char: ICharacter) {
    return 1 + this.game.traitHelper.traitLevelValue(char, 'ThrownTraps');
  }

  override execute(player: IPlayer, args: IMacroCommandArgs) {

    const rightHand = player.items.equipment[ItemSlot.RightHand];
    if (!rightHand) return this.sendMessage(player, 'You are not holding a trap!');

    const { itemClass, trapUses, trapEffect } = this.game.itemHelper.getItemProperties(rightHand, ['itemClass', 'trapUses', 'trapEffect']);
    if (itemClass !== ItemClass.Trap) return this.sendMessage(player, 'You are not holding a trap!');

    if (!this.game.itemHelper.canGetBenefitsFromItem(player, rightHand)) return this.sendMessage(player, 'You cannot use that trap!');

    const target = this.getTarget(player, args.stringArgs, true, true);
    if (!target) return;

    if (!this.game.trapHelper.canPlaceTrap(player.map, target.x, target.y)) {
      return this.sendMessage(player, 'You cannot place a trap there!');
    }

    this.game.trapHelper.placeTrap(target.x, target.y, player, rightHand);
    rightHand.mods.trapUses = (trapUses ?? 1) - 1;

    if (rightHand.mods.trapUses <= 0) this.game.characterHelper.setRightHand(player, undefined);

    this.game.playerHelper.gainSkill(player, Skill.Thievery, 3);
    this.sendMessage(player, `You set the ${trapEffect?.name ?? 'unknown'} trap.`);

  }

}
