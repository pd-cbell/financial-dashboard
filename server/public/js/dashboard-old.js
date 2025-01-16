// Simulated Hourly Data (Last 8 Hours)
const hourlyData = [
    { hour: '10 AM', revenue: 760000, transactions: 7600, failed: Math.floor(7600 * 0.01) },
    { hour: '11 AM', revenue: 800000, transactions: 8000, failed: Math.floor(8000 * 0.01) },
    { hour: '12 PM', revenue: 700000, transactions: 7000, failed: Math.floor(7000 * 0.01) },
    { hour: '1 PM', revenue: 800000, transactions: 8000, failed: Math.floor(8000 * 0.01) },
    { hour: '2 PM', revenue: 810000, transactions: 8100, failed: Math.floor(8100 * 0.01) },
    { hour: '3 PM', revenue: 820000, transactions: 8200, failed: Math.floor(8200 * 0.01) },
    { hour: '4 PM', revenue: 790000, transactions: 7900, failed: Math.floor(7900 * 0.01) },
    { hour: '5 PM', revenue: 800000, transactions: 8000, failed: Math.floor(8000 * 0.01) },
];


// Metrics for widgets
let totalRevenue = hourlyData.reduce((sum, data) => sum + data.revenue, 0);
let totalTransactions = hourlyData.reduce((sum, data) => sum + data.transactions, 0);
let successRate = ((totalTransactions - 500) / totalTransactions * 100).toFixed(2);

// Update Metrics on Widgets
document.getElementById('total-transactions').textContent = totalTransactions;
document.getElementById('success-rate').textContent = successRate + '%';
// document.getElementById('revenue').textContent = '$' + (totalRevenue / 1000).toFixed(1) + 'K';

// Volume Data for Last Hour
const volumeData = {
    labels: Array.from({ length: 60 }, (_, i) => `${60 - i}m ago`), // 60m ago to Now
    attempted: Array(60).fill(0),
    successful: Array(60).fill(0),
};

// Transaction Volume Graph
const ctxVolume = document.getElementById('volume-chart').getContext('2d');
const volumeChart = new Chart(ctxVolume, {
    type: 'line',
    data: {
        labels: volumeData.labels,
        datasets: [
            {
                label: 'Attempted Transactions',
                data: volumeData.attempted,
                borderColor: 'rgba(0, 123, 255, 1)',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Successful Transactions',
                data: volumeData.successful,
                borderColor: 'rgba(40, 167, 69, 1)',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true },
        },
    },
});

// Simulate Real-Time Data
function updateTransactionVolume() {
    const attempted = Math.floor(Math.random() * (150 - 75 + 1)) + 75;
    const successful = attempted - Math.floor(Math.random() * 10); // Simulate 0-9 failures

    // Update volume data arrays
    volumeData.attempted.shift();
    volumeData.attempted.push(attempted);

    volumeData.successful.shift();
    volumeData.successful.push(successful);

    // Update graph
    volumeChart.data.datasets[0].data = volumeData.attempted;
    volumeChart.data.datasets[1].data = volumeData.successful;
    volumeChart.update();

    // Update successful transactions widget
    const totalAttempted = volumeData.attempted.reduce((a, b) => a + b, 0);
    const totalSuccessful = volumeData.successful.reduce((a, b) => a + b, 0);
    document.getElementById('success-rate').textContent = (
        (totalSuccessful / totalAttempted) * 100
    ).toFixed(2) + '%';
}

// Populate Graph with Initial Data
for (let i = 0; i < 60; i++) {
    updateTransactionVolume();
}

// Hourly Revenue Chart Initialization
const ctxRevenue = document.getElementById('revenue-chart').getContext('2d');
const revenueChart = new Chart(ctxRevenue, {
    type: 'bar',
    data: {
        labels: hourlyData.map(data => data.hour),
        datasets: [{
            label: 'Hourly Revenue',
            data: hourlyData.map(data => data.revenue),
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString(); // Format as currency
                    }
                }
            }
        },
    },
});

// Hourly Transactions Chart Initialization
const ctxTransactions = document.getElementById('transactions-chart').getContext('2d');
const transactionsChart = new Chart(ctxTransactions, {
    type: 'line',
    data: {
        labels: hourlyData.map(data => data.hour),
        datasets: [
            {
                label: 'Hourly Transactions',
                data: hourlyData.map(data => data.transactions),
                borderColor: 'rgba(40, 167, 69, 1)', // Green line for successful transactions
                backgroundColor: 'rgba(40, 167, 69, 0.2)', // Light green fill
                borderWidth: 2,
                fill: true, // Fill area under the line
            },
            {
                label: 'Failed Transactions',
                data: hourlyData.map(data => data.failed),
                borderColor: 'rgba(255, 0, 0, 1)', // Red line for failed transactions
                borderWidth: 2,
                fill: false, // No fill for failed transactions
            },
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            }
        },
    },
});

function updateHourlyCharts() {
    // Simulate new hourly data
    const newRevenue = Math.floor(Math.random() * (850000 - 700000 + 1)) + 700000; // Random revenue
    const newTransactions = Math.floor(newRevenue / 100); // Assume $100 per transaction
    const newFailed = Math.floor(newTransactions * (Math.random() * 0.01)); // 0.5%-1% failed

    hourlyData.shift(); // Remove the oldest hour
    hourlyData.push({
        hour: `${new Date().getHours()} ${new Date().getHours() >= 12 ? 'PM' : 'AM'}`,
        revenue: newRevenue,
        transactions: newTransactions,
        failed: newFailed,
    });

    // Update the Transactions Chart
    transactionsChart.data.labels = hourlyData.map(data => data.hour);
    transactionsChart.data.datasets[0].data = hourlyData.map(data => data.transactions);
    transactionsChart.data.datasets[1].data = hourlyData.map(data => data.failed);
    transactionsChart.update();

    // Update the Revenue Chart
    revenueChart.data.labels = hourlyData.map(data => data.hour);
    revenueChart.data.datasets[0].data = hourlyData.map(data => data.revenue);
    revenueChart.update();
}

function updateWidgets() {
    // Calculate totals from volumeData (current hour) and hourlyData (historical)
    const totalAttempted = volumeData.attempted.reduce((a, b) => a + b, 0) +
                           hourlyData.reduce((a, b) => a + b.transactions, 0);

    const totalSuccessful = volumeData.successful.reduce((a, b) => a + b, 0) +
                            hourlyData.reduce((a, b) => a + b.transactions - b.failed, 0);

    // Update Total Transactions
    document.getElementById('total-transactions').textContent = totalAttempted;

    // Update Success Rate (handle cases where totalAttempted is 0)
    const successRate = totalAttempted > 0
        ? ((totalSuccessful / totalAttempted) * 100).toFixed(2)
        : 100; // Default to 100% if no transactions have occurred
    document.getElementById('success-rate').textContent = successRate + '%';
}

// Run the widget updates every second
setInterval(updateWidgets, 1000);

// Update hourly charts every hour
setInterval(updateHourlyCharts, 3600000); // Every 1 hour

// Update Data Every Minute
setInterval(updateTransactionVolume, 60000); // Update every 60 seconds
