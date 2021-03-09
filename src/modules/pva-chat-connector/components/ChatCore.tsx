// import ReactWebChat, { createDirectLine } from 'botframework-webchat'; // Use this one for npm WebChat
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { getChatStyleOptions } from '../helpers/StyleComposers';
import { IChatCoreProps, IWindow } from '../interfaces';

/**
 * Just a core Chat component
 * @param props
 */
const ChatCore: FunctionComponent<IChatCoreProps> = (props: IChatCoreProps) => {
    if (window && (window as unknown as IWindow) && (window as unknown as IWindow).WebChat) {
        const { ReactWebChat } = (window as unknown as IWindow).WebChat; // for CDN version only
        const token = props.token;
        const directLine = useMemo(
            () => {
                return (window as unknown as IWindow).WebChat.createDirectLine({ token }); // CDN
                // return createDirectLine({ token });  // npm
            },
            [token]
        );

        useEffect(
            () => {
                props.onFetchToken();
            },
            [props.onFetchToken]
        );

        const styleOptions = getChatStyleOptions(props.config);

        return props.token !== '' ? (
            <ReactWebChat
                directLine={directLine}
                userID={props.userId}
                styleOptions={styleOptions}
                store={props.store}
            />)
            : (<p>Please wait while we are connecting.</p>);
    } else {
        return <></>;
    }
};

export default ChatCore;