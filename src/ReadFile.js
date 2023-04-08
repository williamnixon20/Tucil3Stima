function readFile(path) {
    const fs = require('fs')
    
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, text) => {
            if (err) reject(err);
            resolve(text.toString());
        });
    });
}

async function loadGraphFile(path) {
    try {
        const Graph = require('./Graph');
        const raw = await readFile(path);
        const lines = raw.split('\n');
        var g = new Graph();
        var m = new Map();

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/\s+/g, ' ').trim();
        }

        var n = parseInt(lines[0]);
        
        for (let i = 1; i < n + 1; i++) {
            g.addNode(lines[i]);
            m[i - 1] = lines[i];
        }

        for (let i = n + 1; i < lines.length; i++) {
            const line = lines[i].split(' ');
            for (let j = 0; j < line.length; j++) {
                if (line[j] !== '0') {
                    g.addWeightedEdge(m[i - n - 1], m[j], parseInt(line[j]), true);
                }
            }
        }

        return g;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function main() {
    try {
        const g = await loadGraphFile('inputGraph.txt');
        console.log(g.nodes["A"]);
    } catch (err) {
        console.error(err);
    }
}

main();
