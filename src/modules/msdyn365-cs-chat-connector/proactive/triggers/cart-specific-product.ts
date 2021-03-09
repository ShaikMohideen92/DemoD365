// @ts-ignore
import { getCartState } from '@msdyn365-commerce/global-state/dist/lib/data-actions/get-cart-state';
import { ICartState } from '@msdyn365-commerce/global-state/dist/types/state-interfaces/i-cart-state';
import { ICartSpecificProductContext, TContextProvider } from '../../interfaces';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * CartSpecificProductTrigger class - proactive chat is triggered if a Product in the Cart is in preset list of products (config.proactiveOnCartSpecificProductList)
 */
class CartSpecificProductTrigger extends ProactiveChatTrigger {
    private product: string = '';

    public async validate(): Promise<boolean> {
        let isValid = false;
        const cart = await this._getCart();
        if (!cart.isEmpty) {
            if (cart.cart.CartLines) {
                for (let i = 0; i < cart.cart.CartLines?.length; i++) {
                    if (cart.cart.CartLines && cart.cart.CartLines[i]) {
                        if (this.props.config.proactiveOnCartSpecificProductList) {
                            for (let j = 0; j < (this.props.config.proactiveOnCartSpecificProductList?.length || 0); j++) {
                                if (this.props.config.proactiveOnCartSpecificProductList &&
                                    cart.cart.CartLines[i].ItemId &&
                                    this.props.config.proactiveOnCartSpecificProductList[j] === cart.cart.CartLines[i].ItemId) {
                                    this.product = cart.cart.CartLines[i].ItemId || '';
                                    isValid = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        // Rest of the CartLines are undefined
                        break;
                    }
                }
            }
        }
        return isValid;
    }

    public getContext(): TContextProvider {
        return (): ICartSpecificProductContext => {
            return {
                ...this.context,
                eCommerceCustIsProactiveChat: {
                    value: 'True',
                    isDisplayable: true
                },
                eCommerceCustProactiveType: {
                    value: 'Date Range',
                    isDisplayable: true
                },
                eCommerceCustProactiveShoppingCartSpecificProduct: {
                    value: this.product,
                    isDisplayable: true
                }
            };
        };
    }

    public getMessage(): string {
        // @TODO: Add message processing if needed
        return this.props.config.proactiveOnCartSpecificProductMessage || this.props.config.proactiveDefaultMessage;
    }

    private async _getCart(): Promise<ICartState> {
        return getCartState(this.props.context.actionContext);
    }
}

export default CartSpecificProductTrigger;