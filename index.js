// Code Challenge: Task 1 - Internet Speed Test
// Import required Node.js modules
const https = require("https");
const http = require("http");

// Function to check internet connection condition
function checkConnectionCondition(uri) {
    return new Promise((resolve) => {
        // Use either the `https` or `http` module based on the URI protocol
        const client = uri.startsWith("https") ? https : http;

        // Record the start time of the request
        const startTime = process.hrtime();

        // Variable to track if a response was received
        let receivedResponse = false;

        // Create the request and handle the response
        const req = client.get(uri, (res) => {
            // Calculate elapsed time since the request was made
            const elapsed = process.hrtime(startTime);
            const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6;

            receivedResponse = true;

            // Determine the response condition based on elapsed time
            if (elapsedMs < 500) {
                resolve("good");
            } else {
                resolve("fine");
            }

            // Close the request
            res.destroy();
        });

        // Set a timeout for the request to detect unresponsiveness
        req.setTimeout(5000, () => {
            if (!receivedResponse) {
                resolve("terrible");
            }

            // Destroy the request as it took too long
            req.destroy();
        });

        // Handle errors (e.g., network issues, DNS resolution failures)
        req.on("error", () => {
            resolve("terrible");
        });
    });
}

// Example usage
checkConnectionCondition("https://www.baidu.com").then((result) =>
    console.log(`Connection condition: ${result}`),
);
