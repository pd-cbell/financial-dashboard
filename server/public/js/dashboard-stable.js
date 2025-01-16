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
    const totalAttempted = volumeData.attempted.reduce((a, b) => a + b, 0) +
        hourlyData.reduce((a, b) => a + b.volume, 0);
    const totalSuccessful = volumeData.successful.reduce((a, b) => a + b, 0) +
        hourlyData.reduce((a, b) => a + b.volume - b.failed, 0);

    // Update Total Transactions
    document.getElementById('total-transactions').textContent = totalAttempted;

    // Update Success Rate
    const successRate = totalAttempted > 0
        ? ((totalSuccessful / totalAttempted) * 100).toFixed(2)
        : 100;
    document.getElementById('success-rate').textContent = successRate + '%';

    // Update Peak Transactions (Last Hour)
    const peakTransactions = Math.max(...volumeData.attempted);
    document.getElementById('peak-transactions').textContent = peakTransactions;
}

// Update Widgets Every Second
setInterval(updateWidgets, 1000);

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
                borderColor: 'rgba(40, 167, 69, 1)', // Green
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
    const successful = Math.floor(attempted * 0.99); // At least 99% success rate

    // Update volume data arrays
    volumeData.attempted.shift();
    volumeData.attempted.push(attempted);

    volumeData.successful.shift();
    volumeData.successful.push(successful);

    // Update the chart
    volumeChart.data.datasets[0].data = volumeData.attempted;
    volumeChart.data.datasets[1].data = volumeData.successful;
    volumeChart.update();
}

// Run the Transaction Volume Update Every Minute
setInterval(updateTransactionVolume, 60000);

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

function updateUserImpact() {
    const totalFailed = hourlyData.reduce((sum, hour) => sum + hour.failed, 0);
    const estimatedUsersImpacted = totalFailed; // Adjust ratio if needed
    document.getElementById('user-impact').textContent = estimatedUsersImpacted.toLocaleString();
}

// Update user impact every second
setInterval(updateUserImpact, 1000);

function updateActiveAlerts() {
    const alertThreshold = 50; // Example: 50 failed transactions triggers an alert
    const latestFailures = hourlyData[hourlyData.length - 1].failed;

    if (latestFailures > alertThreshold) {
        document.getElementById('active-alerts').textContent = `High Alert: ${latestFailures} Failures`;
        document.getElementById('active-alerts').style.color = 'red';
    } else {
        document.getElementById('active-alerts').textContent = 'No Active Alerts';
        document.getElementById('active-alerts').style.color = 'green';
    }
}

// Update alerts every second
setInterval(updateActiveAlerts, 1000);

// async function fetchPagerDutyIncidents() {
//     const apiKey = 'u+jwZk2Li4MXCKDhJxvQ'; // Replace with your API key
//     const url = `https://api.pagerduty.com/incidents?statuses[]=triggered&statuses[]=acknowledged&priorities[]=P1&priorities[]=P2`;

//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Token token=${apiKey}`,
//                 'Accept': 'application/vnd.pagerduty+json;version=2',
//             },
//         });

//         if (!response.ok) {
//             console.error('Failed to fetch PagerDuty incidents:', response.statusText);
//             return;
//         }

//         const data = await response.json();
//         const activeIncidents = data.incidents;

//         // Display active incidents
//         if (activeIncidents.length > 0) {
//             const incidentDetails = activeIncidents.map(
//                 incident => `#${incident.incident_number}: ${incident.title} (${incident.status})`
//             ).join(', ');

//             document.getElementById('active-alerts').textContent = `Active Incidents: ${incidentDetails}`;
//             document.getElementById('active-alerts').style.color = 'red';
//         } else {
//             document.getElementById('active-alerts').textContent = 'No Active P1/P2 Incidents';
//             document.getElementById('active-alerts').style.color = 'green';
//         }
//     } catch (error) {
//         console.error('Error fetching PagerDuty incidents:', error);
//     }
// }

// // Fetch PagerDuty incidents every minute
// setInterval(fetchPagerDutyIncidents, 60000);


// Simulate Hourly Updates for 24-Hour Data
function update24HourChart() {
    const newHour = new Date().getHours();
    const newVolume = newHour >= 8 && newHour <= 16
        ? Math.floor(Math.random() * 1000) + 3000
        : Math.floor(Math.random() * 200);
    const newFailed = Math.floor(newVolume * 0.005); // Failures as 0.5%

    // Update hourly data
    hourlyData.shift();
    hourlyData.push({ hour: `${newHour}:00`, volume: newVolume, failed: newFailed });

    // Update the chart
    hourlyTransactionsChart.data.labels = hourlyData.map(data => data.hour);
    hourlyTransactionsChart.data.datasets[0].data = hourlyData.map(data => data.volume);
    hourlyTransactionsChart.update();
}

// Run the 24-Hour Chart Update Every Hour
setInterval(update24HourChart, 3600000);

// Failure Trends Chart
const ctxFailures = document.getElementById('failure-trends-chart').getContext('2d');
const failureTrendsChart = new Chart(ctxFailures, {
    type: 'line',
    data: {
        labels: hourlyData.map(data => data.hour),
        datasets: [{
            label: 'Failed Transactions',
            data: hourlyData.map(data => data.failed),
            borderColor: 'rgba(255, 0, 0, 1)', // Red
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

// Update Failure Trends Chart Hourly
function updateFailureTrends() {
    failureTrendsChart.data.labels = hourlyData.map(data => data.hour);
    failureTrendsChart.data.datasets[0].data = hourlyData.map(data => data.failed);
    failureTrendsChart.update();
}
setInterval(updateFailureTrends, 3600000);
