import { ProactiveChatNames } from '../../helpers/consts';
import { IChatContext, IExtendedRequest, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * SpecificPageTrigger class - proactive chat is triggered if user geogrphically belongs to the list of country codes(config.proactiveOnSpecificGeographyCountry)
 */
class SpecificGeographyTrigger extends ProactiveChatTrigger {
    private customerCountryCode: string;
    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        this.customerCountryCode = (<IExtendedRequest>this.props.context.request).suggestedMarket || 'n/a';
    }

    public async validate(): Promise<boolean> {
        return this.props.config.proactiveOnSpecificGeographyCountry
            ? this.props.config.proactiveOnSpecificGeographyCountry.indexOf(this.customerCountryCode) > -1
            : false;
    }
    public getContextProvider(): TContextProvider {
        return () => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: 'True',
                eCommerceCustProactiveCountryCode: this.props.config.proactiveOnSpecificGeographyCountry || '',
                eCommerceCustProactiveType: ProactiveChatNames.SpecificGeography
            };
        };
    }
    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnSpecificGeographyMessage || this.props.config.proactiveDefaultMessage;
    }
}

export default SpecificGeographyTrigger;