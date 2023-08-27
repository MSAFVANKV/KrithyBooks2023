function checkCoupon(e){
    e.preventDefault()


$.ajax({
    url: "/users/cart/checkout",
    method: "put",
    data: {
        couponCode: $("#couponCode").val(),
      },
      success:(res)=>{
      $("#couponMessage").html(res.data.couponCheck);
      $("#couponDiscount").html(res.data.discountPrice);
      $("#inputCouponDiscount").val(res.data.discountPrice);
      $("#finalPrice").html(res.data.finalPrice);
      $("#inputFinalPrice").val(res.data.finalPrice);
      $("#offer").load(location.href + " #offer");
      }
})

}


function payment(e){
    e.preventDefault()
    let form=e.target.form;
    let formData=$("#formID").serialize()
  const chekcedVal=$(".form-check-input:checked").val();
    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `Proceed to Payment?`+"</h5>",
        showCancelButton: true,
        background:'#19191a',
          iconColor:'blue',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result)=>{
        if(result.value){  
            if(chekcedVal=="RazorPay"){
                $.ajax({
                    url:"/users/cart/checkout",
                    method:"post",
                    data:formData,
                    success: (res)=>{
                        console.log(res)
                        var options = {
                            "key": res.key, // Enter the Key ID generated from the Dashboard
                           
                            "name": "KRITHY BOOKS", //your business name
                            "description": "Complete Your Payment",
                            "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794",
                            "order_id":res.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "callback_url": `/users/cart/checkout/${res.transactionID}`,
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp1 = new Razorpay(options);
                        
                            rzp1.open();
                            
                        

                    }
                })

            }else{
                form.submit()
            }
            
                
        }
    })
}