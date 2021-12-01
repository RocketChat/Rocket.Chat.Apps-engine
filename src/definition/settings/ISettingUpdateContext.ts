import { ISetting } from './ISetting';

export interface ISettingUpdateContext {
    oldSetting: ISetting;
    newSetting: ISetting;
}
