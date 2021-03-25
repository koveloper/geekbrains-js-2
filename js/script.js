'use strict';

function RequestFactory(url) {
	return new Promise((onSuccess, onError) => {
		const request_ = window.XMLHttpRequest ? new XMLHttpRequest() : (window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null);
		let done_ = false;
		if (!request_) {
			return;
		}
		request_.timeout = 10000;
		request_.onreadystatechange = function () {
			console.log(request_.readyState);
			if (request_.readyState === 4) {
				console.log(request_.status);
				if (!done_ && request_.status != 200) {
					done_ = true;
					onError('Response code is ' + request_.status);
				} else if (!done_ && request_.status == 200) {
					done_ = true;
					onSuccess(request_.responseText);
				}
			}
		}
		request_.ontimeout = function () {
			if (!done_ && onErrorCallback) {
				done_ = true;
				onError('Timeout reached');
			}
		}
		request_.open('GET', url, true);
		request_.setRequestHeader('Content-Type', 'text/plain');
		request_.send();
	});
}

const DFLT_GOODS_ITEM = {
	name: 'NEW',
	price: 99,
	description: 'Don\'t miss our new product.',
	images: [],
}

class GoodsItem {

	constructor({ id, name, price, description, images } = DFLT_GOODS_ITEM) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.description = description;
		this.images = images;
	}

	getName() {
		return this.name;
	}

	getPrice() {
		return this.price;
	}

	getId() {
		return this.id;
	}

	getDescription() {
		return this.description;
	}

	getImages() {
		return this.images;
	}

	render(container) {
		if (container && container.append && typeof container.append == 'function') {
			const goodsItem = document.createElement('div');
			goodsItem.setAttribute('class', 'goods-item');
			goodsItem.setAttribute('id', 'gi-' + this.id);
			const goodsItemTitle = document.createElement('h3');
			goodsItemTitle.textContent = this.name;
			goodsItemTitle.setAttribute('style', 'pointer-events: none');
			goodsItem.append(goodsItemTitle);
			console.log(this.images);
			if (this.images && this.images.length) {
				const goodsItemImage = document.createElement('img');
				goodsItemImage.setAttribute('src', this.images[0]);
				goodsItemImage.setAttribute('width', '64');
				goodsItemImage.setAttribute('style', 'pointer-events: none');
				goodsItem.append(goodsItemImage);
			}
			const goodsItemPrice = document.createElement('p');
			goodsItemPrice.textContent = this.price;
			goodsItemPrice.setAttribute('style', 'pointer-events: none');
			goodsItem.append(goodsItemPrice);
			container.append(goodsItem);
		}
	}

	isThisItem(target) {
		return target && target.id === 'gi-' + this.id;
	}

	static isGoodsItem(target) {
		return target && target.classList && target.classList.contains('goods-item');
	}

	static getId(target) {
		return this.isGoodsItem(target) ? target.id.replace('gi-', '') : null;
	}
}

class CartItem extends GoodsItem {

	constructor(goodsItem = DFLT_CART_ITEM) {
		super(goodsItem);
		this.count = 0;
	}

	add(count = 0) {
		this.count += count;
	}

	getCount() {
		return this.count;
	}

	render(container) {
		if (container && container.append && typeof container.append == 'function') {
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
			cartItem.setAttribute('id', 'ci-' + id);
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
		cartItemDelete.textContent = `X`;
		cartItemDelete.setAttribute('class', 'cart-item-delete');
		if (id) {
			cartItemDelete.setAttribute('id', 'cid-' + id);
		}
		cartItem.append(cartItemDelete);
		return cartItem;
	}

	static getIdByDeleteButton(target) {
		return target.id.replace('cid-', '');
	}
}

class Cart {

	constructor(container) {
		this.goodsMap = new Map();
	}

	add(goodsItem, count = 1) {
		if (goodsItem) {
			if (!this.goodsMap.has('' + goodsItem.getId())) {
				this.goodsMap.set('' + goodsItem.getId(), new CartItem(goodsItem));
			}
			const it = this.goodsMap.get('' + goodsItem.getId());
			it.add(count);
			if (it.getCount() <= 0) {
				this.goodsMap.delete(it.getGoodsItem)
			}
		}
		this.renderCompactView(document.querySelector('.cart-button'));
	}

