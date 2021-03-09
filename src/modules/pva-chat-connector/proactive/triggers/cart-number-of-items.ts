// @ts-ignore
import { getCartState } from '@msdyn365-commerce/global-state/dist/lib/data-actions/get-cart-state';
import { ICartState } from '@msdyn365-commerce/global-state/dist/types/state-interfaces/i-cart-state';
import { IChatContext, TContextProvider } from '../../interfaces';
import { IPvaChatConnectorViewProps } from '../../pva-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * CartNumberOfItemsTrigger class - proactive chat is triggered if Cart Number of Items is in preset boundaries (config.proactiveOnCartNoOfItemsMin, config.proactiveOnCartNoOfItemsMax)
 */
class CartNumberOfItemsTrigger extends ProactiveChatTrigger {
    private min?: number;
    private max?: number;
    private numberOfItems: number = 0;

    constructor(props: IPvaChatConnectorViewProps, context: IChatContext) {
        super(props, context);
        this.min = this.props.config.proactiveOnCartNoOfItemsMin;
        this.max = this.props.config.proactiveOnCartNoOfItemsMax;
    }

    public async validate(): Promise<boolean> {
        const cart = await this._getCart();
        if (cart.isEmpty) {
            return false;
        }

        this.numberOfItems = cart.cart.TotalItems || 0;

        if (this.min) {
            if (this.max) {
                return this.min <= this.numberOfItems
                    && this.numberOfItems <= this.max;
            } else {
                return this.min <= this.numberOfItems;
            }
        } else {
            if (this.max) {
                return this.numberOfItems <= this.max;
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
                eCommerceCustProactiveType: 'Cart Number of Items',
                eCommerceCustProactiveShoppingCartNumberOfItems: `${this.numberOfItems}`
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnCartNoOfItemsMessage || this.props.config.proactiveDefaultMessage;
    }

    private async _getCart(): Promise<ICartState> {
        return getCartState(this.props.context.actionContext);
    }
}

export default CartNumberOfItemsTrigger;