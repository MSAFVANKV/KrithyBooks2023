function enablePageUpButton() {
    // Create the button
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "↑";
    btn.id = "pageUpBtn";
    btn.title = "Go to top";
    btn.onclick = function() { topFunction() };
    document.body.appendChild(btn);
    
    // Style the button
    btn.style.display = "none";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "30px";
    btn.style.zIndex = "99";
    btn.style.border = "none";
    btn.style.outline = "none";
    btn.style.backgroundColor = "#FF4031";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.padding = "10px 20px";
    btn.style.borderRadius = "50%";
    btn.style.fontSize = "18px";
    btn.style.transition = "transform 0.3s, background-color 0.3s"; // Added this line for smooth transition

    btn.onmouseover = function() { 
        btn.style.backgroundColor = "#ccc";
        btn.style.animation = "explodeEffect 0.4s forwards"; // Use the explodeEffect animation on hover
    };
    
    btn.onmouseout = function() { 
        btn.style.backgroundColor = "#FF4031";
        btn.style.animation = ""; // Reset animation
    };

    // Show or hide the button based on scroll position
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    };

    // Function to scroll to the top of the page
    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

// Inject the keyframe animation into the document
var style = document.createElement('style');
style.innerHTML = `
    @keyframes explodeEffect {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Call the function to enable the feature
enablePageUpButton();