	getInner() {
		return [...this.goodsMap.values()];
	}

	getInnerGoodsCost() {
		return [...this.goodsMap.values()].reduce((acc, el) => { return acc + (el.getCount() * el.getPrice()) }, 0);
	}

	getInnerGoodsCount() {
		return [...this.goodsMap.values()].reduce((acc, el) => { return acc + el.getCount() }, 0);
	}

	renderCompactView(container) {
		container.textContent = '';
		container.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; justify-content: space-evenly');
		const sign = document.createElement('span');
		sign.textContent = 'Carts: ' + this.getInnerGoodsCount();
		const cost = document.createElement('span');
		cost.textContent = 'for ' + this.getInnerGoodsCost() + '$';
		container.append(sign);
		container.append(cost);
	}

	deleteCartItem(id) {
		if (id !== undefined) {
			this.goodsMap.delete(id)
		} else {
			this.goodsMap.clear();
		}
	}

	renderMainView(container) {
		container.innerHTML = this.goodsMap.size ? '' : 'Cart is empty';
		for (let it of this.goodsMap.values()) {
			it.render(container);
		}
		if (this.goodsMap.size) {
			container.append(CartItem.createCartItemHTML({
				name: 'Summary',
				price: this.getInnerGoodsCost(),
				count: 0,
				style: 'border-top: 1px solid gray'
			}));
		}
		container.onclick = (e) => {
			if (e.target.classList && e.target.classList.contains('cart-item-delete')) {
				if (e.target.id) {
					this.deleteCartItem(CartItem.getIdByDeleteButton(e.target));
				} else {
					this.deleteCartItem();
				}
				this.renderMainView(container);
				this.add();
			}
		};
	}
}

class GoodsList {

	constructor(addToCartCallback) {
		this.goods = [];
		this.getContainer().addEventListener('click', e => {
			if (GoodsItem.isGoodsItem(e.target)) {
				e.stopPropagation();
				if (addToCartCallback) {
					addToCartCallback(this.goods.reduce((acc, el) => { return acc ? acc : (el.getId() == GoodsItem.getId(e.target) ? el : null) }, null));
				}
			}
		});
	}

	fetch() {
		const err_ = (err) => {
			alert(err);
		}
		const ok_ = (data) => {
			const goods_ = JSON.parse(data);
			console.log(goods_)
			for (let good of goods_) {
				this.add(good.product_name, good.product_price, good.product_description, good.product_images, good.product_id);
			}
			this.render();
		}
		new RequestFactory('https://resources.radio-most.ru/geekbrains/goods.json?v=' + Math.random()).then(ok_).catch(err_);
	}

	getContainer() {
		return document.querySelector('.goods-list');
	}

	add(name = DFLT_GOODS_ITEM.name, price = DFLT_GOODS_ITEM.price, description = DFLT_GOODS_ITEM.description, images = DFLT_GOODS_ITEM.images, id) {
		id = id === undefined ? this.goods.length : id;
		this.goods.push(new GoodsItem({ id, name, price, description, images }));
	}

	render() {
		const container = this.getContainer();
		container.innerHTML = '';
		this.goods.forEach(it => { it.render(container) });
	}
}

class Magazine {

	constructor() {
		this.cart = new Cart();
		this.goods = new GoodsList((goodsItem) => {
			this.addToCart(goodsItem);
		});
	}

	addToCart(goodsItem, count = 1) {
		console.log(this);
		console.log(goodsItem);
		this.cart.add(goodsItem, count);
	}

	initialize() {
		this.goods.fetch();
	}

	openCart() {
		this.cart.renderMainView(document.querySelector('.cart-items'));
		document.querySelector('.cart-popup').style.maxHeight = '100vh';
	}

	closeCart() {
		document.querySelector('.cart-popup').style.maxHeight = '0';
	}
}

const magazine = new Magazine();
magazine.initialize();