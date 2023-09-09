// import the GraphClass definiton from GraphClass.js
import GraphClass from './GraphClass.js'; 


function renderGraph(graphData) {
    d3.select("#graphviz svg").remove();  
    let isNodeClicked = false;

    const width = window.innerWidth;
    const height = 700;
    const nodeRadius = 5;

    const svg = d3.select("#graphviz").append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("click", function(event) {
            if (isNodeClicked) {  // Check this flag
                isNodeClicked = false;  // Reset the flag for the next click
                return;  // Exit the function without adding a node
            }
            const coords = d3.pointer(event);
            const newNode = {
                id: `customNode${Date.now()}`, // A unique ID for the new node
                x: coords[0],
                y: coords[1],
                vx: 0,
                vy: 0,
                active: false
            };
            graphData.nodes.push(newNode);
            //console.log(graphData.nodes)
            renderGraph(graphData); // This will re-render the graph with the new node
        });

    let uniqueEdgeIDs = new Set();
    graphData.edges.forEach(edge => {
        uniqueEdgeIDs.add(edge.source);
        uniqueEdgeIDs.add(edge.target);
    });
    

    function boundingBoxForce() {
        for (let node of graphData.nodes) {
            node.x = Math.max(15, Math.min(width - 30, node.x)); // 30 is half the width of a node, adjust if necessary
            node.y = Math.max(15, Math.min(height - 30, node.y)); // Adjust as necessary
        }
    }

    const simulation = d3.forceSimulation(graphData.nodes)
        .force("link", d3.forceLink(graphData.edges).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(node => {
            return (!graphData.nodeDegrees[node.id] || graphData.nodeDegrees[node.id] === 0) ? -200 : -50; 
            // Increase the negative value for disconnected nodes to increase repulsion
        }))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("boundary", boundingBoxForce); // Custom bounding box force
    
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(graphData.edges)
        .enter().append("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(graphData.nodes)
        .enter().append("circle")
        .attr("r", nodeRadius)
        .attr("fill", "#6699cc");
    /*
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    */

    simulation.nodes(graphData.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graphData.edges);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    /*
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.active = true;
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.active = false;
        d.fx = null;
        d.fy = null;
    }
    */
    let isDraggingEdge = false;
    let dragTimeout = null;
    let newEdge = null;
    
    function dragStarted(event, d) {
        //console.log('Dragged Node:', d.x, d.y);
        //console.log('Dragged event:', event.x, event.y);
        d3.select(this).raise();
        d.fx = d.x;
        d.fy = d.y;
    
        dragTimeout = setTimeout(() => {
            isDraggingEdge = true;
            newEdge = svg.append("line")
                .attr("class", "dragLine")
                .attr("x1", d.x)
                .attr("y1", d.y)
                .attr("x2", d.x)
                .attr("y2", d.y);
        }, 5);
    }
    
    function dragged(event, d) {
        if (isDraggingEdge) {
            newEdge.attr("x2", d.x).attr("y2", d.y);
        } else {
            d.fx = event.x;
            d.fy = event.y;
            if (!event.active) simulation.alphaTarget(0.3).restart();
        }
        //console.log('Dragged event:', event.x, event.y);

    }
    
    function dragEnded(event, d) {
        clearTimeout(dragTimeout);
        if (isDraggingEdge && newEdge) {
            isDraggingEdge = false;
    
            const targetNode = graphData.nodes.find(node => {
                const dx = node.x - event.x;
                const dy = node.y - event.y;
                return Math.sqrt(dx * dx + dy * dy) < nodeRadius;
            });
    
            if (targetNode) {
                if (graphData.edges.some(edge => (edge.source === d.id && edge.target === targetNode.id) || (edge.source === targetNode.id && edge.target === d.id))) {
                    alert("This connection already exists!");
                } else if (targetNode === d) {
                    alert("Self loops are not allowed!");
                } else {
                    graphData.edges.push({ source: d.id, target: targetNode.id });
                    renderGraph(graphData);
                }
            }
    
            newEdge.remove();
            newEdge = null;
    
        } else {
            if (!event.active) simulation.alphaTarget(0);  // Removed the check for event.active
            d.fx = null;
            d.fy = null;
        }
    }
    
    const drag = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
    
    node.call(drag);
    
}

// Function to fetch the JSON data and render the graph
async function loadAndRenderGraph(fileName) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            graphObj.graph.nodes = data.nodes.map(nodeId => ({ id: nodeId }));
            graphObj.graph.edges = data.edges.map(edge => ({
                source: edge[0],
                target: edge[1]
            }));
            graphObj.graph.nodeDegrees = data.nodeDegrees;
            
            // visualize graph
            renderGraph(graphObj.graph);
    });

}

function displayGraphStatistics(graphObj) {
    document.getElementById('computeStats').addEventListener('click', function() {
        document.getElementById('avgDegree').innerText = graphObj.computeAverageNodeDegree().toFixed(2);
        document.getElementById('numComponents').innerText = graphObj.computeConnectedComponents();
        document.getElementById('graphDensity').innerText = graphObj.computeGraphDensity().toFixed(4);
        //document.getElementById('graphDiameter').innerText = graphObj.computeDiameter();
    });
}

// instantiate an object of GraphClass
let graphObj = new GraphClass();

// your saved graph from Homework 1
let fileName="output_graph.json"

// render the graph in the browser
loadAndRenderGraph(fileName);

// compute and display simple statistics on the graph
displayGraphStatistics(graphObj);

