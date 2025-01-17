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
    successRateElement.textContent = dashboardHighLoadToggle.checked ? '85%' : '99%';
    successRateElement.style.color = dashboardHighLoadToggle.checked ? 'red' : 'black';

    // Update Peak Transactions (Last Hour)
    const peakTransactions = Math.round(Math.max(...volumeData.attempted));
    document.getElementById('peak-transactions').textContent = peakTransactions;

    // Update Users Impacted
    const usersImpactedElement = document.getElementById('users-impacted');
    usersImpactedElement.textContent = dashboardHighLoadToggle.checked ? totalFailed : 0;
    usersImpactedElement.style.color = totalFailed > 100 && dashboardHighLoadToggle.checked ? 'red' : 'black';
}

// Update Widgets Every 5 Seconds
setInterval(updateWidgets, 5000);

// High-Load Toggle Logic
const dashboardHighLoadToggle = document.getElementById('dashboard-high-load-toggle');

dashboardHighLoadToggle.addEventListener('change', () => {
    if (dashboardHighLoadToggle.checked) {
        // High-load scenario
        const totalTransactions = 600; // Example spike
        const failedTransactions = Math.floor(totalTransactions * 0.15); // 15% failure rate
        const successfulTransactions = totalTransactions - failedTransactions;

        // Inject failures into volumeData for the last 15 minutes
        for (let i = 0; i < 15; i++) {
            const spike = totalTransactions / 60;
            volumeData.attempted[volumeData.attempted.length - 1 - i] = spike;
            volumeData.successful[volumeData.successful.length - 1 - i] = spike * 0.85;
        }

        // Update hourly data for high load
        for (let i = hourlyData.length - 3; i < hourlyData.length; i++) {
            hourlyData[i].volume = totalTransactions;
            hourlyData[i].failed = failedTransactions;
        }

        updateFailureTrends();
        update24HourChart();
        volumeChart.update();
    } else {
        // Restore normal operation
        hourlyData.forEach((data) => {
            data.failed = Math.floor(data.volume * 0.005); // Reset failure rate to 0.5%
        });

        volumeData.attempted = volumeData.attempted.map(() => Math.floor(Math.random() * 150) + 75);
        volumeData.successful = volumeData.attempted.map((attempted) => Math.floor(attempted * 0.99));

        updateFailureTrends();
        update24HourChart();
        volumeChart.update();
    }
});

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

// Simulate Real-Time Data for Last 60 Minutes
function updateTransactionVolume() {
    const attempted = Math.floor(Math.random() * (150 - 75 + 1)) + 75;
    const successful = Math.floor(attempted * 0.99);

    volumeData.attempted.shift();
    volumeData.attempted.push(attempted);

    volumeData.successful.shift();
    volumeData.successful.push(successful);

    volumeChart.data.datasets[0].data = volumeData.attempted;
    volumeChart.data.datasets[1].data = volumeData.successful;
    volumeChart.update();
}

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