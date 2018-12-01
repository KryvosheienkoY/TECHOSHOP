import './scss/main.scss';
import $ from 'jquery';

// let generateHomeContent = require('./modules/HomeContentHtml');
import generateHomeContent from './modules/HomeContentHtml';
import generateShoppingContent from './modules/ShoppingContentHtml';
import {generateCartContent, initCart} from './modules/CartContentHTML';


console.log(generateHomeContent);

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


