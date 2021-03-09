import { IChatContext, IProactiveChatTrigger, IWindow, TContextProvider } from '../../interfaces';
import { IMsdyn365CsChatConnectorViewProps } from '../../msdyn365-cs-chat-connector';

/**
 * ProactiveChatTrigger class - checks if Proactive Chat should be triggered, starts the chat and sets context
 */
abstract class ProactiveChatTrigger implements IProactiveChatTrigger {
    public props: IMsdyn365CsChatConnectorViewProps;
    public context: IChatContext;
    constructor(props: IMsdyn365CsChatConnectorViewProps, context: IChatContext) {
        this.props = props;
        this.context = context;
    }

    /**
     * Triggers the Proactive Chat if proactive chat vlaidation passes
     * @returns boolean - TRUE if Proactive Chat is triggered
     */
    public async startChat(): Promise<boolean> {
        if (await this.validate()) {
            (<IWindow><unknown>window).contextProvider = this.getContext();

            window.addEventListener('lcw:ready', () => {
                (<IWindow><unknown>window).Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider((<IWindow><unknown>window).contextProvider);
                const message = this.getMessage();
                (<IWindow><unknown>window).Microsoft.Omnichannel.LiveChatWidget.SDK.startProactiveChat({ message: message }, false);
            });

            return true;
        } else {
            return false;
        }
    }

    /**
     * Generates Chat Context with included properties related to Proactive Chat
     * @returns TContextProvider - Chat Context
     */
    public abstract getContext(): TContextProvider;

    /**
     * Generates chat welcome message to be used if Proactive Chat is triggered
     * @returns string - chat welcome message
     */
    public abstract getMessage(): string;

    /**
     * Validate specific trigger conditions if Proactive Chat should be initiated
     * @returns boolean (TRUE if Proactive Chat should be triggered)
     */
    public abstract async validate(): Promise<boolean>;
}

export default ProactiveChatTrigger;