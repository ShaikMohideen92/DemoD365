import { IRequestContextUser } from '@msdyn365-commerce/core-internal/dist/types/interfaces/context/IRequestContext';
import { ProactiveTriggers } from '../proactive';
import ProactiveChatTrigger from '../proactive/triggers/proactive-chat-trigger';
import { IPvaChatConnectorViewProps } from '../pva-chat-connector';
import { IChatContext, IProactiveData, TContextProvider } from './../interfaces';

/**
 *
 * ContextProvider class - generates chat context, and checks for proactive triggers
 */
class ContextProvider {
    public data: IProactiveData;
    public props: IPvaChatConnectorViewProps;
    private user: IRequestContextUser;
    private context: IChatContext;
    private provider: TContextProvider | undefined;

    constructor(props: IPvaChatConnectorViewProps) {
        this.props = props;
        this.user = this.props.context.request.user;
        this.context = this._getContext();
        // Proactive Chat related data
        this.data = {
            enabled: false,
            timeout: this.props.config.proactiveOnWaitTimeSeconds || 0,
            message: this.props.config.proactiveDefaultMessage
        };
    }

    /**
     * Executes Proactive Chat validation
     * @returns TContextProvider - a function returning IChatContext object
     */
    public async init(): Promise<TContextProvider> {
        try {
            await this._proactiveCheck();
        } catch (e) {
            // Use ?debug=true to see telemetry
            // If previous block fails, chat will still be available (no need to display any errors to user)
            this.props.telemetry.exception(e);
        }
        return this.provider || this._getProvider();
    }

    /**
     * Returns TContextProvider - a function returning IChatContext object
     */
    private _getProvider(): TContextProvider {
        return () => {
            return <IChatContext>{ // eCommerceCust...
                eCommerceCustAccountNumber: this.user.customerAccountNumber ? this.user.customerAccountNumber : 'N/A',
                eCommerceCustEmail: this.user.emailAddress ? this.user.emailAddress : 'N/A',
                eCommerceCustFirstName: this.user.firstName ? this.user.firstName : this.props.config.anonymousUserName,
                eCommerceCustLastName: this.user.lastName ? this.user.lastName : 'N/A',
                eCommerceCustFullName: this.user.name ? this.user.name : this.props.config.anonymousUserName,
                eCommerceCustPageURL: window.location.href,
                eCommerceCustChatType: 'pva',
                // Proactive chat
                eCommerceCustIsProactiveChat: 'False',
                eCommerceCustProactiveType: 'N/A',
                // Date Range
                eCommerceCustProactiveFromDate: 'N/A',
                eCommerceCustProactiveToDate: 'N/A',
                // From Specific Page
                eCommerceCustProactiveCameFromPage: 'N/A',
                // No. Page Visits
                eCommerceCustProactiveNumberOfVisits: 'N/A',
                // Specific Geography
                eCommerceCustProactiveCountryCode: 'N/A',
                // Specific Page => eCommerceCustPageURL
                // eCommerceCustProactiveSpecificPage: 'N/A',
                // Wait On Time
                eCommerceCustProactiveTimeOnPage: 'N/A',
                // Shopping cart amount
                eCommerceCustProactiveShoppingCartAmount: 'N/A',
                // Shopping cart number of items
                eCommerceCustProactiveShoppingCartNumberOfItems: 'N/A',
                // Shopping cart specific product
                eCommerceCustProactiveShoppingCartSpecificProduct: 'N/A'
            };
        };
    }

    /**
     * Returns default IChatContext object
     */
    private _getContext(): IChatContext {
        return this._getProvider()();
    }

    /**
     * Validates proactive triggers to check if proactive chat should be initialized
     */
    private async _proactiveCheck(): Promise<void> {
        if (this.props.config.proactiveChatEnabled) {
            for (let i = 0; i < ProactiveTriggers.length; i++) {
                const proactive = new ProactiveTriggers[i](this.props, this.context);
                // Only first detected proactive trigger gets executed
                if (await this._isProactive(proactive)) { break; }
            }
        }
    }

    /**
     * Validates if proactive chat should be triggered for given ProactiveTrigger
     * @param proactive ProactiveChatTrigger
     * @returns boolean
     */
    private async _isProactive(proactive: ProactiveChatTrigger): Promise<boolean> {
        this.data.enabled = await proactive.validate();
        if (this.data.enabled) {
            this.provider = proactive.getContextProvider();
            this.data.message = proactive.getMessage();
        }
        return this.data.enabled;
    }
}

export default ContextProvider;