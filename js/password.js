// Function to prompt for password
function promptForPassword() {
    // Prompt the user for a password
    var password = prompt("Enter the password:");

    // Check if the password is correct
    if (password !== null && password === "amerkins9743") {
        // Password is correct, allow access to the private page
        alert("Password correct! Redirecting to private page...");
        window.location.href = "backup.html";
    } else {
        // Password is incorrect or canceled, show an alert
        alert("Incorrect password. Access denied.");
    }
}

// Attach click event to the private page link
document.getElementById("privateLink").addEventListener("click", function (event) {
    // Prevent the default link behavior
    event.preventDefault();
    
    // Call the function to prompt for password
    promptForPassword();
});
