export const loadGraphText = async (lines) => {
    try {
        const { Graph } = require("./Graph");
        var g = new Graph();
        var m = new Map();

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/\s+/g, " ").trim();
        }

        var n = parseFloat(lines[0]);
        if (!n) {
            throw Error("No nodes");
        }
        for (let i = 1; i < n + 1; i++) {
            let curr_line = lines[i].split(" ");
            console.log(curr_line[2], curr_line[0], curr_line[1]);
            g.addNode(curr_line[2], curr_line[0], curr_line[1]);
            m[i - 1] = curr_line[2];
        }

        for (let i = n + 1; i < 2 * n + 1; i++) {
            const line = lines[i].split(" ");
            console.log(line);
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
