function saveToFile() {
    // Get user input
    var responseInput = document.getElementById('responseInput');
    var response = responseInput.value;

    // Check if there's content to save
    if (response.trim() !== '') {
        // Create a Blob with the user's response
        var blob = new Blob([response], { type: 'text/plain' });

        // Create a link element
        var a = document.createElement('a');

        // Create a URL for the Blob
        var url = window.URL.createObjectURL(blob);

        // Set the link's href attribute to the URL of the Blob
        a.href = url;

        // Set the download attribute to specify the file name
        a.download = 'user_response.txt';

        // Append the link to the document
        document.body.appendChild(a);

        // Click the link to trigger the download
        a.click();

        // Remove the link from the document
        document.body.removeChild(a);

        // Release the URL resource
        window.URL.revokeObjectURL(url);

        // Clear the textarea
        responseInput.value = '';
    } else {
        alert('Please enter a response before submitting.');
    }
}
