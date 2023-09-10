// import the GraphClass definiton from GraphClass.js
import GraphClass from './GraphClass.js'; 

/*
    Given some JSON data representing a graph, render it with D3
*/
// dummy commit
function renderGraph(graphData) {
    
}

/*
    Function to fetch the JSON data from output_graph.json & call the renderGraph() method
    to visualize this data
*/
function loadAndRenderGraph(fileName) {

}

/*
    A method to compute simple statistics (Programming part Subproblem 6)
    on updated graph data
*/
function displayGraphStatistics(graphObj) {

}

// instantiate an object of GraphClass
let graphObj = new GraphClass();

// your saved graph file from Homework 1
let fileName="output_graph.json"

// render the graph in the browser
loadAndRenderGraph(fileName);

// compute and display simple statistics on the graph
displayGraphStatistics(graphObj);


