import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function init() {
    document.getElementById("btnStart").addEventListener("click", readSerial)
}

function dataPrint(value) {
    console.log("a")
    document.getElementById("tempDisplay").textContent = value+" °C"
}


async function readSerial() {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const mapper = new TransformStream({
        transform(chunk, controller) {
            this.container = (this.container || "") + chunk;
            const lines = this.container.split("\n");
            this.container = lines.pop();
            lines.forEach(line => controller.enqueue(line));
        }
    });

    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);

    const reader = textDecoder.readable.pipeThrough(mapper).getReader();

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        dataPrint(parseFloat(value.trim()));
    }
}

document.addEventListener("DOMContentLoaded", init)


