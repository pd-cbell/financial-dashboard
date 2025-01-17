// Real-Time Data for Last 60 Minutes
const volumeData = {
    labels: Array.from({ length: 60 }, (_, i) => `${60 - i}m ago`).reverse(),
    attempted: Array(60).fill(0),
    successful: Array(60).fill(0),
};

// Historical Data for Last 24 Hours
const hourlyData = Array(24).fill(0).map((_, hour) => {
    const volume = hour >= 8 && hour <= 16 ? Math.floor(Math.random() * 1000) + 3000 : Math.floor(Math.random() * 200);
    return { hour: `${hour}:00`, volume, failed: Math.floor(volume * 0.005) }; // Failures as 0.5%
});

// Initialize Widgets
function updateWidgets() {
    const totalAttempted = Math.round(volumeData.attempted.reduce((a, b) => a + b, 0) +
        hourlyData.reduce((a, b) => a + b.volume, 0));
    const totalSuccessful = Math.round(volumeData.successful.reduce((a, b) => a + b, 0) +
        hourlyData.reduce((a, b) => a + b.volume - b.failed, 0));
    const totalFailed = Math.round(totalAttempted - totalSuccessful);

    // Update Total Transactions
    document.getElementById('total-transactions').textContent = totalAttempted;

    // Update Success Rate
    const successRateElement = document.getElementById('success-rate');
    successRateElement.textContent = highLoadActive ? '85%' : '99%';
    successRateElement.style.color = highLoadActive ? 'red' : 'black';

    // Update Peak Transactions (Last Hour)
    const peakTransactions = Math.round(Math.max(...volumeData.attempted));
    document.getElementById('peak-transactions').textContent = peakTransactions;

    // Update Users Impacted
    const usersImpactedElement = document.getElementById('users-impacted');
    usersImpactedElement.textContent = highLoadActive ? totalFailed : 0;
    usersImpactedElement.style.color = totalFailed > 100 && highLoadActive ? 'red' : 'black';
}

// Update Widgets Every 5 Seconds
setInterval(updateWidgets, 5000);

// High-Load Toggle Logic
// const dashboardHighLoadToggle = document.getElementById('dashboard-high-load-toggle');

// Select the header element
const dashboardHeader = document.querySelector('header');
let highLoadActive = false;

// Function to toggle High Load Mode
function toggleHighLoad() {
    highLoadActive = !highLoadActive;

    if (highLoadActive) {
        // Activate high load mode
        dashboardHeader.style.backgroundColor = '#0056b3'; // Darker blue
        applyHighLoad();
    } else {
        // Deactivate high load mode
        dashboardHeader.style.backgroundColor = '#007bff'; // Default blue
        restoreNormalLoad();
    }
}

// Apply high load scenario
function applyHighLoad() {
    const totalTransactions = 600; // Example spike
    const failedTransactions = Math.floor(totalTransactions * 0.15); // 15% failure rate
    const successfulTransactions = totalTransactions - failedTransactions;

    for (let i = 0; i < 15; i++) {
        const spike = totalTransactions / 60;
        volumeData.attempted[volumeData.attempted.length - 1 - i] = spike;
        volumeData.successful[volumeData.successful.length - 1 - i] = spike * 0.85;
    }

    for (let i = hourlyData.length - 3; i < hourlyData.length; i++) {
        hourlyData[i].volume = totalTransactions;
        hourlyData[i].failed = failedTransactions;
    }

    updateFailureTrends();
    update24HourChart();
    volumeChart.update();
    updateWidgets();
}

// Restore normal operation
function restoreNormalLoad() {
    hourlyData.forEach((data) => {
        data.failed = Math.floor(data.volume * 0.005);
    });

    volumeData.attempted = volumeData.attempted.map(() => Math.floor(Math.random() * 150) + 75);
    volumeData.successful = volumeData.attempted.map((attempted) => Math.floor(attempted * 0.99));

    updateFailureTrends();
    update24HourChart();
    volumeChart.update();
    updateWidgets();
}

// Attach click event to the header
dashboardHeader.addEventListener('click', toggleHighLoad);

// Last 60 Minutes Transaction Volume Chart
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
                label: 'Failed Transactions',
                data: volumeData.attempted.map((attempted, index) => attempted - volumeData.successful[index]),
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
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

// Simulate Real-Time Data for Last 60 Minutes
function updateTransactionVolume() {
    let baseAttempted = Math.floor(Math.random() * (150 - 75 + 1)) + 75; // Normal traffic range
    let attempted, successful, failed;

    if (highLoadActive) {
        attempted = baseAttempted * 4; // 4x transaction volume increase under high load
        successful = Math.floor(attempted * 0.85); // 85% success rate
    } else {
        attempted = baseAttempted;
        successful = Math.floor(attempted * 0.99); // Normal 99% success rate
    }

    failed = attempted - successful; // Calculate failed transactions

    volumeData.attempted.shift();
    volumeData.attempted.push(attempted);

    volumeData.successful.shift();
    volumeData.successful.push(successful);

    // Update Peak Transactions to reflect increased activity
    const peakTransactions = Math.max(...volumeData.attempted);
    document.getElementById('peak-transactions').textContent = peakTransactions > 1000 ? peakTransactions : 1000;

    // Update the chart with new attempted and failed transaction values
    volumeChart.data.datasets[0].data = volumeData.attempted;
    volumeChart.data.datasets[1].data = volumeData.attempted.map((attempted, index) => attempted - volumeData.successful[index]);
    volumeChart.update();
}

// Run the Transaction Volume Update Every 5 Seconds
setInterval(updateTransactionVolume, 5000);

// Run the Transaction Volume Update Every 5 Seconds
setInterval(updateTransactionVolume, 5000);
// 24-Hour Transactions Chart
const ctx24Hour = document.getElementById('hourly-transactions-chart').getContext('2d');
const hourlyTransactionsChart = new Chart(ctx24Hour, {
    type: 'bar',
    data: {
        labels: hourlyData.map(data => data.hour),
        datasets: [{
            label: 'Transactions per Hour',
            data: hourlyData.map(data => data.volume),
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true },
        },
    },
});

// Failure Trends Chart
const ctxFailures = document.getElementById('failure-trends-chart').getContext('2d');
const failureTrendsChart = new Chart(ctxFailures, {
    type: 'line',
    data: {
        labels: hourlyData.map(data => data.hour),
        datasets: [{
            label: 'Failed Transactions',
            data: hourlyData.map(data => data.failed),
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true },
        },
    },
});

// Update Failure Trends Chart Every 5 Seconds
function updateFailureTrends() {
    failureTrendsChart.data.labels = hourlyData.map(data => data.hour);
    failureTrendsChart.data.datasets[0].data = hourlyData.map(data => data.failed);
    failureTrendsChart.update();
}
setInterval(updateFailureTrends, 5000);