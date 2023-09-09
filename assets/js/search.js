// function executeSearch() {
//   var searchInput = $('#searchInput').val();
//   $.ajax({
//       url: '/search',
//       type: 'GET',
//       data: { searchInput: searchInput },
//       success: function(res) {
//           $('#productListContainer').empty(); // Remove all current products

//           var products = res.products;
//           if (products.length > 0) {
//               for (var i = 0; i < products.length; i++) {
//                   // Create card for each product
//                   var card = '<div class="d-flex justify-content-center col-lg-3 col-md-3 col-sm-6 mb-5">' +
//                     '<div class="card shadow-lg prod_card" style="width: 17rem;">' +
//                     '<div class="card card_img">' +
//                     '<a href="/products/' + products[i]._id + '">' +
//                     '<img src="/img/books/' + products[i].thumbnail + '" class="card-img-top" alt="Book Image">' +
//                     '</a>' +
//                     '</div>' +
//                     '<div class="card-body">' +
//                     '<div class="text-center">' +
//                     '<span class="card-title text-center fs-6 fw-bold text-truncate d-inline-block" style="max-width: 170px;">' + products[i].name + '</span>' +
//                     '</div>' +
//                     '<div class="d-flex">' +
//                     '<div class="m-auto gap-3">' +
//                     '<span class="card-text text-success fw-bolder fs-3">₹' + products[i].price + '</span>' +
//                     '<span class="card-text text-warning fw-bold"><del>₹' + products[i].initialPrice + '</del></span>' +
//                     '<span class="card-text text-info">' + products[i].discount + '% off</span>' +
//                     '</div>' +
//                     '</div>' +
//                     '<p class="card-text text-center">Rating: </p>' +
//                     '</div>' +
//                     '</div>' +
//                     '</div>';

//                   $('#productListContainer').append(card);
//               }
//           } else {
//               // No products found, display a message
//               var productsList = '<span class="mt-5 mb-5 d-flex justify-content-center text-danger fs">No Products Available, Check the spell !!!</span>';
//               $('#productListContainer').append(productsList);
//           }
//       },
//       error: function(err) {
//           // Handle error
//           console.error(err);
//       }
//   });
// }


// function search() {
//     var searchInput = $("#searchInput").val();
//     $.ajax({
//       url: "/search",
//       method: "get",
//       data: { searchInput: searchInput },
//       success: (res) => {
//         var data = res.products;
//         var productsList = '';
//         if(data.length > 0) {
//           data.forEach((product) => {
//             productsList += `<div class="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center mt-3 mb-4">
//             <a href="/products/${product._id}" class="text-decoration-none">
//               <div class="card shado zoom " style="width: 16rem;">
//                 <div class="">
//                   <img style="max-height: 270px; " class="card-img-top img-fluid" src="/img/books/${product.thumbnail}" alt="Book image">
//                 </div>
//                   <div class="card-body">
//                     <div class="text-center">
//                       <span class="card-title text-center fs-6 fw-bold text-truncate d-inline-block" style="max-width: 200px;">${product.name}</span>
//                     </div>
//                       <div class="d-flex">
//                         <div class="m-auto gap-3">
//                           <span class="card-text text-success fw-bolder fs-3">₹${product.price}</span>
//                           <span class="card-text text-warning fw-bold"><del>₹${product.initialPrice}</del></span>
//                           <span class="card-text">% off</span>
//                       </div>
//                       </div>
//                       <p class="text-center">Rating: </p>
//                   </div>
//               </div>
//             </a>
//           </div>`;
//           });
//         } else {
//           productsList = '<span class="mt-5 mb-5 d-flex justify-content-center text-danger fs">No Products Available, Check the spell !!!</span>';
//         }
//         // Here you would select the container where the products should be appended
//         $('#productListContainer').html(productsList);
//       },
//       error: (err) => {
//         console.error(err);
//       }
//     });
//   }
  

// function search() {
// // search area for home page
//   $(document).ready(function() {
//     $('#searchButton').click(function() {
//       var searchInput = $('#searchInput').val();
//       if (searchInput === "") {
//         alert("Please enter something to search for!");  // Show an error alert
//         return;  // Exit the function
//       }
      
