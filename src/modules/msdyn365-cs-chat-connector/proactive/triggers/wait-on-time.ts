import { ProactiveChatNames } from '../../helpers/consts';
import { IChatContext, IWaitOnTimeContext, IWindow, TContextProvider } from '../../interfaces';
import { IMsdyn365CsChatConnectorViewProps } from '../../msdyn365-cs-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * WaitOnTimeTrigger - proactive chat is triggered if user stays on current page for more than (config.proactiveOnWaitTimeSeconds) seconds
 */
class WaitOnTimeTrigger extends ProactiveChatTrigger {
    private waitTimeInMilliseconds: number | undefined;

    constructor(props: IMsdyn365CsChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        if (this.props.config.proactiveOnWaitTimeSeconds &&
            !isNaN(this.props.config.proactiveOnWaitTimeSeconds)) {
            this.waitTimeInMilliseconds = Number(this.props.config.proactiveOnWaitTimeSeconds) * 1000;
        }
    }

    public async validate(): Promise<boolean> {
        return this.waitTimeInMilliseconds !== undefined;
    }

    public async startChat(): Promise<boolean> {
        if (await this.validate()) {
            (<IWindow><unknown>window).contextProvider = this.getContext();

            window.addEventListener('lcw:ready', () => {
                (<IWindow><unknown>window).Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider((<IWindow><unknown>window).contextProvider);
                const message = this.getMessage();
                setTimeout(
                    () => {
                        (<IWindow><unknown>window).Microsoft.Omnichannel.LiveChatWidget.SDK.startProactiveChat({ message: message }, false);
                    },
                    this.waitTimeInMilliseconds);
            });

            return true;
        } else {
            return false;
        }
    }

    public getContext(): TContextProvider {
        return (): IWaitOnTimeContext => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: {
                    value: 'True',
                    isDisplayable: true
                },
                eCommerceCustProactiveType: {
                    value: ProactiveChatNames.WaitOnTime,
                    isDisplayable: true
                },
                eCommerceCustProactiveTimeOnPage: {
                    value: this.waitTimeInMilliseconds ? this.waitTimeInMilliseconds : 0,
                    isDisplayable: true
                }
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnWaitTimeMessage || this.props.config.proactiveDefaultMessage;
    }
}

export default WaitOnTimeTrigger;