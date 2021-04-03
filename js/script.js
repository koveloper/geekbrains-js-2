import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js';

const DFLT_GOODS_ITEM = {
	name: 'NEW',
	price: 99,
	description: 'Don\'t miss our new product.',
	images: [],
};

class GoodsItem {

	constructor({ id, name, price, description, images } = DFLT_GOODS_ITEM) {
		this.id_ = id;
		this.name_ = name;
		this.price_ = price;
		this.description_ = description;
		this.images_ = images;
	}

	get name() {
		return this.name_;
	}

	get price() {
		return this.price_;
	}

	get id() {
		return this.id_;
	}

	get description() {
		return this.description_;
	}

	get images() {
		return this.images_;
	}

	render(container) {
		if(container) {
			const goodsItem = document.createElement('div');
			goodsItem.setAttribute('class', 'goods-item');
			goodsItem.setAttribute('id', `gi-${this.id_}`);
			const goodsItemTitle = document.createElement('h3');
			goodsItemTitle.textContent = this.name_;
			goodsItemTitle.setAttribute('style', 'pointer-events: none');
			goodsItem.append(goodsItemTitle);
			console.log(this.images_);
			if (this.images_ && this.images_.length) {
				const goodsItemImage = document.createElement('img');
				goodsItemImage.setAttribute('src', this.images_[0]);
				goodsItemImage.setAttribute('width', '64');
				goodsItemImage.setAttribute('style', 'pointer-events: none');
				goodsItem.append(goodsItemImage);
			}
			const goodsItemPrice = document.createElement('p');
			goodsItemPrice.textContent = this.price_;
			goodsItemPrice.setAttribute('style', 'pointer-events: none');
			goodsItem.append(goodsItemPrice);
			container.append(goodsItem);
		}
	}

	get component() {
		return document.querySelector(`#gi-${this.id_}`);
	}

	isThisItem(target) {
		return target && target.id === 'gi-' + this.id_;
	}

	static isGoodsItem(target) {
		return target && target.classList && target.classList.contains('goods-item');
	}

	static getId(target) {
		return this.isGoodsItem(target) ? target.id.replace('gi-', '') : null;
	}
}

class CartItem extends GoodsItem {

	constructor(goodsItem = DFLT_GOODS_ITEM) {
		super(goodsItem);
		this.count_ = 0;
	}

	add(count = 0) {
		this.count_ += count;
	}

	get count() {
		return this.count_;
	}

	render(container) {
		if (container) {
			container.append(CartItem.createCartItemHTML({
				id: this.id,
				image: this.images && this.images.length ? this.images[0] : null,
				name: this.name,
				price: this.price,
				count: this.count
			}));
		}
	}

	static createCartItemHTML({ id, image, name, price, count = 1, style }) {
		const cartItem = document.createElement('div');
		cartItem.setAttribute('class', 'cart-item');
		if (id) {
			cartItem.setAttribute('id', `ci-${id}`);
		}
		if (style) {
			cartItem.setAttribute('style', style);
		}
		if (image) {
			const img = document.createElement('img');
			img.setAttribute('src', image);
			img.setAttribute('width', '32');
			img.setAttribute('height', '32');
			img.setAttribute('style', 'pointer-events: none; margin: 0 4px 0 0');
			cartItem.append(img);
		}
		const cartItemTitle = document.createElement('h3');
		cartItemTitle.textContent = name;
		cartItemTitle.setAttribute('style', 'pointer-events: none');
		cartItem.append(cartItemTitle);

		const cartItemPrice = document.createElement('p');
		cartItemPrice.textContent = `${count ? (count + ' x ') : ''}${price}$ ${count ? ('= ' + (count * price) + '$') : ''}`;
		cartItemPrice.setAttribute('style', 'pointer-events: none; margin: 0 0 0 auto');
		cartItem.append(cartItemPrice);

		const cartItemDelete = document.createElement('button');
		cartItemDelete.textContent = 'X';
		cartItemDelete.setAttribute('class', 'cart-item-delete');
		if (id) {
			cartItemDelete.setAttribute('id', `cid-${id}`);
		}
		cartItem.append(cartItemDelete);
		return cartItem;
	}

