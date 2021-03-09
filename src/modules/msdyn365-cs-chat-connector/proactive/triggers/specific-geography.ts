import { ProactiveChatNames } from '../../helpers/consts';
import { IChatContext, IExtendedRequest, ISpecificGeographyTriggerContext, TContextProvider } from '../../interfaces';
import { IMsdyn365CsChatConnectorViewProps } from '../../msdyn365-cs-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * SpecificPageTrigger class - proactive chat is triggered if user geogrphically belongs to the list of country codes(config.proactiveOnSpecificGeographyCountry)
 */
class SpecificGeographyTrigger extends ProactiveChatTrigger {
    private customerCountryCode: string;
    constructor(props: IMsdyn365CsChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        this.customerCountryCode = (<IExtendedRequest>this.props.context.request).suggestedMarket || 'n/a';
    }

    public async validate(): Promise<boolean> {
        return this.props.config.proactiveOnSpecificGeographyCountry
            ? this.props.config.proactiveOnSpecificGeographyCountry.indexOf(this.customerCountryCode) > -1
            : false;
    }
    public getContext(): TContextProvider {
        return (): ISpecificGeographyTriggerContext => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: {
                    value: 'True',
                    isDisplayable: true
                },
                eCommerceCustCountryCode: {
                    value: this.props.config.proactiveOnSpecificGeographyCountry || '',
                    isDisplayable: true
                },
                eCommerceCustProactiveType: {
                    value: ProactiveChatNames.SpecificGeography,
                    isDisplayable: true
                }
            };
        };
    }
    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnSpecificGeographyMessage || this.props.config.proactiveDefaultMessage;
    }
}

export default SpecificGeographyTrigger;