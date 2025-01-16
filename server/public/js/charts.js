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

// 24-Hour Transactions Chart with Failure Trends Overlay
document.addEventListener('DOMContentLoaded', () => {
    const ctxCombined = document.getElementById('combined-chart').getContext('2d');

    const combinedChart = new Chart(ctxCombined, {
        type: 'bar',
        data: {
            labels: hourlyData.map(data => data.hour),
            datasets: [
                {
                    label: 'Successful Transactions',
                    data: hourlyData.map(data => data.volume - data.failed),
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y-axis-left',
                },
                {
                    label: 'Failed Transactions',
                    data: hourlyData.map(data => data.failed),
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 2,
                    fill: false,
                    type: 'line',
                    yAxisID: 'y-axis-right',
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                'y-axis-left': {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Successful Transactions',
                    },
                },
                'y-axis-right': {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Failed Transactions',
                    },
                },
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 12,
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                },
            },
        },
    });
});


// Function to Update the Combined Chart
function updateCombinedChart() {
    const newHour = new Date().getHours();
    const newVolume = newHour >= 8 && newHour <= 16
        ? Math.floor(Math.random() * 1000) + 3000
        : Math.floor(Math.random() * 200);
    const newFailed = Math.floor(newVolume * 0.005); // Failures as 0.5%

    // Update hourly data
    hourlyData.shift(); // Remove the oldest hour
    hourlyData.push({ hour: `${newHour}:00`, volume: newVolume, failed: newFailed }); // Add the new hour

    // Update the combined chart with new data
    combinedChart.data.labels = hourlyData.map(data => data.hour); // Update X-axis labels
    combinedChart.data.datasets[0].data = hourlyData.map(data => data.volume - data.failed); // Update successes
    combinedChart.data.datasets[1].data = hourlyData.map(data => data.failed); // Update failures
    combinedChart.update(); // Redraw the chart
}

// Run the combined chart update every hour
setInterval(updateCombinedChart, 3600000); // Update every hour

// Run the 24-Hour Chart Update Every Hour
// setInterval(update24HourChart, 3600000);