	static getIdByDeleteButton(target) {
		return target.id.replace('cid-', '');
	}
}

class Cart {

	constructor() {
		this.goodsMap = new Map();
	}

	add(goodsItem, count = 1) {
		if (goodsItem) {
			if (!this.goodsMap.has('' + goodsItem.id)) {
				this.goodsMap.set('' + goodsItem.id, new CartItem(goodsItem));
			}
			const it = this.goodsMap.get('' + goodsItem.id);
			it.add(count);
			if (it.count <= 0) {
				this.goodsMap.delete(it.getGoodsItem);
			}
		}
		this.renderCompactView(document.querySelector('.cart-button'));
		this.renderMainView();
	}

	get inner() {
		return [...this.goodsMap.values()];
	}

	get innerGoodsCost() {
		return [...this.goodsMap.values()].reduce((acc, el) => { return acc + (el.count * el.price); }, 0);
	}

	get innerGoodsCount() {
		return [...this.goodsMap.values()].reduce((acc, el) => { return acc + el.count; }, 0);
	}

	get container() {
		return document.querySelector('.cart-items');
	}

	renderCompactView(container) {
		container.textContent = '';
		container.setAttribute('style', 'display: flex; align-items: center; justify-content: space-evenly');
		const sign = document.createElement('span');
		sign.textContent = `Carts:  ${this.innerGoodsCount} / ${this.innerGoodsCost}$`;
		container.append(sign);
	}

	deleteCartItem(id) {
		if (id !== undefined) {
			this.goodsMap.delete(id);
		} else {
			this.goodsMap.clear();
		}
	}

	renderMainView() {
		this.container.textContent = '';
		for (let it of this.goodsMap.values()) {
			it.render(this.container);
		}
		if (this.goodsMap.size) {
			this.container.append(CartItem.createCartItemHTML({
				name: 'Summary',
				price: this.innerGoodsCost,
				count: 0,
				style: 'border-top: 1px solid gray'
			}));
		}
		this.container.onclick = (e) => {
			if (e.target.classList && e.target.classList.contains('cart-item-delete')) {
				if (e.target.id) {
					this.deleteCartItem(CartItem.getIdByDeleteButton(e.target));
				} else {
					this.deleteCartItem();
				}
				this.renderMainView();
				this.add();
			}
		};
		cartPopup.itemsCountInCart = this.innerGoodsCount;
	}
}

class GoodsList {

	constructor(addToCartCallback) {
		this.goods_ = [];
		this.container.addEventListener('click', e => {
			if (GoodsItem.isGoodsItem(e.target)) {
				e.stopPropagation();
				if (addToCartCallback) {
					addToCartCallback(this.goods.reduce((acc, el) => { return acc ? acc : (el.id == GoodsItem.getId(e.target) ? el : null); }, null));
				}
			}
		});
	}

	initialize() {
		const err_ = (err) => {
			alert(err);
		};
		const ok_ = (goods_) => {
			console.log(goods_);
			for (let good of goods_) {
				this.add(good.product_name, good.product_price, good.product_description, good.product_images, good.product_id);
			}
			this.render();
		};
		fetch('https://resources.radio-most.ru/geekbrains/goods.json?v=' + Math.random())
			.then((response) => {return response.json();})
			.then(ok_)
			.catch(err_);
	}

	get container() {
		return document.querySelector('.goods-list');
	}

	get goods() {
		return this.goods_;
	}

	add(name = DFLT_GOODS_ITEM.name, price = DFLT_GOODS_ITEM.price, description = DFLT_GOODS_ITEM.description, images = DFLT_GOODS_ITEM.images, id) {
		id = id === undefined ? this.goods_.length : id;
		this.goods_.push(new GoodsItem({ id, name, price, description, images }));
	}

