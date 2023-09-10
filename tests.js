import { assert } from 'chai';
import { describe, it } from 'mocha';
import GraphClass from './GraphClass.js';


// some dummy graph data
const dummyGraphData = {
    nodes: [
        {id: 'tt0111161'},
        {id: 'tt0068646'},
        {id: 'tt0468569'},
        {id: 'tt0071562'},
        {id: 'tt0069699'}
    ],
    edges: [
        {source: 'tt0111161', target: 'tt0068646'},
        {source: 'tt0068646', target: 'tt0468569'},
        {source: 'tt0468569', target: 'tt0071562'}
    ],
    nodeDegrees: {
        'tt0111161': 1,
        'tt0068646': 2,
        'tt0468569': 2,
        'tt0071562': 1,
        'tt0069699': 0
    }
};

describe('GraphClass', function() {
    
    describe('#computeAverageNodeDegree()', function() {
        it('should compute correct average node degree for the dummy graph', function() {
            let graphInstance = new GraphClass();
            graphInstance.graph = dummyGraphData;
            // sum of node degrees == 6 / number of nodes == 5 => 1.2
            assert.equal(graphInstance.computeAverageNodeDegree(), 1.2);
        });
    });

    describe('#computeConnectedComponents()', function() {
        it('should compute correct number of connected components for the dummy graph', function() {
            let graphInstance = new GraphClass();
            graphInstance.graph = dummyGraphData;
            // As node 'tt0069699' is not connected to any other node, so there are 2 components
            assert.equal(graphInstance.computeConnectedComponents(), 2); 
        });
    });

    describe('#computeGraphDensity()', function() {
        it('should compute correct graph density for the dummy graph', function() {
            let graphInstance = new GraphClass();
            graphInstance.graph = dummyGraphData;
            // Using closeTo because of potential floating point inaccuracies
            assert.closeTo(graphInstance.computeGraphDensity(), 0.3, 0.1); 
        });
    });
});
