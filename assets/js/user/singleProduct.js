function addToWishlist(productId){
    $.ajax({
        url:"/users/profile/wishlist",
        method:"patch",
        data:{
            id:productId
        },
        success:(res)=>{
            if (res.data.added === 0) {
                $("#wishlistHeart").html('<i class="fa fs-5 fa-heart text-black">');
                Swal.fire({
                  toast: true,
                  icon: "error",
                  position: "top-right",
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  animation: true,
                  title: "Removed from wishlist",
                });
              } else if (res.data.added === 1) {
                $("#wishlistHeart").html('<i class="fa fs-4 fa-heart text-danger">');
                Swal.fire({
                  toast: true,
                  icon: "success",
                  position: "top-right",
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  animation: true,
                  title: "Added to wishlist",
                });
              } else {
                window.location.href = "/login";
              }

        }
    })
}


  // cart
  function addToCart(productID) {
    $.ajax({
      url: "/users/profile/cartItems",
      method: "post",
      data: {
        id: productID,
      },
      success: (res) => {
       
        if (res.success == "countAdded" || res.success == "addedToCart") {
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            animation: true,
            title: "Count added in cart",
          });
          $("#cartCount").load(location.href + " #cartCount");
        } else if (res.success == "addedToCart") {
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            animation: true,
            title: "Added to cart",
          });
          $("#cartCount").load(location.href + " #cartCount");
        }else if(res.success === "outofstcok" ){
          Swal.fire({
            toast: true,
            icon: "error",
            position: "top-right",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            animation: true,
            title: "Out Of Stock",
          });
        }
         else {
          window.location.href = "/login";
        }
      },
    });
  }
