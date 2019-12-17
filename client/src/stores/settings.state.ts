
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { GameAction } from '../../../shared/interfaces';
import { ChatMode, ISettings } from '../models';
import { Login, Logout } from './account.state';

export class AddAccount {
  static type = '[Settings] Add account';
  constructor(public username: string, public password: string, public autologin?: boolean) {}
}

export class RemoveAccount {
  static type = '[Settings] Remove account';
  constructor(public username: string) {}
}

export class UpdateWindowPosition {
  static type = '[Settings] Update window position';
  constructor(
    public windowName: string,
    public windowProps: { x?: number, y?: number, width?: number, height?: number },
    public overwrite?: boolean
  ) {}
}

export class SetActiveWindow {
  static type = '[Settings] Set active window';
  constructor(public windowName: string) {}
}

export class SetCharSlot {
  static type = '[Settings] Set char slot';
  constructor(public charSlot: number) {}
}

export class SetAssetHash {
  static type = GameAction.SettingsSetAssetHash;
  constructor(public assetHash: string) {}
}

export class SetChatMode {
  static type = GameAction.SettingsSetChatMode;
  constructor(public chatMode: ChatMode) {}
}

export class SetCurrentCommand {
  static type = GameAction.SetCurrentCommand;
  constructor(public command: string) {}
}

const defaultSettings: () => ISettings = () => {
  return {
    accounts: [],
    windows: {},
    activeWindow: '',
    charSlot: 0,
    wasKicked: false,
    assetHash: '',
    chatMode: 'cmd',
    currentCommand: ''
  };
};

@State<ISettings>({
  name: 'settings',
  defaults: defaultSettings()
})
export class SettingsState implements NgxsOnInit {

  @Selector()
  static currentCommand(state: ISettings) {
    return state.currentCommand;
  }

  @Selector()
  static autologin(state: ISettings) {
    return state.accounts.find(acc => acc.autologin);
  }

  @Selector()
  static accounts(state: ISettings) {
    return state.accounts;
  }

  @Selector()
  static window(state: ISettings) {
    return (window: string) => state.windows[window] || {};
  }

  @Selector()
  static charSlot(state: ISettings) {
    return { slot: state.charSlot };
  }

  @Selector()
  static activeWindow(state: ISettings) {
    return state.activeWindow;
  }

  @Selector()
  static wasKicked(state: ISettings) {
    return state.wasKicked;
  }

  @Selector()
  static assetHash(state: ISettings) {
    return state.assetHash;
  }

  @Selector()
  static chatMode(state: ISettings) {
    return state.chatMode;
  }

  ngxsOnInit(ctx: StateContext<ISettings>) {
    ctx.patchState({ wasKicked: false, assetHash: '' });
  }

  @Action(SetAssetHash)
  updateHash(ctx: StateContext<ISettings>, { assetHash }: SetAssetHash) {
    ctx.patchState({ assetHash });
  }

  @Action(Login)
  login(ctx: StateContext<ISettings>) {
    ctx.patchState({ wasKicked: false });
  }

  @Action(Logout)
  logout(ctx: StateContext<ISettings>, { manualDisconnect, kick }: Logout) {
    const state = ctx.getState();

    if (!manualDisconnect) {
      ctx.patchState({ assetHash: '' });
      return;
    }

    const oldAccounts = state.accounts
      .map(x => Object.assign({}, x, { autologin: false }));

    const accounts = [...oldAccounts];
    ctx.patchState({ accounts, wasKicked: kick, assetHash: '' });
  }

  @Action(AddAccount)
  addAccount(ctx: StateContext<ISettings>, { username, password, autologin }: AddAccount) {
    const state = ctx.getState();

    const oldAccounts = state.accounts
      .filter(x => x.username !== username)
      .map(x => Object.assign({}, x, { autologin: false }));

    const accounts = [{ username, password, autologin }, ...oldAccounts];
    ctx.patchState({ accounts });
  }

  @Action(RemoveAccount)
  removeAccount(ctx: StateContext<ISettings>, { username }: RemoveAccount) {
    const state = ctx.getState();

    const accounts = [...state.accounts.filter(x => x.username !== username)];
    ctx.patchState({ accounts });
  }

  @Action(UpdateWindowPosition)
  updateWindowPos(ctx: StateContext<ISettings>, { windowName, windowProps, overwrite }: UpdateWindowPosition) {
    const state = ctx.getState();
    const windows = { ...state.windows };
    if (!windows[windowName] || overwrite) {
      windows[windowName] = Object.assign({}, windows[windowName], windowProps);
    }
    ctx.patchState({ windows });
  }

  @Action(SetActiveWindow)
  setActiveWindow(ctx: StateContext<ISettings>, { windowName }: SetActiveWindow) {
    ctx.patchState({ activeWindow: windowName });
  }

  @Action(SetCharSlot)
  setCharSlot(ctx: StateContext<ISettings>, { charSlot }: SetCharSlot) {
    ctx.patchState({ charSlot });
  }

  @Action(SetChatMode)
  setChatMode(ctx: StateContext<ISettings>, { chatMode }: SetChatMode) {
    ctx.patchState({ chatMode });
  }

  @Action(SetCurrentCommand)
  setCurrentCommand(ctx: StateContext<ISettings>, { command }: SetCurrentCommand) {
    ctx.patchState({ currentCommand: command });
  }

}
