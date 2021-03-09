/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IWindow } from '../pva-chat-connector/interfaces';
import Chat from './components/Chat';
import { IPvaChatConnectorViewProps } from './pva-chat-connector';

export default (props: IPvaChatConnectorViewProps) => {
    // Only for CDN loading check, won't be needed with npm package of Botframework-WebChat
    const [loaded, setLoaded] = React.useState(false);
    const p = {
        ...props
    };

    // Just to verify that CDN Chat Widget js lib is loaded
    // Remove this block if moving to npm package of Botframework-WebChat
    const interval = setInterval(
        () => {
            const t = typeof window;
            if (t !== 'undefined' && (window as unknown as IWindow) && (window as unknown as IWindow).WebChat) {
                setLoaded(true);
                clearInterval(interval);
            }
        },
        100);

    return (
        <div className='row'>
            {loaded && (<Chat {...p} />)}
        </div>
    );
};
