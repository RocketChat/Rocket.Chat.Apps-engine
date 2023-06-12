// tslint:disable:max-classes-per-file
import {
    IUIKitBaseIncomingInteraction,
    IUIKitBlockIncomingInteraction,
    IUIKitViewCloseIncomingInteraction,
    IUIKitViewSubmitIncomingInteraction,
    UIKitActionButtonIncomingInteraction,
} from './UIKitIncomingInteractionTypes';
import { UIKitInteractionResponder } from './UIKitInteractionResponder';

export abstract class UIKitInteractionContext {
    private baseContext: IUIKitBaseIncomingInteraction;
    private responder: UIKitInteractionResponder;
    constructor(baseContext: IUIKitBaseIncomingInteraction) {
        const { appId, actionId, room, user, triggerId } = baseContext;

        this.baseContext = { appId, actionId, room, user, triggerId };

        this.responder = new UIKitInteractionResponder(this.baseContext);
    }

    public getInteractionResponder() {
        return this.responder;
    }

    public abstract getInteractionData(): IUIKitBaseIncomingInteraction;
}

export class UIKitBlockInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: IUIKitBlockIncomingInteraction) {
        super(interactionData);
    }

    public getInteractionData(): IUIKitBlockIncomingInteraction {
        return this.interactionData;
    }
}

export class UIKitViewSubmitInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: IUIKitViewSubmitIncomingInteraction) {
        super(interactionData);
    }

    public getInteractionData(): IUIKitViewSubmitIncomingInteraction {
        return this.interactionData;
    }
}

export class UIKitViewCloseInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: IUIKitViewCloseIncomingInteraction) {
        super(interactionData);
    }

    public getInteractionData(): IUIKitViewCloseIncomingInteraction {
        return this.interactionData;
    }
}

export class UIKitActionButtonInteractionContext extends UIKitInteractionContext {
    constructor(private readonly interactionData: UIKitActionButtonIncomingInteraction) {
        super(interactionData);
    }

    public getInteractionData(): UIKitActionButtonIncomingInteraction {
        return this.interactionData;
    }
}
