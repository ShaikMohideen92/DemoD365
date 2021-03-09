import { ProactiveChatNames } from '../../helpers/consts';
import { IChatContext, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * DateRangeTrigger class - proactive chat is triggered if current date is in preset date boundaries (config.proactiveOnDateRangeStart, config.proactiveOnDateRangeEnd)
 */
class DateRangeTrigger extends ProactiveChatTrigger {
    private start?: Date;
    private end?: Date;

    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        this.start = this._toDate(this.props.config.proactiveOnDateRangeStart);
        this.end = this._toDate(this.props.config.proactiveOnDateRangeEnd);
    }

    public async validate(): Promise<boolean> {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (this.start) {
            if (this.end) {
                return this.start.getTime() <= now.getTime()
                    && now.getTime() <= this.end.getTime();
            } else {
                return this.start.getTime() <= now.getTime();
            }
        } else {
            if (this.end) {
                return now.getTime() <= this.end.getTime();
            } else {
                return false;
            }
        }
    }

    public getContextProvider(): TContextProvider {
        return () => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: 'True',
                eCommerceCustProactiveType: ProactiveChatNames.DateRange,
                eCommerceCustProactiveFromDate: this.start ? this.start.toUTCString() : '',
                eCommerceCustProactiveToDate: this.end ? this.end.toUTCString() : ''
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnDateRangeMessage || this.props.config.proactiveDefaultMessage;
    }

    /**
     * Converts string(us-en) to date
     * @param date string (mm/dd/yyyy)
     * @returns Date or undefined
     */
    private _toDate(date?: string): Date | undefined {
        if (date) {
            const dateParts = date.split('/');
            return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        } else {
            return undefined;
        }
    }
}

export default DateRangeTrigger;