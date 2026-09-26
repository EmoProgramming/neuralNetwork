import { NeuralNetwork, NeuralNetworkControls, NeuralNetworkVisualization, Layer } from "../neuralNetwork.js";


export function output1Page() {
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

}