	render() {
		const container = this.container;
		container.innerHTML = '';
		this.goods_.forEach(it => { it.render(container); });
	}
}

class CheckField {
	constructor(regExp, selector, isErrorRegExp = true) {
		this.regExp = regExp;
		this.isErrorRegExp = isErrorRegExp;
		this.selector = selector;
		document.querySelector(selector).addEventListener('keyup', () => {
			const el = document.querySelector(this.selector);
			if(!this.isCorrect()) {
				el.classList.add('err-value');
			} else {
				el.classList.remove('err-value');
			}
		});
	}
	
	checkByRegExp(text) {
		this.regExp.lastIndex = 0;
		return this.regExp.test(text) === this.isErrorRegExp;
	}

	isCorrect() {
		const el = document.querySelector(this.selector);
		return !this.checkByRegExp(el.value);		
	}
}

class Order {
	constructor() {
		this.nameField = new CheckField(/[^(\x41-\x5A),(\x61-\x7A),(\u0410-\u044f),\s]+/g, '#order-user-name');
		this.phoneField = new CheckField(/\+7\(\d{3}\)\d{3}\-\d{4}$/g, '#order-user-phone', false);
		document.querySelector('.order-send').onclick = () => {
			if(!this.nameField.isCorrect()) {
				alert('Wrong name format');
				return;
			}
			if(!this.phoneField.isCorrect()) {
				alert('Wrong phone format');
				return;
			}
			magazine.closeOrder();
		};
		document.querySelector('.cart-popup-order').onclick = () => {
			magazine.closeCart();
			magazine.openOrder();
		};
	}
}

class Magazine {

	constructor() {
		this.cart = new Cart();
		this.goodsList_ = new GoodsList((goodsItem) => {
			this.addToCart(goodsItem);
		});
		this.order = new Order();
	}

	addToCart(goodsItem, count = 1) {
		console.log(this);
		console.log(goodsItem);
		this.cart.add(goodsItem, count);		
	}

	initialize() {
		document.querySelector('.cart-button').onclick = () => {this.openCart();};
		document.querySelector('.cart-popup-close').onclick = () => {this.closeCart();};
		this.goodsList_.initialize();
	}

	openOrder() {
		document.querySelector('.order-popup').style.maxHeight = '100vh';
	}

	closeOrder() {
		document.querySelector('.order-popup').style.maxHeight = '0';
	}

	get goodsList() {
		return this.goodsList_;
	}
}

const magazine = new Magazine();
magazine.initialize();

const filter = new Vue({
	el: '#filter',
	searchLine : null,
	methods: {
		filterValueChanged($event) {
			this.searchLine  = $event.currentTarget.value;
			this.applyFilter();
		},
		applyFilter() {
			const regExp = new RegExp(filter.searchLine, 'gmi');
			magazine.goodsList.goods.forEach(el => {
				el.component.style.display = regExp.test(el.name) ? 'flex' : 'none'; 
				regExp.lastIndex = 0;
			});
			console.log(magazine.goodsList.goods);
		}		
	}
});

const search = new Vue({
	el: '.header-filter-search',
	data: {
		searchTitle: 'Search'
	},
	methods: {
		filterGoods() {
			filter.applyFilter();
		}
	}
});

const openCartButton = new Vue({
	el: '.cart-button',
	methods: {
		openCart() {
			cartPopup.open();
		}
	}
});

const cartPopup = new Vue({
	el: '.cart-popup',
	data: {
		isVisible: false,
		itemsCountInCart: 0
	},
	methods: {
		open() {
			console.log(magazine.cart.innerGoodsCount);
			this.itemsCountInCart = magazine.cart.innerGoodsCount;
			this.isVisible = true;
		},
		close() {
			cartPopup.isVisible = false;
		}
	}
});

