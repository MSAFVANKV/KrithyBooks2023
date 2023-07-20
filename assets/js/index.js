// // Get the message container element
const messageContainer = document.getElementById('message-container');

// Check if the message container exists
if (messageContainer) {
    // Get the message element inside the container
    const messageElement = messageContainer.querySelector('.alertes');

    // Show the message
    messageElement.style.display = 'block';

    // Set a timeout to hide the message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}
// Get the message container element
// const messageContainer = document.getElementById('message-container');

// // Check if the message container exists and if it has not been displayed before
// if (messageContainer && !sessionStorage.getItem('messageDisplayed')) {
//     // Get the message element inside the container
//     const messageElement = messageContainer.querySelector('.alertes');

//     // Show the message
//     messageElement.style.display = 'none';

//     // Set a timeout to hide the message after 5 seconds
//     setTimeout(() => {
//         messageElement.style.display = 'block';
//         // Save a flag to indicate that the message has been displayed
//         sessionStorage.setItem('messageDisplayed', 'true');
//     }, 5000);
// }
