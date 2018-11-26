let _makeHtmlProducts = ({
                             id,
                             name,
                             image_url,
                             description,
                             price,
                             special_price,
                         }) => {
    let $product = $(`<div class="card col-xs-9 col-sm-5 col-md-3" data-product-id="${id}">`);
    $product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-image">`));
    $product.append($(`<a class="product-title">${name}</a>`));
    if (special_price == null) {
        $product.append($(`<span class="product-price">`).text(price));
    }
    else {
        $product.append($(`<p class="product-price old_price">`).text(price));
        $product.append($(`<p class="product-price special_price">`).text(special_price));
    }
    $product.append($(`<button type="button" class="product-buy-button btn btn-success"><i class="fas fa-shopping-cart"></i> Buy</button>`));
    return $product;
};

module.exports = _makeHtmlProducts;