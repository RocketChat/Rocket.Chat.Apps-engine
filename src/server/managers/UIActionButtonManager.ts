import { RoomType } from '../../definition/rooms/RoomType';

export enum ActionButtonContext {
  MESSAGE_ACTION = 'messageAction',
  ROOM_ACTION = 'roomAction',
  MESSAGE_BOX_ACTION = 'messageBoxAction',
  SIDEBAR_ITEM = 'sidebarItem',
}

export interface IUIActionButtonDescriptor {
  actionId: string;
  nameI18n: string;
  hintI18n: string;
  context: ActionButtonContext;
  // Suggestions for possible icons?
  icon?: string;
  when?: {
    roomTypes?: Array<RoomType>;
    // How do we provide suggestions for permissions?
    hasOnePermission?: Array<string>;
    hasAllPermissions?: Array<string>;
    // How do we provide suggestions for roles?
    hasOneRole?: Array<string>;
    hasAllRoles?: Array<string>;
  };
}

export class UIActionButtonManager {
  private registeredActionButtons = new Map<string, Map<string, IUIActionButtonDescriptor>>();

  public registerActionButton(appId: string, button: IUIActionButtonDescriptor) {
    if (!this.registeredActionButtons.has(appId)) {
      this.registeredActionButtons.set(appId, new Map());
    }

    this.registeredActionButtons.get(appId).set(button.actionId, button);
  }

  public clearAppActionButtons(appId: string) {
    this.registeredActionButtons.set(appId, new Map());
  }
}
