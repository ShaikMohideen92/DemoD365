// Use this import with npm package (instead CDN)
// import { createStore } from 'botframework-webchat';
import React, { Dispatch, SetStateAction } from 'react';
import { IAction, IDispatch, INext, IWindow, TContextProvider } from '../interfaces';
import { IPvaChatConnectorViewProps } from '../pva-chat-connector';

/**
 * Handles custom chat actions
 * @param param0 {
 *      props: IPvaChatConnectorViewProps;
 *      dispatch: IDispatch;
 *      next: INext;
 *      action: IAction;
 *      setNewMessage: Dispatch<SetStateAction<boolean>>;
 *      provider: TContextProvider;
 *  }
 */
const actionHandler = (
    { props, dispatch, next, action, setNewMessage, provider }: {
        props: IPvaChatConnectorViewProps;
        dispatch: IDispatch;
        next: INext;
        action: IAction;
        setNewMessage: Dispatch<SetStateAction<boolean>>;
        provider: TContextProvider;
    }): IDispatch => {
    const atype = action.type;

    switch (atype) {
        case 'DIRECT_LINE/CONNECT_FULFILLED':
            {
                // sets language
                dispatch({
                    type: 'WEB_CHAT/SEND_EVENT',
                    payload: {
                        name: 'webchat/join',
                        value: { language: window.navigator.language }
                    }
                });
            }
            break;
        case 'DIRECT_LINE/INCOMING_ACTIVITY':
            {
                // Sets flag for new message (will be use to indicate new messages from bot when chat is minimized)
                if (action.payload.activity.from.role === 'bot') {
                    setNewMessage(true);
                }
            }
            break;
        case 'DIRECT_LINE/POST_ACTIVITY_FULFILLED':
            {
                switch (action.payload.activity.name) {
                    case 'webchat/join':
                        {
                            // Sets Chat Context
                            dispatch({
                                type: 'WEB_CHAT/SEND_EVENT',
                                payload: {
                                    name: 'pvaSetContext',
                                    value: provider()
                                },
                            });
                        }
                        break;
                    case 'pvaSetContext':
                        {
                            // Initialize chat after Chat Context is set
                            dispatch({
                                type: 'WEB_CHAT/SEND_MESSAGE_BACK',
                                payload: {
                                    text: 'Hi',
                                }
                            });
                        }
                        break;
                    default:
                        {
                            // default nothing
                        }
                }
            }
            break;
        default:
            {
                // console.log('ACTION: ', action);
            }
    }

    return next(action);
};

/**
 * Gets conversation token
 * @param props IPvaChatConnectorViewProps
 */
