import generateShoppingContent from './ShoppingContentHtml';
import {addToCart} from './CartContentHTML';

// construct product with html
let _makeHtmlInfoProduct = ({
                                id,
                                name,
                                image_url,
                                description,
                                price,
                                special_price,
                            }) => {
    let $product = $(`<div class="productInfoPage">`);
    $product.append($(`<img src="${image_url}" alt="${name}" class="img-fluid product-Bigimage">`));
    $product.append($(`<p class="product-title">`).text(name));
    if (special_price == null) {
        $product.append($(`<span class="product-price">`).text(price));
    }
    else {
        $product.append($(`<p class="product-price old_price">`).text(price));
        $product.append($(`<p class="product-price special_price">`).text(special_price));
    }
    let buyButton = $(`<button type="button" class="product-buy-button btn btn-success"><i class="fas fa-shopping-cart"></i> Buy</button>`);
    buyButton.on("click", addToCart.bind(null, id));
    $product.append(buyButton);
    $product.append($(`<p class="product-description">`).text(description));
    return $product;
};

// load product to product and add it to page
function addProduct(currentProductID) {
    let urlString = String("https://nit.tron.net.ua/api/product/" + currentProductID);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            $('.productPage').append(_makeHtmlInfoProduct(json));
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

// generate page view "Product Page"
function generateProductPage(elementID) {
    let contentDiv = $('#contentDIVID');
    let items = $(` 
  <div class="productPage">
    <p class="backToShopping"><i class="fas fa-arrow-left backButton"></i></p>
   </div>`);
    contentDiv.empty();
    contentDiv.append(items);
    $('.backButton').on("click",generateShoppingContent);
    let num =elementID.replace(/[^0-9]/g, '');
    addProduct(num);
}

export default generateProductPage;