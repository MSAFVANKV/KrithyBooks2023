// let selectedCategories = [];

// function toggleFilter(element, categoryName) {
//     // Toggle the background color and modify the selectedCategories array
//     if (element.style.backgroundColor === "blue") {
//         element.style.backgroundColor = "";
//         element.style.color = "";

//         const index = selectedCategories.indexOf(categoryName);
//         if (index > -1) {
//             selectedCategories.splice(index, 1);
//         }
//     } else {
//         element.style.backgroundColor = "blue";
//         element.style.color = "white";
//         selectedCategories.push(categoryName);
//     }
//     element.style.cursor = "pointer";

//     // Update the URL based on selected categories
//     if (selectedCategories.length === 0) {
//         window.location.href = "/categories?category=newReleases";
//     } else {
//         window.location.href = "/categories?category=" + selectedCategories.join('&');
//     }
// }

// // Function to restore category states based on URL parameters
// document.addEventListener("DOMContentLoaded", function() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const categories = urlParams.get('category').split('&');

//     categories.forEach(category => {
//         const filterElement = document.querySelector(`[data-category='${category}']`);
//         if (filterElement) {
//             filterElement.style.backgroundColor = "blue";
//             filterElement.style.color = "white";
//         }
//     });
// });

// 


// function filter(chackbox,categoryName) {
//     if(chackbox.checked){
//         if(categories.length > 0){
//             window.location.href = window.location.href + `&category=${categoryName}`
//         }
//         else {
//             window.location.href =  `?category=${categoryName}`
//         }
//     }
// }


// function filter(checkbox, categoryName) {
//     if (checkbox.checked) {
//         if (window.location.search) {
//             window.location.href += `&category=${categoryName}`;
//         } else {
//             window.location.href = `?category=${categoryName}`;
//         }
//     } else {
//         let currentUrl = window.location.href;
//         let newUrl = currentUrl.replace(`&category=${categoryName}`, '').replace(`category=${categoryName}`, '');
//         window.location.href = newUrl;
//     }
// }
// =========
// function filter(checkbox, categoryName) {
//     let currentUrl = window.location.href;
//     let newUrl = "";
//     console.log(`&category=${categoryName}`)
//     if (checkbox.checked) {
//         if (currentUrl.includes("?")) {
//             newUrl = `${currentUrl}&category=${categoryName}`;
//         } else {
//             newUrl = `${currentUrl}?category=${categoryName}`;
//         }
//     } else {
//         // newUrl = currentUrl.replace(`(\\?|&)category=${categoryName.split(' ').join('%20')}`, '') //.replace(`category=${categoryName}`, '');
//         let regExp = new RegExp(`(\\?|&)category=${categoryName.split(' ').join('%20')}`, 'g');
//         newUrl = currentUrl.replace(regExp, '');
//         if (currentUrl.match(regExp)[0][0] === '?') {
//             newUrl = newUrl.replace('&', '?');
//         }
//         // if (newUrl.charAt(newUrl.length-1) === "?") {
//         //     newUrl = newUrl.substring(0, newUrl.length - 1); // remove trailing '?'
//         // }
//     }
//     window.location.href = newUrl;
// }

// function sortFilter(sortBy) {
//     window.location.href = window.location.href+sortBy
// }

// =======
function isFilterApplied() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('minPrice') || urlParams.has('maxPrice');
}

document.addEventListener("DOMContentLoaded", function() {
    if (isFilterApplied()) {
        document.getElementById('clearFilterButton').style.display = 'block';
    }
    // Set checkboxes based on the categories in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriesInUrl = urlParams.getAll('category');
    console.log(categoriesInUrl)
    categoriesInUrl.forEach(categoryName => {
        const checkbox = document.getElementById(categoryName);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
});


function filter(checkbox, categoryName) {
    let currentUrl = new URL(window.location.href);
    let urlParams = new URLSearchParams(currentUrl.search);
    if (checkbox.checked) {
        urlParams.append('category', categoryName);
    } else {
        let params = urlParams.getAll('category');
        params = params.filter(param => param !== categoryName);
        urlParams.delete('category');
        params.forEach(param => urlParams.append('category', param));
    }
    currentUrl.search = urlParams.toString();
    window.location.href = currentUrl.toString();
}

function sortFilter(sortBy) {
    let currentUrl = new URL(window.location.href);
    let urlParams = new URLSearchParams(currentUrl.search);
    urlParams.set('sort', sortBy);
    currentUrl.search = urlParams.toString();
    window.location.href = currentUrl.toString();
}

//  price range
// Setup the price range slider
//  Price range
// Fetch minPrice and maxPrice values from the URL parameters
function getPriceParamsFromURL() {
    let urlParams = new URLSearchParams(window.location.search);
    let minPrice = urlParams.get('minPrice') || 0;
    let maxPrice = urlParams.get('maxPrice') || 1000;
    return [minPrice, maxPrice];
}

// Get price parameters from URL
let [initialMinPrice, initialMaxPrice] = getPriceParamsFromURL();

// Update the input values on page load
document.getElementById('input-lower').value = initialMinPrice;
document.getElementById('input-upper').value = initialMaxPrice;

var priceRange = document.getElementById('price-range');
noUiSlider.create(priceRange, {
    start: [initialMinPrice, initialMaxPrice],
    connect: true,
    range: {
        'min': 0,     // Minimum value of the range
        'max': 1000   // Maximum value of the range
    }
});

// The rest of your code remains unchanged
priceRange.noUiSlider.on('change', function(values, handle) {
    let lowerPrice = Math.round(values[0]);
    let upperPrice = Math.round(values[1]);
    
    document.getElementById('input-lower').value = lowerPrice;
    document.getElementById('input-upper').value = upperPrice;

    // Show the clear filter button
    document.getElementById('clearFilterButton').style.display = 'block';
    // Update the URL and trigger the backend to filter products based on the price range
    updatePriceInURL(lowerPrice, upperPrice);
});

function updatePriceInURL(minPrice, maxPrice) {
    let currentUrl = new URL(window.location.href);
    let urlParams = new URLSearchParams(currentUrl.search);

    urlParams.set('minPrice', minPrice);
    urlParams.set('maxPrice', maxPrice);

    currentUrl.search = urlParams.toString();
    window.location.href = currentUrl.toString();
}

document.getElementById('clearFilterButton').addEventListener('click', function(event) {
    event.preventDefault(); // prevent the default action

    // Reset the price range to its default
    priceRange.noUiSlider.set([0, 1000]);

    // Redirect to /allproducts
    window.location.href = '/allproducts';
});