export const getToken = async (props: IPvaChatConnectorViewProps): Promise<string> => {
    // Use cutom API (with OAuth2) to obtain conversation token
    if ((props.config.botTokenAPILoginURL || props.context.app.config.pvaChatConnectorBotTokenAPILoginURL) &&
        (props.config.botTokenAPIGetBotTokenURL || props.context.app.config.pvaChatConnectorBotTokenAPIGetBotTokenURL)) {
        let url: string = props.config.botTokenAPILoginURL || props.context.app.config.pvaChatConnectorBotTokenAPILoginURL;
        let headers = new Headers();
        const hash = btoa(`${props.config.botTokenAPIClientID || props.context.app.config.pvaChatConnectorBotTokenAPIClientID}:${props.config.botTokenAPIClientSecret || props.context.app.config.pvaChatConnectorBotTokenAPIClientSecret}`);
        headers.append('Authorization', `Basic ${hash}`);
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        const urlencoded = new URLSearchParams();
        urlencoded.append('grant_type', 'password');
        urlencoded.append('username', props.config.botTokenAPIUsername || props.context.app.config.pvaChatConnectorBotTokenAPIUsername);
        urlencoded.append('password', props.config.botTokenAPIPassword || props.context.app.config.pvaChatConnectorBotTokenAPIPassword);

        let options: RequestInit = {
            method: 'POST',
            headers: headers,
            body: urlencoded,
            redirect: <RequestRedirect>'follow'
        };
        return fetch(url, options)
            .then(r => r.json())
            .then(r => {
                if (r.accessToken) {
                    url = props.config.botTokenAPIGetBotTokenURL || props.context.app.config.pvaChatConnectorBotTokenAPIGetBotTokenURL;
                    headers = new Headers();
                    headers.append('Authorization', `Bearer ${r.accessToken}`);

                    options = {
                        method: 'GET',
                        headers: headers,
                        redirect: <RequestRedirect>'follow'
                    };

                    return fetch(url, options)
                        .then(response => response.json())
                        .then(result => {
                            if (result.token) { return result.token; } else { throw result; }
                        });
                } else {
                    throw r;
                }
            });
    } else if (props.config.tokenSecret) { // use token secret and direct token url from module config to obtain conversation token
        const url = props.config.botframeworkDirectlineTokenURL || props.context.app.config.pvaChatConnectorBotframeworkDirectlineTokenURL;
        const options = {
            method: 'POST',
            headers: [['Authorization', `Bearer ${props.config.tokenSecret || props.context.app.config.pvaChatConnectorTokenSecret}`]]
        };
        return fetch(url, options)
            .then(r => r.json())
            .then(r => {
                if (r.token) { return r.token; } else { throw r; }
            });
    } else if (props.config.powervaDirectlineTokenURL && props.config.botID && props.config.tenantID) { // use direct line token url, bot id and tenant id from module config to get conversation token
        const url = `${props.config.powervaDirectlineTokenURL}?botId=${props.config.botID}&tenantId=${props.config.tenantID}`;
        const options = { method: 'GET' };
        return fetch(url, options)
            .then(r => r.json())
            .then(r => {
                if (r.token) { return r.token; } else { throw r; }
            });
    } else if (props.context.app.config.pvaChatConnectorTokenSecret) {// use token secret and direct token url from app config to obtain conversation token
        const url = props.context.app.config.pvaChatConnectorBotframeworkDirectlineTokenURL;
        const options = {
            method: 'POST',
            headers: [['Authorization', `Bearer ${props.context.app.config.pvaChatConnectorTokenSecret}`]]
        };
        return fetch(url, options)
            .then(r => r.json())
            .then(r => {
                if (r.token) { return r.token; } else { throw r; }
            });
    } else {// use direct line token url, bot id and tenant id from app config to get conversation token
        const url = `${props.context.app.config.pvaChatConnectorPowervaDirectlineTokenURL}?botId=${props.context.app.config.pvaChatConnectorBotID}&tenantId=${props.context.app.config.pvaChatConnectorTenantID}`;
        const options = {
            method: 'GET'
        };
        return fetch(url, options)
            .then(r => r.json())
            .then(r => {
                if (r.token) { return r.token; } else { throw r; }
            });
    }
};

/**
 * Creates store for WebChat
 * @param props IPvaChatConnectorViewProps
 * @param setNewMessage React.Dispatch<React.SetStateAction<boolean>>
 * @param provider TContextProvider
 */
export const getStore = (props: IPvaChatConnectorViewProps, setNewMessage: React.Dispatch<React.SetStateAction<boolean>>, provider: TContextProvider) => {
    try {
        // CDN version:
        const ReactWebChat = (<IWindow><unknown>window).WebChat;
        return ReactWebChat ? ReactWebChat.createStore({}, ({ dispatch }: { dispatch: IDispatch }) => (next: (action: IAction) => IDispatch) => (action: IAction) => {
            actionHandler({ props, dispatch, next, action, setNewMessage, provider });
        }) : null;

        // Npm version below:
        // return createStore({}, ({ dispatch }: { dispatch: IDispatch }) => (next: (action: IAction) => IDispatch) => (action: IAction) => {
        //     actionHandler({ props, dispatch, next, action, setNewMessage, provider });
        // });
    } catch (e) {
        props.telemetry.exception(e);
    }
};