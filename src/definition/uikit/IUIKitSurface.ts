import type { IBlock, IButtonElement, ITextObject } from './blocks';

export enum UIKitSurfaceType {
	MODAL = 'modal',
	HOME = 'home',
	CONTEXTUAL_BAR = 'contextualBar',
}

export interface IUIKitSurface {
	appId: string;
	id: string;
	type: UIKitSurfaceType;
	title: ITextObject;
	blocks: Array<IBlock>;
	close?: IButtonElement;
	submit?: IButtonElement;
	state?: object;
	clearOnClose?: boolean;
	notifyOnClose?: boolean;
}
