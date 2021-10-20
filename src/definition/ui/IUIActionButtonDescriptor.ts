import { RoomType } from '../rooms/RoomType';
import { UIActionButtonContext } from './UIActionButtonContext';

export interface IUIActionButtonDescriptor {
  actionId: string;
  nameI18n: string;
  hintI18n: string;
  context: UIActionButtonContext;
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
