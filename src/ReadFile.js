export const loadGraphText = async (lines) => {
    try {
        const { Graph } = require("./Graph");
        var g = new Graph();
        var m = new Map();

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/\s+/g, " ").trim();
        }

        var n = parseInt(lines[0]);
        console.log(n, lines.length)
        if (isNaN(n)) {
            throw Error("No nodes");
        }
        
        if (lines.length !== 2 * n + 1 && lines.length !== 2 * n + 2) {
            throw Error("Wrong Format in File");
        }

        for (let i = 1; i < n + 1; i++) {
            let curr_line = lines[i].split(" ");
            var lat = parseFloat(curr_line[0])
            var lng = parseFloat(curr_line[1])

            console.log(curr_line[2], lat, lng)

            if (isNaN(lat) || isNaN(lng)) {
                throw Error("Wrong Format in File");
            }
            g.addNode(curr_line[2], lat, lng);
            m[i - 1] = curr_line[2];
        }

        for (let i = n + 1; i < 2 * n + 1; i++) {
            const line = lines[i].split(" ");
            console.log(line);
            
            for (let j = 0; j < line.length; j++) {
                if (line[j] !== "0") {
                    var weight = parseFloat(line[j])

                    if (isNaN(weight)) {
                        throw Error("Wrong Format in File");
                    }

                    g.addWeightedEdge(
                        m[i - n - 1],
                        m[j],
                        weight,
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
