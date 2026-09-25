const main = document.querySelector("main");

function relu(x) {
    return Math.max(0, x);
}

function addCircle(x, y, color) {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.style.position = "absolute";
    circle.style.top = y + "px";
    circle.style.left = x + "px";
    circle.style.backgroundColor = color;

    main.appendChild(circle);
}

function removeCircles() {
    const circles = main.querySelectorAll(".circle");

    for (const circle of circles) {
        circle.remove();
    }
}

function fillCircles(weights) {

    const GAP = 30;

    const centerX = main.offsetWidth / 2;
    const centerY = main.offsetHeight / 2;

    for (let y = -centerY; y < centerY; y += GAP) {
        for (let x = -centerX; x < centerX; x += GAP) {

            let color;

            [output1, output2] = [1, 2];

            if (output1 > output2) {
                color = "red";
            } else {
                color = "blue";
            }

            // posun matematických súradníc do obrazovkových
            let screenX = x + centerX;
            let screenY = y + centerY;

            addCircle(screenX, screenY, color);
        }
    }
}

function setupSliders() {
    for (let i = 0; i < sliders.length; i++) {
        const sliderId = sliders[i];
        const sliderElement = document.getElementById(sliderId);
        sliderElement.value = 0;

        sliderElement.addEventListener("input", () => {
            slidersValues[i] = Number(sliderElement.value);
            //console.log(slidersValues);
            let weights = getWeights();
            removeCircles();
            fillCircles(weights);
        });
    }

    
}




class NeuralNetwork {
    constructor(layers) {
        this.layers = layers;
    }

    calculateOutputs(inputs) {

        let currentInputs = inputs;
        let nextLayer, output;
        
        for (let i = 0; i < this.layers.length; i++) {
            nextLayer = this.layers[i];
            output = nextLayer.calculateOutputs(currentInputs);
            currentInputs = output;
        }

        return output;
    }


}

class Layer {
    constructor(weights, biases) {
        this.weights = weights;
        this.biases = biases;

        this.neurons = this.createNeurons();
    }

    createNeurons() {
        let neurons = [];

        for (let i = 0; i < this.biases.length; i++) {
            const neuron = new Neuron(this.weights[i], this.biases[i]);
            neurons.push(neuron);
        }

        return neurons;
    }

    calculateOutputs(inputs) {

        this.outputs = [];

        for (let i = 0; i < this.neurons.length; i++) {
            const thisNeuron = this.neurons[i];
            const output = thisNeuron.calculateOutput(inputs);
            this.outputs.push(output);
        }

        return this.outputs;
    }
}

class Neuron {
    constructor(weights, bias) {
        this.weights = weights;
        this.bias = bias;
    }

    
    calculateOutput(inputs) {
        let output = this.bias; 

        for (let i = 0; i < inputs.length; i++) {
            output += inputs[i] * this.weights[i];
        }

        return relu(output);
    }

}


let inputs = [2, 1];

const hiddenLayer = new Layer(
    [[0, 0],
    [0, 0],
    [0, 0]
    ],
    [1, 1, 1]
);

const outputLayer = new Layer(
    [[1, 1, 1],
    [2, 2, 2]
    ],
    [3, 3]
);

const neuralNetwork = new NeuralNetwork([hiddenLayer, outputLayer]);
console.log(neuralNetwork.calculateOutputs(inputs));