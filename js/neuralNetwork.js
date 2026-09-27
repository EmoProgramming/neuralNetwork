export class NeuralNetworkVisualization {        
    constructor(neuralNetwork) {
        this.main = document.querySelector("main");
        this.neuralNetwork = neuralNetwork;

        this.fillCircles();
    }

    addCircle(x, y, color) {
        const circle = document.createElement("div");
        circle.classList.add("circle");
        circle.style.position = "absolute";
        circle.style.top = y + "px";
        circle.style.left = x + "px";
        circle.style.backgroundColor = color;

        this.main.appendChild(circle);
    }

    removeCircles() {
        const circles = this.main.querySelectorAll(".circle");

        for (const circle of circles) {
            circle.remove();
        }
    }

    fillCircles() {

        const GAP = 10;

        const centerX = this.main.offsetWidth / 2;
        const centerY = this.main.offsetHeight / 2;

        for (let y = -centerY; y < centerY; y += GAP) {
            for (let x = -centerX; x < centerX; x += GAP) {

                let color, output1, output2;

                [output1, output2] = this.neuralNetwork.calculateOutputs([x, y]);

                const dataVisualization = this.main.dataset.visualization;

                console.log(output1, output2);
                if (dataVisualization === "classification") {

                    if (output1 > output2) {
                        color = "red";
                    } else {
                        color = "blue";
                    }

                } else if (dataVisualization === "output1") {
                    console.log("AHOJ");

                    const brightness = Math.min(output1 * 20, 255);
                    color = `rgb(${brightness}, 0, 0)`;

                } else if (dataVisualization === "output2") {

                    const brightness = Math.min(output2 * 20, 255);
                    color = `rgb(${brightness}, 0, 0)`;
                }

                // posun matematických súradníc do obrazovkových
                let screenX = x + centerX;
                let screenY = y + centerY;

                this.addCircle(screenX, screenY, color);
            }
        }
    }

    update() {
        this.removeCircles();
        this.fillCircles();
    }

}


export class NeuralNetworkControls {
    constructor(neuralNetwork, controlsElement, neuralNetworkVisualization) {
        this.neuralNetwork = neuralNetwork;
        this.controlsElement = controlsElement;

        this.neuralNetworkVisualization = neuralNetworkVisualization;

        this.createSliders();
    }

    createSlider(text, value) {
        const label = document.createElement("label");

        const valueElement = document.createElement("span");
        valueElement.textContent = `${text}: ${value}`;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = -30;
        slider.max = 30;
        slider.value = value;
        slider.classList.add("slider");

        slider.addEventListener("input", () => {
            valueElement.textContent = `${text}: ${slider.value}`;
        });

        label.appendChild(valueElement);
        label.appendChild(slider);

        return label;
    }

    createNeuronElement(index) {
        const neuronElement = document.createElement("div");
        neuronElement.classList.add("neuron");
        neuronElement.innerHTML = "NEURON " + index;
        return neuronElement;
    }

    createSlidersForNeuron(neuron, index) {
        const neuronElement = this.createNeuronElement(index);

        for (let i = 0; i < neuron.weights.length; i++) {
            const weightSlider = this.createSlider(`WEIGHT ${i}`, neuron.weights[i]);
            const slider = weightSlider.querySelector("input");
            
            slider.addEventListener("input", () => {
                const sliderValue = Number(slider.value);
                neuron.weights[i] =  sliderValue;
                this.neuralNetworkVisualization.update();
            })

            neuronElement.appendChild(weightSlider);
        }

        const biasSlider = this.createSlider(`BIAS`, neuron.bias);

        const slider = biasSlider.querySelector("input");

        slider.addEventListener("input", () => {
            neuron.bias = Number(slider.value);
            this.neuralNetworkVisualization.update();
        });

        neuronElement.appendChild(biasSlider);

        return neuronElement;
    }

    createLayerElement(index) {
        const layerElement = document.createElement("div");
        layerElement.classList.add("layer");
        layerElement.innerHTML = "LAYER " + index;

        return layerElement;
    }

    createSliders() {

        for (let i = 0; i < this.neuralNetwork.layers.length; i++) {

            const thisLayer = this.neuralNetwork.layers[i];
            const layerElement = this.createLayerElement(i);

            for (let j = 0; j < thisLayer.neurons.length; j++) {

                const thisNeuron = thisLayer.neurons[j];
                const neuronElement = this.createSlidersForNeuron(thisNeuron, j);

                layerElement.appendChild(neuronElement);

            }

            this.controlsElement.appendChild(layerElement);

        }
    }
}


export class NeuralNetwork {
    constructor(layerSizes) {
        this.layers = [];

        this.weights = this.createRandomWeights(layerSizes);
        this.biases = this.createRandomBiases(layerSizes);

        this.createLayers(this.weights, this.biases);
    }

    createLayers(weights, biases) {

        for (let i = 0; i < weights.length; i++) {

            const weightsForLayer = weights[i];
            const biasesForLayer = biases[i];

            const currLayer = new Layer(weightsForLayer, biasesForLayer);
            this.layers.push(currLayer);
        }

    }

    createRandomBiases(layerSizes) {
        let biases = [];
        for (let i = 1; i < layerSizes.length; i++) {
            const currNumberOfNeurons = layerSizes[i];

            let biasesForLayer = [];

            for (let j = 0; j < currNumberOfNeurons; j++) {
                const randomValue = Math.random() * 2 - 1;
                biasesForLayer.push(randomValue);
            }

            biases.push(biasesForLayer);
        }

        return biases;
    }

    createRandomWeights(layerSizes) {
        let weights = [];
        for (let i = 1; i < layerSizes.length; i++) {
            const currNumberOfNeurons = layerSizes[i];
            const previousNumberOfNeurons = layerSizes[i-1];

            let weightsForLayer = [];

            for (let j = 0; j < currNumberOfNeurons; j++) {
                let weightsForNeuron = [];

                for (let k = 0; k < previousNumberOfNeurons; k++) {
                    const randomValue = Math.random() * 2 - 1;
                    weightsForNeuron.push(randomValue);
                }

                weightsForLayer.push(weightsForNeuron);
            }

            weights.push(weightsForLayer);
        }

        return weights;
    }

    calculateOutputs(inputs) {

        let currentInputs = inputs;
        let nextLayer, outputs;
        
        for (let i = 0; i < this.layers.length; i++) {
            nextLayer = this.layers[i];
            outputs = nextLayer.calculateOutputs(currentInputs);
            currentInputs = outputs;
        }

        return outputs;
    }

    loss(value, target) {
        const error = target - value;
        return error * error;
    }

    lossOfOutput(output, target) {
        
        let lossValue = 0;

        for (let i = 0; i < output.length; i++) {
            lossValue += this.loss(output[i], target[i]);
        }

        return lossValue;
    }

    

}

export class Layer {
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

export class Neuron {
    constructor(weights, bias) {
        this.weights = weights;
        this.bias = bias;
    }

    relu(x) {
        return Math.max(0, x);
    }
    
    calculateOutput(inputs) {
        let output = this.bias; 

        for (let i = 0; i < inputs.length; i++) {
            output += inputs[i] * this.weights[i];
        }

        return this.relu(output);
    }



}


/*
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

const neuralNetworkVisualization = new NeuralNetworkVisualization(neuralNetwork);

const controls = document.getElementById("controls");
const neuralNetworkControls = new NeuralNetworkControls(neuralNetwork, controls, neuralNetworkVisualization);


*/