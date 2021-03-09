import { ProactiveChatNames } from '../../helpers/consts';
import { IChatContext, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * WaitOnTimeTrigger - proactive chat is triggered if user stays on current page for more than (config.proactiveOnWaitTimeSeconds) seconds
 */
class WaitOnTimeTrigger extends ProactiveChatTrigger {
    private waitTimeInMilliseconds: number | undefined;

    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        if (this.props.config.proactiveOnWaitTimeSeconds &&
            !isNaN(this.props.config.proactiveOnWaitTimeSeconds)) {
            this.waitTimeInMilliseconds = Number(this.props.config.proactiveOnWaitTimeSeconds) * 1000;
        }
    }

    public async validate(): Promise<boolean> {
        return this.waitTimeInMilliseconds !== undefined;
    }

    public getContextProvider(): TContextProvider {
        const triggerTime = Date.now() + (this.waitTimeInMilliseconds || 0);
        return () => {
            return triggerTime > Date.now()
                ? this.context
                : {
                    ...this.context,
                    eCommerceCustIsProactiveChat: 'True',
                    eCommerceCustProactiveType: ProactiveChatNames.WaitOnTime,
                    eCommerceCustProactiveTimeOnPage: `${this.waitTimeInMilliseconds ? this.waitTimeInMilliseconds : 0}`
                };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnWaitTimeMessage || this.props.config.proactiveDefaultMessage;
    }
}

export default WaitOnTimeTrigger;