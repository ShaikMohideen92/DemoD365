/**
 * MSDYN 365 CS Chat Connector Interfaces
 */
import { IRequestContext } from '@msdyn365-commerce/core-internal/dist/types/interfaces/context/IRequestContext';
import { IMsdyn365CsChatConnectorViewProps } from '../msdyn365-cs-chat-connector';

export interface IChatContextValue {
    value: string | number | boolean;
    isDisplayable: boolean;
}

export interface IWindow extends Window {
    // tslint:disable-next-line:no-any
    Microsoft: any;
    contextProvider: TContextProvider;
 }

type voidfunction = () => void;
export interface ICoBrowser {
    // tslint:disable-next-line:no-any
    q: any[];
    init: voidfunction;
}

export interface IChatData {
    'data-app-id': string | undefined;
    'data-org-id': string | undefined;
    'data-org-url': string | undefined;
    'data-hide-chat-button'?: boolean | undefined;
    'data-color-override'?: string | undefined;
    'data-font-family-override'?: string | undefined;
}

export interface IChatContext {
    eCommerceCustAccountNumber: IChatContextValue;
    eCommerceCustEmail: IChatContextValue;
    eCommerceCustFirstName: IChatContextValue;
    eCommerceCustLastName: IChatContextValue;
    eCommerceCustFullName: IChatContextValue;
    eCommerceCustPageURL: IChatContextValue;
    eCommerceCustChatType: IChatContextValue;
    Email: IChatContextValue;
    Name: IChatContextValue;
}

export interface IProactiveContext extends IChatContext {
    eCommerceCustIsProactiveChat: IChatContextValue;
    eCommerceCustProactiveType: IChatContextValue;
}

export type TContextProvider = () => IChatContext;

export interface IProactiveChatTrigger {
    props: IMsdyn365CsChatConnectorViewProps;
    context: IChatContext;
    getContext(timeInSeconds: number): TContextProvider;
    getMessage(message: string): string;
}

export interface IDateRangeContext extends IProactiveContext {
    eCommerceCustProactiveFromDate: IChatContextValue;
    eCommerceCustProactiveToDate: IChatContextValue;
}

export interface IFromSpecificPageTriggerContext extends IProactiveContext {
    eCommerceCustProactiveCameFromPage: IChatContextValue;
}

export interface IPageVisitContext extends IProactiveContext {
    eCommerceCustProactiveNumberOfVisits: IChatContextValue;
}

export interface ISpecificGeographyTriggerContext extends IProactiveContext {
    eCommerceCustCountryCode: IChatContextValue;
}

export interface IWaitOnTimeContext extends IProactiveContext {
    eCommerceCustProactiveTimeOnPage: IChatContextValue;
}

export interface ICartAmountContext extends IProactiveContext {
    eCommerceCustProactiveShoppingCartAmount: IChatContextValue;
}

export interface ICartNumberOfItemsContext extends IProactiveContext {
    eCommerceCustProactiveShoppingCartNumberOfItems: IChatContextValue;
}

export interface ICartSpecificProductContext extends IProactiveContext {
    eCommerceCustProactiveShoppingCartSpecificProduct: IChatContextValue;
}

export interface IExtendedRequest extends IRequestContext {
    suggestedMarket: string;
}
