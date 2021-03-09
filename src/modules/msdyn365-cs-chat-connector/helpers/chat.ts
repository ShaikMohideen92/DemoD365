import { IRequestContextUser } from '@msdyn365-commerce/core-internal/dist/types/interfaces/context/IRequestContext';
import { IChatContext, IWindow } from '../interfaces';
import { IMsdyn365CsChatConnectorViewProps } from '../msdyn365-cs-chat-connector';
import { ProactiveTriggers } from '../proactive';

/**
 *
 * Chat class - generates chat context, and checks for proactive triggers, starts the chat
 */
class Chat {
    public props: IMsdyn365CsChatConnectorViewProps;
    private user: IRequestContextUser;
    constructor(props: IMsdyn365CsChatConnectorViewProps) {
        this.props = props;
        this.user = props.context.request.user;
    }
    /**
     * Generates chat context, and checks for proactive triggers, starts the chat
     */
    public async run(): Promise<void> {
        try {
            const chatContext = this._getContext();
            if (!this._proactiveCheck(chatContext)) {
                // if chat is not activated => context wasn't set
                (<IWindow><unknown>window).contextProvider = () => { return chatContext; };
                window.addEventListener('lcw:ready', () => {
                    (<IWindow><unknown>window).Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider((<IWindow><unknown>window).contextProvider);
                });
            }
        } catch (e) {
            // Use ?debug=true to see telemetry
            // If previous block fails, chat will still be available (no need to display any errors to user)
            this.props.telemetry.exception(e);
        }
    }

    /**
     * Generates default chat context
     */
    private _getContext(): IChatContext {
        return { // eCommerceCust...
            eCommerceCustAccountNumber: {
                value: this.user.customerAccountNumber ? this.user.customerAccountNumber : this.props.config.anonymousUserName,
                isDisplayable: true
            },
            eCommerceCustEmail: {
                value: this.user.emailAddress ? this.user.emailAddress : '',
                isDisplayable: true
            },
            Email: {
                value: this.user.emailAddress ? this.user.emailAddress : '',
                isDisplayable: true
            },
            eCommerceCustFirstName: {
                value: this.user.firstName ? this.user.firstName : '',
                isDisplayable: true
            },
            eCommerceCustLastName: {
                value: this.user.lastName ? this.user.lastName : '',
                isDisplayable: true
            },
            Name: {
                value: this.user.name ? this.user.name : '',
                isDisplayable: true
            },
            eCommerceCustFullName: {
                value: this.user.name ? this.user.name : '',
                isDisplayable: true
            },
            eCommerceCustPageURL: {
                value: window.location.href,
                isDisplayable: true
            },
            eCommerceCustChatType: {
                value: 'cs', // Customer Service
                isDisplayable: true
            }
        };
    }

    /**
     * Validates proactive triggers to check if proactive chat should be initialized
     * @param chatContext IChatContext
     */
    private async _proactiveCheck(chatContext: IChatContext): Promise<boolean> {
        let isChatStarted = false;
        if (this.props.config.proactiveChatEnabled) {
            for (let i = 0; i < ProactiveTriggers.length; i++) {
                const proactive = new ProactiveTriggers[i](this.props, chatContext);
                // Only first detected proactive trigger gets executed
                if (await proactive.startChat()) { isChatStarted = true; break; }
            }
        }
        return isChatStarted;
    }
}

export default Chat;