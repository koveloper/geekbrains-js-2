import Vue from '../lib/vue.esm.browser.js';
import registerGoodsItem from './goods-item.js';

registerGoodsItem();

const registerGoodsLst = () => {
	Vue.component('app-goods-list', {
		props: [
			'goods',
			'filterValue'
		],
		template:
            `<div class="goods-list">
				<app-goods-list-item 
					v-for="item in goods" :key="item.product_id" 
					v-bind='item'
					:filterValue="filterValue"
					v-on:add-to-cart='addToCart'			
				/>
            </div>`,
		methods: {
			addToCart(product_id) {
				this.$emit('add-to-cart', product_id);
			}
		}
	});
};

export default registerGoodsLst;