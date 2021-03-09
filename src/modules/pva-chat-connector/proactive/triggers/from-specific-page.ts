import { ProactiveChatNames } from '../../helpers/consts';
import { TContextProvider } from '../../interfaces';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * FromSpecificPageTrigger class - proactive chat is triggered if user has come from specific page (the one listed in config.proactiveOnFromSpecificPageList)
 */
class FromSpecificPageTrigger extends ProactiveChatTrigger {
    public async validate(): Promise<boolean> {
        let isValid = false;
        if (this.props.config.proactiveOnFromSpecificPageList) {
            for (let i = 0; i < (this.props.config.proactiveOnFromSpecificPageList?.length || 0); i++) {
                if (window.document.referrer.indexOf(this.props.config.proactiveOnFromSpecificPageList[i].trim()) > -1) {
                    isValid = true;
                    break;
                }
            }
        }
        return isValid;
    }
    public getContextProvider(): TContextProvider {
        return () => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: 'True',
                eCommerceCustProactiveType: ProactiveChatNames.FromSpecificPage,
                eCommerceCustProactiveCameFromPage: window.document.referrer
            };
        };
    }
    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnFromSpecificPageMessage || this.props.config.proactiveDefaultMessage;
    }
}

export default FromSpecificPageTrigger;