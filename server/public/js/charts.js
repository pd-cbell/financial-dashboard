function updateCharts() {
    // Update Transaction Volume Chart
    volumeChart.data.datasets[0].data = volumeData.attempted;
    volumeChart.data.datasets[1].data = volumeData.successful;
    volumeChart.update();

    // Update Combined Transactions Chart
    combinedChart.data.labels = hourlyData.map(data => data.hour);
    combinedChart.data.datasets[0].data = hourlyData.map(data => data.volume - data.failed);
    combinedChart.data.datasets[1].data = hourlyData.map(data => data.failed);
    combinedChart.update();
}

// Ensure charts refresh every 5 seconds
setInterval(updateCharts, 5000);

// Initialize Charts
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
