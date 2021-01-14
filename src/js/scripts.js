const d = document;

d.getElementById('navButton').addEventListener('click', function () {
    this.classList.toggle('navbutton__active')
})

/*===== sliders  =====*/
document.addEventListener('DOMContentLoaded', function () {
    new Splide('.reviews', {
        arrows: false,
        type: 'loop',
        pagination: true
    }).mount();
});

/*==== masonry===== */
function resizeGridItem(item) {
    let grid = document.getElementsByClassName("projects")[0];
    let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    let rowSpan = Math.ceil((item.querySelector('.projects__content').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems() {
    let allItems = document.getElementsByClassName("projects__item");
    for (let x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
    }
}

function resizeInstance(instance) {
    let item = instance.elements[0];
    resizeGridItem(item);
}

window.onload = resizeAllGridItems();
window.addEventListener("resize", resizeAllGridItems);

let allItems = document.getElementsByClassName("projects__item");
for (let x = 0; x < allItems.length; x++) {
    imagesLoaded(allItems[x], resizeInstance);
}