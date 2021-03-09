// @ts-ignore
import { getCartState } from '@msdyn365-commerce/global-state/dist/lib/data-actions/get-cart-state';
import { ICartState } from '@msdyn365-commerce/global-state/dist/types/state-interfaces/i-cart-state';
import { IChatContext, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * CartAmountTrigger class - proactive chat is triggered if cArt amount is in preset boundaries (config.proactiveOnCartAmounMin, config.proactiveOnCartAmountMax)
 */
class CartAmountTrigger extends ProactiveChatTrigger {
    private min?: number;
    private max?: number;
    private totalInCart: number = 0;

    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        this.min = this.props.config.proactiveOnCartAmounMin;
        this.max = this.props.config.proactiveOnCartAmountMax;
    }

    public async validate(): Promise<boolean> {
        const cart = await this._getCart();
        if (cart.isEmpty) {
            return false;
        }

        this.totalInCart = cart.cart.TotalAmount || 0;

        if (this.min) {
            if (this.max) {
                return this.min <= this.totalInCart
                    && this.totalInCart <= this.max;
            } else {
                return this.min <= this.totalInCart;
            }
        } else {
            if (this.max) {
                return this.totalInCart <= this.max;
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
                eCommerceCustProactiveType: 'Cart Amount',
                eCommerceCustProactiveShoppingCartAmount: `${this.totalInCart}`
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnCartAmountMessage || this.props.config.proactiveDefaultMessage;
    }

    private async _getCart(): Promise<ICartState> {
        return getCartState(this.props.context.actionContext);
    }
}

export default CartAmountTrigger;