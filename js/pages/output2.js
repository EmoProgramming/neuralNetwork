import { NeuralNetwork, NeuralNetworkControls, NeuralNetworkVisualization, Layer } from "../neuralNetwork.js";


export function output2Page() {
    const neuralNetwork = new NeuralNetwork([2, 3, 2]);

    const neuralNetworkVisualization = new NeuralNetworkVisualization(neuralNetwork);

    const controls = document.getElementById("controls");
    const neuralNetworkControls = new NeuralNetworkControls(neuralNetwork, controls, neuralNetworkVisualization);

}
