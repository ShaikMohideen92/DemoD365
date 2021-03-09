import { ProactiveChatNames } from '../../helpers/consts';
import { TContextProvider } from '../../interfaces';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * SpecificPageTrigger class - proactive chat is triggered if current page is listed in config.proactiveOnSpecificPageList
 */
class SpecificPageTrigger extends ProactiveChatTrigger {
    public async validate(): Promise<boolean> {
        let isValid = false;
        if (this.props.config.proactiveOnSpecificPageList) {
            for (let i = 0; i < (this.props.config.proactiveOnSpecificPageList?.length || 0); i++) {
                if (window.location.href.indexOf(this.props.config.proactiveOnSpecificPageList[i].trim()) > -1) {
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
                eCommerceCustProactiveType: ProactiveChatNames.SpecificPage
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnSpecificPageMessage || this.props.config.proactiveDefaultMessage;
    }
}

export default SpecificPageTrigger;