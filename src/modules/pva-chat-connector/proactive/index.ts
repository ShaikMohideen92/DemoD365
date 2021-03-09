import CartAmountTrigger from './triggers/cart-amount';
import CartNumberOfItemsTrigger from './triggers/cart-number-of-items';
import CartSpecificProductTrigger from './triggers/cart-specific-product';
import DateRangeTrigger from './triggers/date-range';
import FromSpecificPageTrigger from './triggers/from-specific-page';
import PageVisitTrigger from './triggers/page-visits';
import SpecificGeographyTrigger from './triggers/specific-geography';
import SpecificPageTrigger from './triggers/specific-page';
import WaitOnTimeTrigger from './triggers/wait-on-time';

type ProactiveChat = (typeof DateRangeTrigger |
    typeof SpecificPageTrigger |
    typeof FromSpecificPageTrigger |
    typeof PageVisitTrigger |
    typeof SpecificGeographyTrigger |
    typeof CartAmountTrigger |
    typeof CartNumberOfItemsTrigger |
    typeof CartSpecificProductTrigger |
    typeof WaitOnTimeTrigger);

/**
 * List of Proactive Chat Validators in order of validation (first proactive chat that pass validation is triggered, the rest are ommited)
 */
export const ProactiveTriggers: ProactiveChat[] = [
    DateRangeTrigger,
    SpecificPageTrigger,
    FromSpecificPageTrigger,
    PageVisitTrigger,
    SpecificGeographyTrigger,
    CartAmountTrigger,
    CartNumberOfItemsTrigger,
    CartSpecificProductTrigger,
    WaitOnTimeTrigger
];