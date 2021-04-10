import Vue from '../lib/vue.esm.browser.js';
import registerMiniCart from './mini-cart.js';
import registerSearch from './search.js';

registerMiniCart();
registerSearch();

const registerHeader = () => {
	Vue.component('app-header', {
		props: [
			'cartItems'
		],
		template: 
        `<header class="app-header">
            <app-header-search
                v-on:search-field-changed='searchFieldChanged'
			/>
            <app-header-mini-cart
				v-on:open-cart='openCart'
				:cartItems="cartItems"
			/>
        </header>`,
		methods: {
			searchFieldChanged($event) {
				this.$emit('search-field-changed', $event);
			},
			openCart() {
				this.$emit('open-cart');
			}
		}
	});
};

export default registerHeader;