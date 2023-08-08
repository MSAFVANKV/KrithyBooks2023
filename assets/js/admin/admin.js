//prodcut
function editConfirmation(e,itemName) {
    e.preventDefault();
    const name=itemName
  
    var url = e.currentTarget.getAttribute('href')
    
    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `You want to edit ${name} ?`+"</h5>",
        showCancelButton: true,
        background:'#19191a',
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
    
  
    $(document).ready(function() {
        $('#dataTable').DataTable({
            responsive: true,
            rowReorder: {
                selector: "td:nth-child(2)"
            },
            "bDestroy": true,
        });
    });

