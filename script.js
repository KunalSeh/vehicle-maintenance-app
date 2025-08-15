// 1. Get the <canvas> element from the HTML
let canvasElement = document.getElementById("fuelChart");

// 2. Get the drawing area (context) from the canvas
let drawingArea = canvasElement.getContext("2d");

// 3. Create the chart using Chart.js
let fuelChart = new Chart(drawingArea, {

    // Type of chart
    type: "line",

    // Data for the chart
    data: {
        // Labels for X-axis (months)
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],

        // Data for 4 different vehicles
        datasets: [
            {
                label: "Vehicle 1",
                data: [120, 135, 110, 145, 160, 150, 170],
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            },
            {
                label: "Vehicle 2",
                data: [90, 105, 100, 115, 130, 125, 140],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            },
            {
                label: "Vehicle 3",
                data: [150, 145, 160, 155, 165, 170, 175],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            },
            {
                label: "Vehicle 4",
                data: [110, 115, 105, 120, 125, 130, 140],
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                borderColor: "rgba(255, 206, 86, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }
        ]
    },

    // Options for how the chart looks
    options: {
        responsive: true,

        plugins: {
            legend: { display: true } // Show which line belongs to which vehicle
        },

        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Fuel (Liters)"
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Month"
                }
            }
        }
    }
});
