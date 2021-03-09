import { ICookieContext } from '@msdyn365-commerce/core-internal/dist/types/interfaces/context/ICookieContext';
import { ProactiveChatNames } from '../../helpers/consts';
import { IChatContext, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * PageVisitTrigger class - proactive chat is triggered if user has visited current page for (config.proactiveOnPageVisitNumber) or more times
 */
class PageVisitTrigger extends ProactiveChatTrigger {
    public visits: number = 0;
    private cookieName: string = 'TimesPageVisited';
    private expdate: Date;
    private cookies: ICookieContext;

    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        this.cookies = this.props.context.request.cookies;
        this.expdate = new Date();
        this.expdate.setTime(this.expdate.getTime() + (24 * 60 * 60 * 1000 * 365));

        if (this.cookies.isConsentGiven()) {
            this.cookies.setConsentCookie();
        }

        this._updateVisitCounter();
    }

    public async validate(): Promise<boolean> {
        if (this.props.config.proactiveOnPageVisitNumber) {
            return this.visits >= this.props.config.proactiveOnPageVisitNumber;
        } else {
            return false;
        }
    }

    public clear(): void {
        this.cookies.set<number>(
            this.cookieName,
            0,
            {
                domain: window.location.hostname,
                path: window.location.pathname,
                expires: this.expdate
            });
    }

    public getContextProvider(): TContextProvider {
        return () => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: 'True',
                eCommerceCustProactiveType: ProactiveChatNames.PageVisits,
                eCommerceCustProactiveNumberOfVisits: `${this.visits}`
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnPageVisitMessage || this.props.config.proactiveDefaultMessage;
    }

    private _updateVisitCounter(): void {
        this.visits = this.cookies.get<number>(this.cookieName).value || 0;

        ++this.visits;

        this.cookies.set<number>(
            this.cookieName,
            this.visits,
            {
                domain: window.location.hostname,
                path: window.location.pathname,
                expires: this.expdate
            });
    }
}

export default PageVisitTrigger;