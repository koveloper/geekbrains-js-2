const goods = [
	{ title: 'Shirt', price: 150 },
	{ title: 'Socks', price: 50 },
	{ title: 'Jacket', price: 350 },
	{ title: 'Shoes', price: 250 },
];

const renderGoodsItem = (title = 'new', price = '10') => {
	return `<div class="goods-item"><h3>${title}</h3><p>${price}</p></div>`;
};

const renderGoodsList = (list = []) => {
	//variant-1
	// let goodsList = (list.map(item => renderGoodsItem(item.title, item.price)) + '').replaceAll(',', '');
	// document.querySelector('.goods-list').innerHTML = goodsList;
	
	//variant-2
	// let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
	// goodsList.toString = function() {return this.reduce((acc, el) => {return acc + el;}, '');};
	// document.querySelector('.goods-list').innerHTML = goodsList;

	//variant-3
	document.querySelector('.goods-list').innerHTML = list.reduce((acc, item) => {return acc + renderGoodsItem(item.title, item.price);}, '');
};

renderGoodsList(goods);