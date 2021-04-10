import Vue from '../lib/vue.esm.browser.js';

const registerCartItem = () => {
	Vue.component('app-cart-item', {
		props: [
			'product_id',
			'product_name',
			'product_description',
			'product_images',
			'product_price',
			'count',
			'isTotal'
		],
		template:
				`<div class="cart-item">
					<div v-if="!isTotal" class="cart-item-images">
						<img v-bind:src="product_images[0]" alt="product image" width="32">
					</div>
					<div class="cart-item-name">
						{{ product_name }}
					</div>					
					<div v-if="!isTotal" class="cart-item-price">
						{{ product_price }}$ x {{count}}
					</div>
					<div class="cart-item-total">
						{{ product_price*count }}$
					</div>
					<div class="cart-item-delete" v-on:click="deleteCartItem">X</div>
				</div>`,
		methods: {
			deleteCartItem() {
				this.$emit('delete-from-cart', this.$props.product_id);
			}
		}
	});
};

export default registerCartItem;