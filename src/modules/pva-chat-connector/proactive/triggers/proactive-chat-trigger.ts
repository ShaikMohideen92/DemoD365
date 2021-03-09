import { IChatContext, IProactiveChatTrigger, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';

/**
 * ProactiveChatTrigger class - checks if Proactive Chat should be triggered, starts the chat and sets context
 */
abstract class ProactiveChatTrigger implements IProactiveChatTrigger {
    public props: IPvaChatConnectorViewProps;
    public context: IChatContext;
    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        this.props = props;
        this.context = context;
    }

    /**
     * Generates Chat Context with included properties related to Proactive Chat
     * @returns TContextProvider - Chat Context
     */
    public abstract getContextProvider(): TContextProvider;

    /**
     * Generates chat welcome message to be used if Proactive Chat is triggered
     * @returns string - chat welcome message
     */
    public abstract getMessage(): string;

    /**
     * Validate specific trigger conditions if Proactive Chat should be initiated
     * @returns boolean (TRUE if Proactive Chat should be triggered)
     */
    public async abstract validate(): Promise<boolean>;
}

export default ProactiveChatTrigger;