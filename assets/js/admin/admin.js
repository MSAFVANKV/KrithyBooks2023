function editConfirmation(e,itemName) {
  e.preventDefault();
  const name=itemName

  var url = e.currentTarget.getAttribute('href')
  
  Swal.fire({
      icon: 'question',
      title:"<h5 style=color='white'>"+ `You want to edit ${name} ?`+"</h5>",
      showCancelButton: true,
      background:'white',
        iconColor:'blue',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
  }).then((result) => {
      if (result.value) {
          window.location.href=url;
      }
  })
}
  //prodcut
  function changeListing(e,itemName) {
    e.preventDefault();
    const name=itemName
  
    var url = e.currentTarget.getAttribute('href')
    
    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `Proceed to change listing of  ${name} ?`+"</h5>",
        showCancelButton: true,
        background:'white',
          iconColor:'blue',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            window.location.href=url;
        }
    })
  }
  
  function editProduct(e,itemName) {
    e.preventDefault();
    const name=itemName
  
    var url = e.currentTarget.getAttribute('href')
    
    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `Proceed to edit  ${name} ?`+"</h5>",
        showCancelButton: true,
        background:'white',
        iconColor:'blue',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            window.location.href=url;
        }
    })
  }
    
  // Customers
function changeAccess(id, access) {
    $.ajax({
      url: "/admin/customers",
      type: "patch",
      data: {
        userID: id,
        currentAccess: access,
      },
      success: (res) => {
        $("#" + id).load(location.href + " #" + id);
      },
    });
  }
  
    // $(document).ready(function() {
    //     $('#dataTable').DataTable({
    //         responsive: true,
    //         rowReorder: {
    //             selector: "td:nth-child(2)"
    //         },
    //         "bDestroy": true,
    //     });
    // });


//orders =============================
function deliverOrder(id, i) {
  $.ajax({
    url: "/admin/order",
    type: "patch",
    data: {
      orderID: id,
    },
    success: (res) => {
      if (res.data.delivered === 1) {
        $("#deliver" + i).load(location.href + " #deliver" + i);
      }
    },
  });
}

function cancelOrder(id){

  Swal.fire({
      icon: 'question',
      title:"<h5 style=color='white'>"+ `Proceed to cancel order?`+"</h5>",
      showCancelButton: true,
      background:'#19191a',
        iconColor:'blue',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
  }).then((result) => {
      if (result.value) {
          
          $.ajax({
              url:"/admin/order/"+id,
              method:"patch",
              success:(res)=>{
                  if(res.success=== "cancelled"){
                      $("#orderDetails").load(location.href + " #orderDetails");
                      Swal.fire({
                          toast: true,
                          icon: "success",
                          position: "top-right",
                          showConfirmButton: false,
                          timer: 1000,
                          timerProgressBar: true,
                          animation: true,
                          title: "Order cancelled",
                        });
                        setTimeout(() => {
                          location.reload();
                      }, 2000);
                  }
              }
          })
      }
  })
 
}


function returnOrder(id, i) {
  $.ajax({
    url: "/admin/order",
    type: "put",
    data: {
      orderID: id,
    },
    success: (res) => {
      if (res.data.returned === 1) {
        $("#deliver" + i).load(location.href + " #deliver" + i);
      }
    },
  });
}

function printInvoice(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}

// product manager
function changeManagerAccess(id, access) {
  $.ajax({
    url: "/admin/productManager_management",
    type: "patch",
    data: {
      managerID: id,
      currentAccess: access,
    },
    success: (res) => {
      $("#" + id).load(location.href + " #" + id);
    },
  });
}

function deleteManager(id) {
  Swal.fire({
    icon: 'question',
    title:"<h5 style=color='white'>"+ `Proceed to delete ?`+"</h5>",
    showCancelButton: true,
    background:'#19191a',
      iconColor:'blue',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: "/admin/productManager_management/"+id,
        type: "delete",
        success: (res) => {
          $("#managerTable").load(location.href + " #managerTable");
        },
      });
    }
  })

}

// =================================


    $(function () {
        var table=  $("#dataTable").DataTable({
            rowReorder: {
              selector: "td:nth-child(2)",
            },
            responsive: true,
            "bDestroy": true,
          });
          // new $.fn.dataTable.FixedHeader( table );
        });


