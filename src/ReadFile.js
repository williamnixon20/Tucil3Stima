export const loadGraphText = async (lines) => {
    try {
        const Graph = require("./Graph");
        var g = new Graph();
        var m = new Map();

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/\s+/g, " ").trim();
        }

        var n = parseFloat(lines[0].split(" ")[1]);
        if (!n) {
            throw Error("No nodes");
        }
        for (let i = 1; i < n + 1; i++) {
            g.addNode(lines[i]);
            m[i - 1] = lines[i];
        }

        for (let i = n + 1; i < lines.length; i++) {
            const line = lines[i].split(" ");
            for (let j = 0; j < line.length; j++) {
                if (line[j] !== "0") {
                    g.addWeightedEdge(
                        m[i - n - 1],
                        m[j],
                        parseFloat(line[j]),
                        true
                    );
                }
            }
        }
        return g;
    } catch (err) {
        throw err;
    }
};
