let _makeHtmlCategories = ({
                             id,
                             name,
                             description,
                         }) => {
    let $category = $(`<li class="category" data-category-id="${id}"><a>${name}</a></li>`);
    return $category;
};
module.exports = _makeHtmlCategories;