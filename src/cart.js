import Vue from '../lib/vue.esm.browser.js';
import registerCartItem from './cart-item.js';

registerCartItem();

const registerCart = () => {
	Vue.component('app-cart', {
		props: [
			'cartItems',
			'isCartVisible'
		],
		template: 
        `<div v-bind:class="{ 'cart-show': isCartVisible }" class="cart">
			<div class="cart-is-empty" v-if="isEmpty">
				Cart is empty
			</div>
			<div class="cart-list" v-if="isNotEmpty">
				<h2 class="cart-list-title">Cart</h2>
				<app-cart-item v-for="item in cartList" :key="item.product_id" 
					v-bind='item'
					v-on:delete-from-cart="deleteFromCart"			
				/>
				<div class="cart-list-separator"></div>
				<app-cart-item v-bind='total' v-on:delete-from-cart="deleteFromCart"/>				
			</div>
			<div class="cart-close" v-on:click='closeCart'>X</div>
        </div>`,
		computed: {
			isNotEmpty() {
				return this.$props.cartItems.length;
			},
			isEmpty() {
				return this.$props.cartItems.length === 0;
			},
			cartList() {
				const cartList_ = [];
				for(const c of this.$props.cartItems) {
					const item_ = cartList_.find(el => el.product_id == c.product_id); 
					if(item_) {
						item_.count++;
					} else {
						cartList_.push(Object.assign({}, c, {count: 1}));
					}
				} 
				console.log(cartList_);
				return cartList_;
			},
			total() {
				return this.$props.cartItems.reduce((acc, el) => {
					acc.product_price += el.product_price;
					return acc;
				}, {
					product_name: 'Total', 
					product_id: 999999, 
					product_price: 0, 
					product_images: [''], 
					count: 1, 
					isTotal: true
				});
			}
		},
		methods: {
			closeCart() {
				this.$emit('close-cart');
			},
			deleteFromCart(product_id) {
				this.$emit('delete-from-cart', product_id === 999999 ? undefined : product_id);				
			}
		}
	});
};

export default registerCart;