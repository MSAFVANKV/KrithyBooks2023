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

document.addEventListener("DOMContentLoaded", function() {
    // Set checkboxes based on the categories in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriesInUrl = urlParams.getAll('category');

    categoriesInUrl.forEach(categoryName => {
        const checkbox = document.getElementById(categoryName);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
});

function filter(checkbox, categoryName) {
    let currentUrl = window.location.href;
    let newUrl = "";

    if (checkbox.checked) {
        if (currentUrl.includes("?")) {
            newUrl = `${currentUrl}&category=${categoryName}`;
        } else {
            newUrl = `${currentUrl}?category=${categoryName}`;
        }
    } else {
        newUrl = currentUrl.replace(`&category=${categoryName}`, '') //.replace(`category=${categoryName}`, '');
        if (newUrl.charAt(newUrl.length-1) === "?") {
            newUrl = newUrl.substring(0, newUrl.length - 1); // remove trailing '?'
        }
    }
    window.location.href = newUrl;
}
