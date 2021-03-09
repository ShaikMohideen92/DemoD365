import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import ContextProvider from '../helpers/ContextProvider';
import { getChatStyling } from '../helpers/StyleComposers';
import { getStore, getToken } from '../helpers/WebChat';
import { IWindow, TContextProvider } from '../interfaces';
import { IPvaChatConnectorViewProps } from '../pva-chat-connector';
import ChatCore from './ChatCore';

const INVALID_TOKEN = 'INVALID_TOKEN';
const CLOSE_IMG_DATA = 'M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z';

/**
 * Outer chat component, displays chat button, and proactive chat, and handles custom actions
 * @param props IPvaChatConnectorViewProps
 */
const Chat: FunctionComponent<IPvaChatConnectorViewProps> = (props: IPvaChatConnectorViewProps) => {
    // Render Chat only if Botframework-WebChat library is loaded
    if (window && (window as unknown as IWindow) && (window as unknown as IWindow).WebChat) {
        const [store, setStore] = useState();
        const [loaded, setLoaded] = useState(false); // loaded & minimized are needed as ChatWidget should not be removed from DOM (it resets chat)
        const [minimized, setMinimized] = useState(true);
        const [newMessage, setNewMessage] = useState(false); // TODO: use this to indicate new message in minimized chat
        const [token, setToken] = useState(''); // holds conversation token for WebChat
        const [isProactive, setIsProactive] = useState(false);  // if proactive chat is triggered
        const [proactiveMessage, setProactiveMessage] = useState(props.config.proactiveDefaultMessage);
        const [closed, setClosed] = useState(false);
        const [provider, setProvider] = useState<TContextProvider | undefined>();
        const chatStyle = getChatStyling(props.config, minimized); // generates chat style objects based on configuration
        const applyToken = async () => { try { setToken(await getToken(props)); } catch (e) { setToken(INVALID_TOKEN); props.telemetry.exception(e); } };
        const handleFetchToken = useCallback(async () => { if (!token) { await applyToken(); } }, [setToken, token]);
        const handleMaximizeButtonClick = () => { setLoaded(true); setMinimized(false); setNewMessage(false); };
        const handleMinimizeButtonClick = () => { setMinimized(true); setNewMessage(false); };
        const handleCloseButtonClick = () => { setClosed(true); setLoaded(false); setMinimized(true); setNewMessage(false); setIsProactive(false); };
        useEffect(
            () => {
                (async () => {
                    const contextProvider = new ContextProvider(props); // Generates context (provider) and checks for proactive chat triggers
                    const prov = await contextProvider.init();
                    if (contextProvider.data.enabled) { // if proactive chat is triggered
                        const timeout = contextProvider.data.timeout * 1000; // timeout is there only for WaitOnTime trigger
                        setTimeout(() => { if (!loaded) { setProactiveMessage(contextProvider.data.message); setIsProactive(true); } }, timeout);
                    }
                    setProvider(prov);
                    setStore(getStore(props, setNewMessage, prov));
                })()
                    .catch(e => props.telemetry.exception(e));
            },
            []
        );
        useEffect(
            () => { if (closed) { if (provider) { setStore(getStore(props, setNewMessage, provider)); } setClosed(false); } },
            [token, provider]
        );
        useEffect(
            () => { (async () => { if (closed) { await applyToken(); } })().catch(e => props.telemetry.exception(e)); },
            [closed]
        );
        const isValidToken = (): boolean => { return `${token}` !== INVALID_TOKEN; };
        return (
            <div style={chatStyle.ChatWrapperStyle}>
                {minimized && (!isProactive || (isProactive && loaded)) &&
                    (<button onClick={handleMaximizeButtonClick} style={chatStyle.ChatButtonStyle}>
                        {props.config.storeLogoURL && <img src={props.config.storeLogoURL} alt='logo' style={chatStyle.ButtonStoreLogoStyle} />}
                        <div style={{}}>
                            <div style={{ fontWeight: 'bold', fontSize: '120%' }}>{props.config.chatButtonHeader}</div><div>{props.config.chatButtonText}</div>
                        </div> {newMessage && <span className='red-dot' style={chatStyle.RedDotStyle}>.</span>}
                    </button>)}
                {minimized && isProactive && !loaded && (
                    <div style={chatStyle.ProactiveWrapperStyle}>
                        <div style={chatStyle.ProactiveMessageHeader}>
                            {props.config.storeLogoURL && <img src={props.config.storeLogoURL} alt='logo' style={chatStyle.ChatStoreLogoStyle} />}<div style={{ flexGrow: 1 }} />
                        </div>
                        <div style={chatStyle.ProactiveMessageContent}>
                            <p>{proactiveMessage}</p><button onClick={handleMaximizeButtonClick} style={chatStyle.ProactiveButtonStyle}>Let's chat</button>
                        </div>
                    </div>
                )}
                {store && loaded && isValidToken() &&
                    (<div style={chatStyle.ChatMessagesStyle}>
                        <div style={chatStyle.ChatMessageHeader}>
                            {props.config.storeLogoURL && <img src={props.config.storeLogoURL} alt='logo' style={chatStyle.ChatStoreLogoStyle} />}<div style={{ flexGrow: 1 }} />
                            <button onClick={handleMinimizeButtonClick} style={chatStyle.MinimizeButtonStyle} />
                            <button onClick={handleCloseButtonClick} style={chatStyle.CloseButtonStyle}>
                                <svg height='16px' id='Layer_1' version='1.1' viewBox='0 0 512 512' width='16px' xmlSpace='preserve'>
                                    <path d={CLOSE_IMG_DATA} fill={props.config.headerTextColor} />
                                </svg>
                            </button>
                        </div>
                        <div style={chatStyle.ChatMessageContent}>
                            <ChatCore onFetchToken={handleFetchToken} store={store} token={token} config={props.config} userId={props.context.request.user.customerAccountNumber || 'N/A'} />
                        </div>
                    </div>)}
                {!isValidToken() && (<div style={{ display: 'flex', alignItems: 'flex-end' }}>{props.config.unableToLoadChatMessage}</div>)}
            </div>
        );
    } else {
        return <span />;
    }
};

export default Chat;