class Node {
    // Class untuk Node
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.edges = [];
    }

    // Menambahkan Edge untuk Node ini
    addEdge(dest, distance) {
        this.edges.push(new Edge(this, dest, distance));
    }
}

class Edge {
    // Class untuk Edge
    // Hanya menyimpan data
    constructor(src, dest, distance) {
        this.src = src;
        this.dest = dest;
        this.distance = distance;
    }
}

class Graph {
    // Class Graf
    constructor() {
        this.nodes = {};
    }

    // Menambah Node dalam Graf
    addNode(name, lat = 0, lng = 0) {
        this.nodes[name] = new Node(lat, lng);
    }

    // Menambah Edge dengan Kalkulasi Real Distance
    addEdge(src, dest, isOneWay = false) {
        var dist = calculateDistance(this.nodes[src], this.nodes[dest]);
        this.nodes[src].addEdge(dest, dist);
        if (!isOneWay) {
            this.nodes[dest].addEdge(src, dist);
        }
    }

    // Menambah Edge dengan Given Distance
    addWeightedEdge(src, dest, dist, isOneWay = false) {
        this.nodes[src].addEdge(dest, dist);
        if (!isOneWay) {
            this.nodes[dest].addEdge(src, dist);
        }
    }

    // Melakukan search
    // Bisa mode aStar dan UCS
    search(src, dest, mode) {
        var pq = new PriorityQueue();
        var ret = [[], -1];
        var visited = new Map();

        var initialData;
        if (mode === "aStar") {
            initialData = new AStarData(
                src,
                [],
                0,
                calculateDistance(this.nodes[src], this.nodes[dest])
            );
        } else if (mode === "UCS") {
            initialData = new UCSData(src, [], 0);
        }

        pq.enqueue(initialData);
        while (!pq.isEmpty()) {
            var current = pq.dequeue();

            if (visited[current.name]) {
                continue;
            }
            visited[current.name] = true;

            if (current.name === dest) {
                ret = [current.prev.concat([current.name]), current.totalDist];
                break;
            }

            for (var i = 0; i < this.nodes[current.name].edges.length; i++) {
                var edge = this.nodes[current.name].edges[i];
                if (!visited[edge.dest]) {
                    var newData;
                    if (mode === "aStar") {
                        newData = new AStarData(
                            edge.dest,
                            current.prev.concat([current.name]),
                            current.totalDist + edge.distance,
                            calculateDistance(
                                this.nodes[edge.dest],
                                this.nodes[dest]
                            )
                        );
                    } else if (mode === "UCS") {
                        newData = new UCSData(
                            edge.dest,
                            current.prev.concat([current.name]),
                            current.totalDist + edge.distance
                        );
                    }
                    pq.enqueue(newData);
                }
            }
        }

        return ret;
    }
}

class PriorityQueue {
    // Class untuk membuat Queue dengan Prioritas
    constructor() {
        this.queue = [];
    }

    // Mengembalikan apakah queue kosong
    isEmpty() {
        return this.queue.length === 0;
    }

    // Melakukan Enqueue data
    enqueue(data) {
        let left = 0;
        let right = this.queue.length - 1;
        let idx = -1;

        while (left <= right) {
            var mid = Math.floor((left + right) / 2);

            if (this.queue[mid].cost > data.cost) {
                idx = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        if (idx === -1) {
            this.queue.push(data);
        } else {
            this.queue.splice(idx, 0, data);
        }
    }

    // Melakukan Dequeue dan Mengembalikan Isi yang Dihapus
    dequeue() {
        if (!this.isEmpty()) {
            return this.queue.shift();
        } else {
            return null;
        }
    }
}

class UCSData {
    // Class menyimpan data UCS
    constructor(name, prev, totalDist) {
        this.name = name;
        this.prev = prev;
        this.totalDist = totalDist;
        this.cost = totalDist;
    }
}

class AStarData {
    // Class menyimpan data A*
    constructor(name, prev, totalDist, additionalCost) {
        this.name = name;
        this.prev = prev;
        this.totalDist = totalDist;
        this.cost = totalDist + additionalCost;
    }
}

function calculateDistance(node1, node2) {
    // Mengembalikan jarak dalam Km
    // Source: https://community.powerbi.com/t5/Desktop/How-to-calculate-lat-long-distance/td-p/1488227

    // Radius Bumi dalam Km
    const earthRadius = 6371;

    // Mengubah derajat menjadi radian
    var lat1 = toRadian(node1.lat);
    var long1 = toRadian(node1.lng);
    var lat2 = toRadian(node2.lat);
    var long2 = toRadian(node2.lng);

    return (
        earthRadius *
        Math.acos(
            Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(long2 - long1)
        )
    );
}

function toRadian(degree) {
    // Fungsi mengubah derajat menjadi radian
    return (degree * Math.PI) / 180;
}

module.exports = Graph;
