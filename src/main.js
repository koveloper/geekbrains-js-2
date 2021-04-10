import Vue from '../lib/vue.esm.browser.js';
import registerHeader from './header.js';
import registerGoodsLst from './goods-list.js';
import registerCart from './cart.js';

registerHeader();
registerGoodsLst();
registerCart();

const app = new Vue({
	el: '#app',
	template: 
		`<div class="app">
			<app-header 
				v-on:search-field-changed='searchFieldChanged'
				:cartItems="cartItems"
				v-on:open-cart='openCart'
			/>
			<app-goods-list 
				:goods="goods"
				:filterValue="filterValue"
				v-on:add-to-cart='addToCart'
			/>
			<app-cart 
				:cartItems="cartItems"
				:isCartVisible="isCartVisible"
				v-on:close-cart="closeCart"
				v-on:delete-from-cart="deleteFromCart"
			/>
		</div>`,
	data: {
		isCartVisible: false,
		goods: [],
		cartItems: [],
		filterValue: ''
	},
	methods: {
		searchFieldChanged($event) {
			this.$data.filterValue = $event.currentTarget.value;
		},
		addToCart(productId) {
			this.$data.cartItems.push(this.$data.goods.find(e => e.product_id == productId));
		},
		openCart() {
			this.$data.isCartVisible = true;
		},
		closeCart() {
			this.$data.isCartVisible = false;
		},
		deleteFromCart(product_id) {
			if(product_id !== undefined) {
				this.$data.cartItems = this.$data.cartItems.filter(el => el.product_id != product_id);
			} else {
				this.$data.cartItems = [];				
			}
		}
	}
});
const err_ = (err) => {
	alert(err);
};
const ok_ = (goods_) => {
	console.log(goods_);
	app.goods = goods_;
};

fetch('https://resources.radio-most.ru/geekbrains/goods.json?v=' + Math.random())
	.then((response) => {return response.json();})
	.then(ok_)
	.catch(err_);