import './scss/main.scss';
import $ from 'jquery';

import generateHomeContent from './modules/HomeContentHtml';
import generateShoppingContent from './modules/ShoppingContentHtml';
import {generateCartContent, initCart} from './modules/CartContentHTML';

window.jQuery = $;
window.$ = $;

document.addEventListener("DOMContentLoaded", ready);
function ready() {
    initMenuBar();
    generateHomeContent();
     initCart();
}

function initMenuBar() {
    $('#menuHomeID').on("click", generateHomeContent);
    $('#menuShoppingID').on("click", generateShoppingContent);
    $('#menucartID').on("click", generateCartContent);
}


