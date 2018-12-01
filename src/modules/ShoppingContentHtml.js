
import generateProductPage from './ProductPageInfoHTML';
import {addToCart} from './CartContentHTML';




let currentCategory = 1;

function generateShoppingContent() {
    generateShoppingHTML();
    addCategoriesHTML();
}

function generateShoppingHTML() {

    let contentDiv = $('#contentDIVID');
    let items = $(`
            <div class="shopping">
                <div class="leftbar">
                    <!-- Categories -->
                    <p class=" header">Categories</p>
                    <ul class="categoryList" id="categoryListID">
                    <li class="category" id="1" about="All shop products">
                    <a>All</a></li>
                    </ul>
                </div>
             <div class="productsRightPart">
                <div class="container">
                   <div class="row product-grid"></div>
                </div>
             </div>
            </div>`);
    contentDiv.empty();
    contentDiv.append(items);
    $('#1').on("click", changeActiveCategory);
}


function changeActiveCategory() {
    let urlString;
    let k = currentCategory - 1;
    let point = $("ul.categoryList li");
    point.eq(k).removeClass("activePoint");
    let num = $(this).attr("id");
    if (num === undefined) {
        num = currentCategory;
    }
    currentCategory = num;
    k = currentCategory - 1;
    point.eq(k).addClass("activePoint");
    $('.product-grid').empty();
    //not change ==
    if (currentCategory == 1) {
        urlString = String("https://nit.tron.net.ua/api/product/list");
    }
    else {
        urlString = String("https://nit.tron.net.ua/api/product/list/category/" + currentCategory);
    }
    addProductsGrid(urlString);
}

function addCategoriesHTML() {
    jQuery.ajax({
        url: 'http://nit.tron.net.ua/api/category/list',
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.log('Loaded categories via AJAX!');
            json.forEach(category => $('.categoryList').append(_makeHtmlCategories(category)));
            console.log('Added to list');
            // choosing current active category - by default - 0 (all)
            changeActiveCategory();
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

let _makeHtmlCategories = ({
                               id,
                               name,
                               description,
                           }) => {
    let $category = $(`<li class="category" id="${id}" about="${description}"></li>`);
    $category.append($(`<a> ${name} </a>`));
    $category.on("click", changeActiveCategory);
    return $category;
};

let _makeHtmlProducts = ({
                             id,
                             name,
                             image_url,
                             description,
                             price,
                             special_price,
                         }) => {
    let $product = $(`<div class="card col-xs-9 col-sm-5 col-md-3" id="cardID${id}">`);
    $product.append($(`<img src="${image_url}" alt="${name}" id="title${id}" class="img-fluid product-image">`));
    let title = $(`<a class="product-title product-title-clickable" id="title${id}">${name}</a>`);
    $product.append(title);
    if (special_price == null) {
        $product.append($(`<span class="product-price" id="productPrice${id}">`).text(price));
    }
    else {
        $product.append($(`<p class="product-price old_price" id="productOldPrice${id}">`).text(price));
        $product.append($(`<p class="product-price special_price" id="productSpecialPrice${id}">`).text(special_price));
    }
    let buyButton = $(`<button type="button" class="product-buy-button btn btn-success"><i class="fas fa-shopping-cart"></i> Buy</button>`);
    buyButton.on("click", addToCart.bind(null, id));
    $product.append(buyButton);
    return $product;
};

function addProductsGrid(urlString) {
    console.log(urlString);
    jQuery.ajax({
        url: urlString,
        method: 'get',
        dataType: 'json',
        success: function (json) {
            console.table(json);
            console.log("Loaded products of category " + currentCategory + " via AJAX!");
            json.forEach(function (product) {
                let pr = _makeHtmlProducts(product);
                $('.product-grid').append(pr);
            });

            $('.card').on('click', function (e) {
                if (!$(".product-buy-button").is(e.target))
                    generateProductPage(e.target.id);
            });

            console.log('Products are added to grid');
        },
        error: function (xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        },
    });
}

export default generateShoppingContent;
