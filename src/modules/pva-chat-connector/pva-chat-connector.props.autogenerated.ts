/**
 * Copyright (c) 2018 Microsoft Corporation
 * IPvaChatConnector contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IPvaChatConnectorConfig extends Msdyn365.IModuleConfig {
    botTokenAPILoginURL?: string;
    botTokenAPIUsername?: string;
    botTokenAPIPassword?: string;
    botTokenAPIClientID?: string;
    botTokenAPIClientSecret?: string;
    botTokenAPIGetBotTokenURL?: string;
    botFrameworkCDNURL: string;
    botframeworkDirectlineTokenURL: string;
    tokenSecret?: string;
    powervaDirectlineTokenURL: string;
    botID?: string;
    tenantID?: string;
    position: string;
    chatHeight?: string;
    chatWidth?: string;
    chatButtonHeader?: string;
    chatButtonText?: string;
    chatHeaderText?: string;
    chatHeaderHeight?: string;
    chatBorderColor?: string;
    chatBorderStyle?: string;
    chatBorderWidth?: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    headerBackgroundColor?: string;
    headerBackgroundImageURL?: string;
    headerTextColor?: string;
    storeLogoURL?: string;
    storeLogoBackgroundColor?: string;
    startChatButtonBackgroundColor?: string;
    startChatButtonTextColor?: string;
    startChatButtonBorderColor?: string;
    startChatButtonBorderRadius?: string;
    startChatButtonBorderStyle?: string;
    startChatButtonBorderWidth?: string;
    primaryFont?: string;
    backgroundColor?: string;
    bubbleBackground?: string;
    bubbleTextColor?: string;
    bubbleBorderColor?: string;
    bubbleBorderRadius?: string;
    bubbleBorderStyle?: string;
    bubbleBorderWidth?: string;
    bubbleFromUserBackground?: string;
    bubbleFromUserTextColor?: string;
    bubbleFromUserBorderColor?: string;
    bubbleFromUserBorderRadius?: string;
    bubbleFromUserBorderStyle?: string;
    bubbleFromUserBorderWidth?: string;
    avatarBorderRadius?: string;
    avatarSize?: string;
    botAvatarBackgroundColor?: string;
    botAvatarImage?: string;
    botAvatarInitials?: string;
    userAvatarBackgroundColor?: string;
    userAvatarImage?: string;
    userAvatarInitials?: string;
    suggestedActionLayout?: string;
    suggestedActionBackground?: string;
    suggestedActionTextColor?: string;
    suggestedActionBorderColor?: string;
    suggestedActionBorderRadius?: string;
    suggestedActionBorderStyle?: string;
    suggestedActionBorderWidth?: string;
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
    proactiveOnCartAmounMin?: number;
    proactiveOnCartAmountMax?: number;
    proactiveOnCartAmountMessage?: string;
    proactiveOnCartNoOfItemsMin?: number;
    proactiveOnCartNoOfItemsMax?: number;
    proactiveOnCartNoOfItemsMessage?: string;
    anonymousUserName: string;
    unableToLoadChatMessage: string;
    proactiveOnCartSpecificProductList?: string[];
    proactiveOnCartSpecificProductMessage?: string;
    proactiveTriggerQuery?: string;
}

export interface IPvaChatConnectorResources {
    resourceKey: string;
}

export interface IPvaChatConnectorProps<T> extends Msdyn365.IModule<T> {
    resources: IPvaChatConnectorResources;
    config: IPvaChatConnectorConfig;
}
