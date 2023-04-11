import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    Link,
    Input,
    Text,
} from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";
import { useRef, useState } from "react";
import { loadGraphText } from "./ReadFile";
import Graph from "react-graph-vis";

function Home() {
    const [mode, setMode] = useState(true);
    const [distance, setDistance] = useState("");
    const [nodes, setNodes] = useState("N/A");
    const [route, setRoute] = useState("");
    const [graph, setGraph] = useState(null);
    const [graphVis, setGraphVis] = useState({ nodes: [], edges: [] });

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();
    async function drawGraph(graph, final_path) {
        let nodesNew = Object.keys(graph.nodes);
        let nodes = [];
        let edges = [];
        for (let i = 0; i < nodesNew.length; i++) {
            nodes.push({
                id: nodesNew[i],
                label: nodesNew[i],
                title: nodesNew[i],
            });
            let routes = graph.nodes[nodesNew[i]].edges;
            for (let j = 0; j < routes.length; j++) {
                let edgeNew = {
                    from: nodesNew[i],
                    to: routes[j].dest,
                    label: String(routes[j].distance),
                    title: String(routes[j].distance),
                };
                if (final_path[edgeNew.from + edgeNew.to] === undefined) {
                    edges.push(edgeNew);
                } else {
                    edgeNew.color = "#FF0000";
                    edgeNew.width = 3;
                    edges.push(edgeNew);
                }
            }
        }
        let newGraph = { nodes, edges };
        setGraphVis(newGraph);
    }
    async function calculateRoute() {
        let origin = originRef.current.value;
        let dest = destiantionRef.current.value;
        if (!nodes.includes(origin)) {
            alert("Node origin tidak ditemukan");
            return;
        }
        if (!nodes.includes(dest)) {
            alert("Node dest tidak ditemukan");
            return;
        }

        let graphP = graph;
        if (graphP === null) {
            alert("Graph belum terload! Sudah load file/membuat map?");
            return;
        }

        let modeStr;
        if (mode) {
            modeStr = "aStar";
        } else {
            modeStr = "UCS";
        }
        let res = graphP.search(
            originRef.current.value,
            destiantionRef.current.value,
            modeStr
        );
        setDistance(res[1]);
        let path_res = res[0];
        let final_path = {};
        setRoute(path_res.toString());
        for (let i = 1; i < path_res.length; i++) {
            let prevNode = path_res[i - 1];
            let currNode = path_res[i];
            final_path[prevNode + currNode] = true;
        }
        await drawGraph(graphP, final_path);
    }

    async function readFile(event) {
        try {
            const reader = new FileReader();
            reader.readAsText(event.target.files[0]);
            reader.onload = async (e) => {
                const text_list = e.target.result.split(/\r?\n/);
                try {
                    let g = await loadGraphText(text_list);
                    setGraph(g);
                    setNodes(Object.keys(g.nodes));
                    await drawGraph(g, {});
                } catch (err) {
                    console.log(err);
                    alert(
                        "Invalid file for regular! Make sure it starts with R" +
                            err
                    );
                }
            };
        } catch (err) {
            alert(
                "Invalid file format! Make sure the format is right (starts with R)"
            );
        }
    }

    const options = {
        edges: {
            color: "#000000",
        },
        height: "500px",
    };

    const events = {
        select: function (event) {
            var { nodes, edges } = event;
        },
    };
    return (
        <Flex
            h="full"
            w="full"
            flexDirection="column"
            alignItems="center"
            justifyItems="center"
        >
            <Box
                p={4}
                borderRadius="lg"
                m={4}
                bgColor="white"
                shadow="base"
                minW="container.md"
                zIndex="1"
            >
                <HStack spacing={2} justifyContent="space-between">
                    <Box flexGrow={1}>
                        <Input
                            type="text"
                            placeholder="Origin"
                            ref={originRef}
                        />
                    </Box>
                    <Box flexGrow={1}>
                        <Input
                            type="text"
                            placeholder="Destination"
                            ref={destiantionRef}
                        />
                    </Box>

                    <ButtonGroup>
                        <Button
                            colorScheme="pink"
                            type="submit"
                            onClick={(e) => setMode(!mode)}
                        >
                            {mode && <>A*</>}
                            {!mode && <>UCS</>}
                        </Button>
                        <Button
                            colorScheme="pink"
                            type="submit"
                            onClick={calculateRoute}
                        >
                            Calculate Route
                        </Button>
                    </ButtonGroup>
                </HStack>
                <HStack spacing={4} mt={4} justifyContent="space-around">
                    <Input
                        placeholder="Read File"
                        size="md"
                        variant="filled"
                        type="file"
                        colorScheme="pink"
                        width="20rem"
                        onChange={readFile}
                    />
                    <Text>Distance: {distance} </Text>
                    <Text>Route: {route} </Text>
                </HStack>
                <HStack spacing={4} mt={4} justifyContent="space-around">
                    <Text>Graph Nodes: {nodes.toString()} </Text>
                    <Link
                        color="teal.500"
                        as={ReachLink}
                        to="/Map"
                        colorScheme="pink"
                    >
                        Mode Bonus? Klik saya
                    </Link>
                </HStack>
            </Box>
            <Box>
                <Graph
                    graph={graphVis}
                    options={options}
                    events={events}
                    getNetwork={(network) => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                    }}
                />
            </Box>
        </Flex>
    );
}

export default Home;