//       $.ajax({
//         url: '/search?searchInput=' + searchInput,
//         type: 'GET',
//         success: function(res) {
//           $('#productListContainer').empty(); // Remove all current products

//           if (res.success === false) {
//             // No products found. Display error message.
//             var errorMessage = '<span class="mt-5 mb-5 d-flex justify-content-center text-danger fs">' + res.message + '</span>';
//             $('#productListContainer').append(errorMessage);
//             return;
//           }

//           var products = res.products;
//           if (products.length > 0) {
//             for (var i = 0; i < products.length; i++) {
//               // Create card for each product
//               var card = '<div class="d-flex justify-content-center col-lg-3 col-md-3 col-sm-6 mb-5">' +
//                 '<div class="card shadow-lg prod_card" style="width: 17rem; ">' +
//                   '<div class="card card_img">' +
//                     '<a href="/products/' + products[i]._id + '">' +
//                       '<img src="/img/books/' + products[i].thumbnail + '" class="card-img-top" alt="Book Image">' +
//                     '</a>' +
//                   '</div>' +
//                   '<div class="card-body">' +
//                     '<div class="text-center">' +
//                       '<span class="card-title text-center fs-6 fw-bold text-truncate d-inline-block" style="max-width: 170px;">' + products[i].name + '</span>' +
//                     '</div>' +
//                     '<div class="d-flex">' +
//                       '<div class="m-auto gap-3">' +
//                         '<span class="card-text text-success fw-bolder fs-3">₹' + products[i].price + '</span>' +
//                         '<span class="card-text text-warning fw-bold"><del>₹' + products[i].initialPrice + '</del></span>' +
//                         '<span class="card-text text-info">' + products[i].discount + '% off</span>' +
//                       '</div>' +
//                     '</div>' +
//                     '<p class="card-text text-center">Rating: </p>' +
//                   '</div>' +
//                 '</div>' +
//               '</div>';

//               $('#productListContainer').append(card);
//             }
//           } else {
//             var productsList = '<span class="mt-5 mb-5 d-flex justify-content-center text-danger fs">No Products Available, Check the spell !!!</span>';
//             $('#productListContainer').append(productsList);
//         }
//         },
//         error: function(err) {
//           // Handle error
//           console.error(err);
//         }
//       });
//     });
//   });

// }

function search() {
  var searchInput = $('#searchInput').val();

  if (searchInput === "") {
        // Show an error alert
      return false;  // Exit the function
  } else{
  
  $.ajax({
      url: '/search?searchInput=' + searchInput,
      type: 'GET',
      success: function(res) {
          $('#productListContainer').empty(); // Remove all current products

          if (res.success === false) {
              // No products found. Display error message.
              var errorMessage = '<span class="mt-5 mb-5 d-flex justify-content-center text-danger fs">' + res.message + '</span>';
              $('#productListContainer').append(errorMessage);
              return;
          }

      },
      error: function(err) {
          // Handle error
          console.error(err);
      }
    
  });
  return true
}
}

//   `<div class="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center mt-3 mb-4">
//               <a href="/products/${products[i]._id}" class="text-decoration-none">
//                 <div class="card shado zoom " style="width: 16rem;">
//                   <div class="">
//                     <img style="max-height: 200px; " class="card-img-top img-fluid" src="/img/books/${products[i].thumbnail}" alt="Book image">
//                   </div>
//                     <div class="card-body">
//                       <div class="text-center">
//                         <span class="card-title text-center fs-6 fw-bold text-truncate d-inline-block" style="max-width: 200px;">${products[i].name}</span>
//                       </div>
//                         <div class="d-flex">
//                           <div class="m-auto gap-3">
//                             <span class="card-text text-success fw-bolder fs-3">₹${products[i].price}</span>
//                             <span class="card-text text-warning fw-bold"><del>₹${products[i].initialPrice}</del></span>
//                             <span class="card-text">% off</span>
//                         </div>
//                         </div>
//                         <p class="text-center">Rating: </p>
//                     </div>
//                 </div>
//               </a>
//             </div>`;