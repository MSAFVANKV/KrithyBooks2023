// function changeImg(params) {
//    let change =  document.getElementById('mainImg')
//    change.src = params
// }



// // 
// // ======= ZOOM IMAGES ==================
// $(function () {
//     $('.zoom').zoom();
//     $('.thumb').on('click', 'a', function (e) {
//       e.preventDefault();
//       var thumb = $(e.delegateTarget);
//       if (!thumb.hasClass('active')) {
//         thumb.addClass('active').siblings().removeClass('active');
//         $('.zoom')
//           .zoom({
//             url: this.href
//           })
//           .find('img').attr('src', this.href);
//       }
//     });
//   });

//   var sizes = jQuery(".product--size").find("span");
//   sizes.click(function () {
//     sizes.removeClass("active");
//     $(this).addClass("active");
//   });



//   $(document).ready(function(){
//     $(".thumbimg").click(function(){
//         var newImageSrc = $(this).attr("src");
//         $("#zoomC img").attr("src", newImageSrc);
//     });
// });


$(function () {
    // This is the initialization of the zoom for the main image
    // it may not work if the image src is changed afterwards
    $('.zoom').zoom();

    // Listening for click events on the thumbnail images
    $(".thumbimg").click(function(e){
        e.preventDefault();

        // Get the src of the thumbnail
        var newImageSrc = $(this).attr("src");

        // Change the main image src to the new one
        $("#mainImg").attr("src", newImageSrc);

        // You need to re-initialize the zoom effect on the main image
        // since its src attribute has been changed
        $('.zoom').trigger('zoom.destroy'); // remove previous zoom
        $('.zoom').zoom({ url: newImageSrc }); // add new zoom with the new image
    });
});

