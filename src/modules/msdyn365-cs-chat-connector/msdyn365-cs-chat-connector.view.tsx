/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IChatData} from './interfaces';
import { IMsdyn365CsChatConnectorViewProps } from './msdyn365-cs-chat-connector';
/**
 * Returns data parameters for omnichannel chat script
 * @param props
 */
const getChatData = (props: IMsdyn365CsChatConnectorViewProps): IChatData => {
    const data: IChatData = {
        'data-app-id': props.config.dataAppId || props.context.app.config.msDyn365CsChatConnectorDataAppId,
        'data-org-id': props.config.dataOrgId || props.context.app.config.msDyn365CsChatConnectorDataOrgId,
        'data-org-url': props.config.dataOrgUrl || props.context.app.config.msDyn365CsChatConnectorDataOrgUrl
    };
    if (props.config.dataHideChatButton !== undefined) {
        data['data-hide-chat-button'] = props.config.dataHideChatButton;
    } else if (props.context.app.config.msDyn365CsChatConnectorDataHideChatButton) {
        data['data-hide-chat-button'] = props.context.app.config.msDyn365CsChatConnectorDataHideChatButton;
    }
    if (props.config.dataColorOverride) {
        data['data-color-override'] = props.config.dataColorOverride;
    } else if (props.context.app.config.msDyn365CsChatConnectorDataColorOverride) {
        data['data-color-override'] = props.context.app.config.msDyn365CsChatConnectorDataColorOverride;
    }
    if (props.config.dataFontFamilyOverride) {
        data['data-font-family-override'] = props.config.dataFontFamilyOverride;
    } else if (props.context.app.config.msDyn365CsChatConnectorDataFontFamilyOverride) {
        data['data-font-family-override'] = props.context.app.config.msDyn365CsChatConnectorDataFontFamilyOverride;
    }
    return data;
};

export default (props: IMsdyn365CsChatConnectorViewProps) => {
    const data: IChatData = getChatData(props);
    // id has to be set to Microsoft_Omnichannel_LCWidget
    return (
        <React.Fragment>
            <script
                id='Microsoft_Omnichannel_LCWidget'
                {...data}
                src={props.config.src || props.context.app.config.msDyn365CsChatConnectorSrc}
            />
        </React.Fragment>
    );
};
