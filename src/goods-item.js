import Vue from '../lib/vue.esm.browser.js';

const registerGoodsItem = () => {
	Vue.component('app-goods-list-item', {
		props: [
			'product_id',
			'product_name',
			'product_description',
			'product_images',
			'product_price',
			'filterValue'
		],
		template:
			`<div v-if="checkFilter" class="goods-list-item">
					<div class="goods-list-item-name">
						{{ product_name }}
					</div>
					<div class="goods-list-item-description">
						{{ product_description }}
					</div>
					<div class="goods-list-item-images">
						<img v-bind:src="product_images[0]" alt="product image" width="160">
					</div>
					<div class="goods-list-item-price">
						{{ product_price }}$
					</div>
					<div class="goods-list-item-popup">
						<button class="goods-list-item-popup-btn" v-on:click='addToCart'>Add to cart</button>
					</div>
				</div>`,
		data() {
			return {
				cursorOn: false
			};
		},
		computed: {
			checkFilter() {
				console.log('check filter');
				const regExp = new RegExp(this.$props.filterValue, 'gmi');
				return regExp.test(this.$props.product_name);
			}
		},
		methods: {
			addToCart() {
				this.$emit('add-to-cart', this.$props.product_id);
			},
			
		}
	});
};

export default registerGoodsItem;