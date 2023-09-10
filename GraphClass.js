export default class GraphClass {
    constructor() {
      this.graph = {
        nodes: [],
        edges: [],
        nodeDegrees: {}
      };
    }
    // Problem 6a) Compute average node degree
    computeAverageNodeDegree() {
        let totalDegree = 0;
        for (const node in this.graph.nodeDegrees) {
            totalDegree += this.graph.nodeDegrees[node];
        }
        return totalDegree / this.graph.nodes.length;
    }

    // Problem 6b) Number of connected components
    computeConnectedComponents() {
        let visitedNodes = new Set();
        let components = 0;

        const dfs = (node) => {
            visitedNodes.add(node.id);

            for (const edge of this.graph.edges) {
                let target = null;
                if (edge.source === node.id && !visitedNodes.has(edge.target)) {
                    target = this.graph.nodes.find(n => n.id === edge.target);
                } else if (edge.target === node.id && !visitedNodes.has(edge.source)) {
                    target = this.graph.nodes.find(n => n.id === edge.source);
                }

                if (target) {
                    dfs(target);
                }
            }
        };

        for (const node of this.graph.nodes) {
            if (!visitedNodes.has(node.id)) {
                dfs(node);
                components++;
            }
        }

        return components;
    }

    // Problem 6c) Compute graph density
    computeGraphDensity() {
        const V = this.graph.nodes.length;
        const E = this.graph.edges.length;

        if (V === 0) return 0; // To handle a graph with no nodes

        return (2 * E) / (V * (V - 1));
    }
    
}
