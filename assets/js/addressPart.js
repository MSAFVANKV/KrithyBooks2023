document.querySelectorAll('.edit-btn').forEach((editBtn, i) => {
    editBtn.addEventListener('click', () => {
        // Find the parent 'address' div
        const addressDiv = editBtn.parentElement.parentElement;
        // Find the textarea within this address div
        const textarea = addressDiv.querySelector('textarea');
        // Enable the textarea
        textarea.disabled = false;

        // Find the 'set as default' checkbox within this address div
        const defaultCheck = addressDiv.querySelector('.form-check-input');
        // Enable the 'set as default' checkbox
        defaultCheck.disabled = false;

        // Show 'Save' and 'Cancel' buttons, hide 'Edit'
        editBtn.style.display = 'none';
        addressDiv.querySelector('.save-btn').style.display = 'inline-block';
        addressDiv.querySelector('.cancel-btn').style.display = 'inline-block';
    });
});

document.querySelectorAll('.cancel-btn').forEach((cancelBtn, i) => {
    cancelBtn.addEventListener('click', () => {
        // Find the parent 'address' div
        const addressDiv = cancelBtn.parentElement.parentElement;
        // Find the textarea within this address div
        const textarea = addressDiv.querySelector('textarea');
        // Disable the textarea
        textarea.disabled = true;

        // Find the 'set as default' checkbox within this address div
        const defaultCheck = addressDiv.querySelector('.form-check-input');
        // Disable the 'set as default' checkbox
        defaultCheck.disabled = true;

        // Show 'Edit' button, hide 'Save' and 'Cancel'
        cancelBtn.style.display = 'none';
        cancelBtn.previousElementSibling.style.display = 'none';
        addressDiv.querySelector('.edit-btn').style.display = 'inline';
    });
});

// ===================================================================================
// address add successs message============ sweet alert                             //|
                                                                                    //|
                                                                                    document.addEventListener('DOMContentLoaded', (event) => { //|
    const urlParams = new URLSearchParams(window.location.search);
    const addressAdded = urlParams.get('addressAdded');
    const addressEdited = urlParams.get('addressEdited');

    if (addressAdded) {
        Swal.fire({
            icon: 'success',
            title: 'Address added successfully',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Remove 'addressAdded' query param
            urlParams.delete('addressAdded');
            // Change the URL without reloading the page
            window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
        });
    }

    if (addressEdited) {
        Swal.fire({
            icon: 'success',
            title: 'Address edited successfully',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Remove 'addressEdited' query param
            urlParams.delete('addressEdited');
            // Change the URL without reloading the page
            window.history.replaceState({}, '', `${location.pathname}?${urlParams}`);
        });
    }
});





  // 'Delete' click events
// document.addEventListener('click', event => {
//     if (event.target.matches('.delete-btn')) {
//         const addressID = event.target.dataset.id;

//         fetch('/users/profile/manageAddress/addressDelete', {
//             method: 'DELETE',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify({addressID})
//         }).then(() => {
//             window.location.reload();
//         });
//     }
// });



document.addEventListener('click', event => {
    if (event.target.matches('.delete-btn')) {
        const addressID = event.target.dataset.id;
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/users/profile/manageAddress/addressDelete', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({addressID})
                }).then(() => {
                    Swal.fire(
                        'Deleted!',
                        'Your address has been deleted.',
                        'success'
                    ).then(() => {
                        window.location.reload();
                    });
                });
            }
        })
    }
});



// ===============================
// 
document.addEventListener('click', event => {
    if (event.target.matches('.save-btn')) {
        const addressID = event.target.dataset.id;

        // Find the parent 'address' div
        const addressDiv = event.target.parentElement.parentElement;

        // Get the textarea within this address div
        const textarea = addressDiv.querySelector('textarea');

        // Get the updated address fields from the textarea
        const [building, address, pincode, country, contactNumber] = textarea.value.split('\n');

        // Validate the contactNumber
        if (contactNumber.length !== 10 || contactNumber.charAt(0) === '0') {
            alert("Please enter a contact number with exactly 10 digits and it should not start with 0");
            return;  // Don't send the fetch request if validation fails
        }
        // if(pincode!==number){
        //     alert("pincode should be number")
        // }
        // Prepare the updated address data
        const updatedAddress = {
            addressID, // Include the address ID
            building,
            address,
            pincode,
            country,
            contactNumber
        };

        fetch('/users/profile/manageAddress/editAddress', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedAddress) // Send the updated address data
        }).then(() => {
            window.location.reload();
        });
    }
});
