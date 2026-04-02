import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Chart } from 'chart.js/auto'
import { color } from 'chart.js/helpers';

let myChart;
let adatok = [];
let labels = [];
let reading = true;
let counter = 0;

function init() {
    document.getElementById("btnStart").addEventListener("click", readSerial);
    document.getElementById("btnResetChart").addEventListener("click", resetChart);
    chartInit();
}

function resetChart() {
    if (confirm("Are you sure?")) {
        adatok = [];
        labels = [];
        counter = 0;

        myChart.destroy();
        chartInit();
    }

}

function chartInit() {
    const ctx = document.getElementById('chart');

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Hőmérséklet °C",
                data: adatok,
                borderWidth: 1,
                borderColor: "#00ADB5",
                color: "#00ADB5",
                backgroundColor: "#222831"
            }]
        },
        defaults: { // idk
            color : "#FFF"
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }

            },
            line: {
                pointRadius: 0
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            animation:false,
            interaction: {
                intersect: false,
                mode: "x"
            }
        }
    });
}

function dataPrint(value) {
    document.getElementById("tempDisplay").textContent = value + " °C";

    adatok.push(value);
    labels.push(counter);
    myChart.update();

    counter++;
}


async function readSerial() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 })
    const reader = port.readable.getReader();
    reader.read();
    const decoder = new TextDecoder(); // Add decoder
    let buffer = "";
    let text;
            while (reading) {
                const { value, done } = await reader.read();
                buffer += decoder.decode(value);
                let lines = buffer.split("\n");
                buffer = lines.pop();
                
                for (let line of lines) {
                    const cleanLine = line.trim();
                    if (cleanLine) {
                        dataPrint(parseFloat(cleanLine)); 
                    }
                }
                
            }
        
}

document.addEventListener("DOMContentLoaded", init)


