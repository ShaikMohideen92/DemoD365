/**
 * Copyright (c) 2018 Microsoft Corporation
 * IMsdyn365CsChatConnector contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IMsdyn365CsChatConnectorConfig extends Msdyn365.IModuleConfig {
    src: string;
    dataAppId: string;
    dataOrgId: string;
    dataOrgUrl: string;
    dataHideChatButton?: boolean;
    dataColorOverride?: string;
    dataFontFamilyOverride?: string;
    proactiveChatEnabled: boolean;
    proactiveDefaultMessage: string;
    proactiveOnWaitTimeSeconds?: number;
    proactiveOnWaitTimeMessage?: string;
    proactiveOnPageVisitNumber?: number;
    proactiveOnPageVisitMessage?: string;
    proactiveOnSpecificPageList?: string[];
    proactiveOnSpecificPageMessage?: string;
    proactiveOnFromSpecificPageList?: string[];
    proactiveOnFromSpecificPageMessage?: string;
    proactiveOnSpecificGeographyCountry?: string;
    proactiveOnSpecificGeographyMessage?: string;
    proactiveOnDateRangeStart?: string;
    proactiveOnDateRangeEnd?: string;
    proactiveOnDateRangeMessage?: string;
    anonymousUserName: string;
    proactiveOnCartAmounMin?: number;
    proactiveOnCartAmountMax?: number;
    proactiveOnCartAmountMessage?: string;
    proactiveOnCartNoOfItemsMin?: number;
    proactiveOnCartNoOfItemsMax?: number;
    proactiveOnCartNoOfItemsMessage?: string;
    proactiveOnCartSpecificProductList?: string[];
    proactiveOnCartSpecificProductMessage?: string;
}

export interface IMsdyn365CsChatConnectorProps<T> extends Msdyn365.IModule<T> {
    config: IMsdyn365CsChatConnectorConfig;
}
