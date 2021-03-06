
import { GameServerResponse, IDialogChatAction, IMacroCommandArgs, IPlayer } from '../../../../../interfaces';
import { MacroCommand } from '../../../../../models/macro';

export class ForgetCommand extends MacroCommand {

  override aliases = ['forget'];

  override execute(player: IPlayer, args: IMacroCommandArgs) {

    if (!this.game.characterHelper.hasLearned(player, 'Teleport')) {
      this.sendMessage(player, 'You do not have the ability to teleport!');
      return;
    }

    if (!args.stringArgs) {
      this.sendMessage(player, 'You need to specify the location you wish to forget!');

      const formattedChat: IDialogChatAction = {
        message: 'Forget which location?',
        displayTitle: 'Teleport Forget',
        options: [
          { text: 'None', action: 'noop' },
          ...Object.keys(player.teleportLocations || {}).map(x => ({ text: x, action: `forget ${x}` }))
        ]
      };

      this.game.transmissionHelper.sendResponseToAccount(player.username, GameServerResponse.DialogChat, formattedChat);

      return;
    }

    const didForget = this.game.teleportHelper.forgetLocation(player, args.stringArgs);
    if (!didForget) return;

    this.sendMessage(player, 'The detailed memory of that location slips from your mind.');
  }

}
