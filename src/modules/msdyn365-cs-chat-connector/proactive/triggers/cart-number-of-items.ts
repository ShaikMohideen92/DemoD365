// @ts-ignore
import { getCartState } from '@msdyn365-commerce/global-state/dist/lib/data-actions/get-cart-state';
import { ICartState } from '@msdyn365-commerce/global-state/dist/types/state-interfaces/i-cart-state';
import { ICartNumberOfItemsContext, IChatContext, TContextProvider } from '../../interfaces';
import { IMsdyn365CsChatConnectorViewProps } from '../../msdyn365-cs-chat-connector';
import ProactiveChatTrigger from './proactive-chat-trigger';

/**
 * CartNumberOfItemsTrigger class - proactive chat is triggered if Cart Number of Items is in preset boundaries (config.proactiveOnCartNoOfItemsMin, config.proactiveOnCartNoOfItemsMax)
 */
class CartNumberOfItemsTrigger extends ProactiveChatTrigger {
    private min?: number;
    private max?: number;
    private numberOfItems: number = 0;

    constructor(props: IMsdyn365CsChatConnectorViewProps, context: IChatContext) {
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

    public getContext(): TContextProvider {
        return (): ICartNumberOfItemsContext => {
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
                eCommerceCustProactiveShoppingCartNumberOfItems: {
                    value: this.numberOfItems,
                    isDisplayable: true
                }
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