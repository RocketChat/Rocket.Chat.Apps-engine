import { IUIActionButtonDescriptor } from '../../definition/ui';

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

  public getAppActionButtons(appId: string) {
      return this.registeredActionButtons.get(appId);
  }

  public getAllActionButtons() {
      return this.registeredActionButtons;
  }
}
