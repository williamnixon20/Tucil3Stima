import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
    Link,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes, FaDownload } from "react-icons/fa";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Polyline,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { Link as ReachLink } from "react-router-dom";

let center = { lat: -6.957223012102734, lng: 107.64566620831309 };
function Map() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    // Nodes lat lng

    const [nodes, setNodes] = useState(
        /**type array of lat lng, with labels too */ []
    );
    const [markers, setMarkers] = useState([]);
    const [mode, setMode] = useState(true);
    const [paths, setPaths] = useState(/**pair of nodes */ []);
    const [finalPath, setFinalPaths] = useState([]);
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    const [distance, setDistance] = useState("");
    const [route, setRoute] = useState("");
    const [graph, setGraph] = useState(null);

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();

    if (!isLoaded) {
        return <SkeletonText />;
    }

    async function calculateRoute() {
        const Graph = require("./Graph");
        let graphP = graph;
        let g = new Graph();
        nodes.forEach((node) => g.addNode(node.label, node.lat, node.lng));
        paths.forEach((path) => g.addEdge(path[0].label, path[1].label, true));
        setGraph(g);
        graphP = g;
        let origin = originRef.current.value;
        let dest = destiantionRef.current.value;
        let nodes_filtered = nodes.filter(
            (node) => node.label === origin || node.label === dest
        );
        if (nodes_filtered.length !== 2) {
            if (origin !== dest) {
                alert("Origin dan destination invalid! Cek kembali");
                return;
            } else {
                alert("Poin origin dan destionation sama!");
            }
        }
        if (graphP === null) {
            alert("Graph belum terload! Sudah load file/membuat map?");
            return;
        }

        setFinalPaths([]);
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
        if (res[1] === -1) {
            setRoute("Not found");
            setFinalPaths([]);
            return;
        }
        let path_res = res[0];
        setRoute(path_res.toString());

        let final_path = [];
        for (let i = 1; i < path_res.length; i++) {
            let prevNode = path_res[i - 1];
            let currNode = path_res[i];
            let nodePaths = nodes.filter((node) => {
                return node.label === currNode || node.label === prevNode;
            });
            final_path.push([nodePaths[0], nodePaths[1]]);
        }
        setFinalPaths(final_path);
    }

    function clearRoute() {
        window.location.reload();
    }

    async function readFile(event) {
        try {
            const reader = new FileReader();
            reader.readAsText(event.target.files[0]);
            reader.onload = async (e) => {
                const text_list = e.target.result.split(/\r?\n/);
                if (text_list[0].split(" ")[0] !== "B") {
                    alert("Ini bukan file google maps! Harap kembali ke home.");
                    return;
                }
                let length = parseFloat(text_list[0].split(" ")[1]);
                let nodes = [];
                // console.log(text_list);
                for (let i = 1; i < length + 1; i++) {
                    let curr_text = String(text_list[i]).split(" ");
                    nodes.push({
                        lat: parseFloat(curr_text[0]),
                        lng: parseFloat(curr_text[1]),
                        label: curr_text[2],
                    });
                }
                setNodes(nodes);
                let paths = [];
                for (let i = 1 + length; i < 1 + 2 * length; i++) {
                    let curr_node = nodes[i - (1 + length)];
                    let curr_text = String(text_list[i]).split(" ");
                    // console.log(curr_text);
                    for (let j = 0; j < length; j++) {
                        if (curr_text[j] !== "0") {
                            paths.push([curr_node, nodes[j]]);
                        }
                    }
                }
                setPaths(paths);
                setFinalPaths([]);
                setDistance(0);
                setRoute("");
                if (nodes[0]) {
                    center = nodes[0];
                }
                map.panTo(center);
                map.setZoom(15);
                alert(
                    "File loaded! Klik peta untuk menaruh marker, klik antara 2 marker untuk membuat directed edge."
                );
            };
        } catch (err) {
            alert("Invalid file!" + err);
        }
    }

    function handleMapClick(event) {
        let newMarker = {
            label: `${nodes.length}`,
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setNodes([...nodes, newMarker]);
    }

    function handleMarkerClick(event) {
        let oldMarker = markers[0];
        const epsilon = 0.00000000000001;
        let node = nodes.filter(
            (node) =>
                Math.abs(event.latLng.lat() - node.lat) < epsilon &&
                Math.abs(event.latLng.lng() - node.lng) < epsilon
        );
        setMarkers([
            ...markers,
            {
                label: `${node[0].label}`,
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            },
        ]);

        if (markers.length === 1) {
            let newMarker = {
                label: `${node[0].label}`,
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            setPaths([
                ...paths,
                [
                    {
                        label: oldMarker.label,
                        lat: oldMarker.lat,
                        lng: oldMarker.lng,
                    },
                    {
                        label: newMarker.label,
                        lat: newMarker.lat,
                        lng: newMarker.lng,
                    },
                ],
            ]);

            setMarkers([]);
        }
    }

    async function handleSaveFile() {
        let FileSaver = require("file-saver");
        let stringBuffer = [];
        stringBuffer.push(`B ${nodes.length}\n`);
        // console.log(nodes.length);
        let matrix = [];
        let converter = {};
        for (let i = 0; i < nodes.length; i++) {
            // console.log(
            //     nodes[i].lat + " " + nodes[i].lng + " " + nodes[i].label
            // );
            stringBuffer.push(
                `${nodes[i].lat + " " + nodes[i].lng + " " + nodes[i].label}\n`
            );
            converter[nodes[i].label] = i;
            matrix.push(new Array(nodes.length).fill(0));
        }
        for (let i = 0; i < paths.length; i++) {
            let currPath = paths[i];
            let sourceNode = converter[currPath[0].label];
            let destNode = converter[currPath[1].label];
            matrix[sourceNode][destNode] = 1;
        }
        for (let i = 0; i < nodes.length; i++) {
            let buffer = "";
            for (let j = 0; j < nodes.length; j++) {
                // console.log(matrix[converter[i]][converter[j]]);
                buffer += matrix[i][j] + " ";
            }
            buffer += "\n";
            stringBuffer.push(buffer);
            // console.log(buffer);
        }
        // console.log(matrix);
        // stringBuffer.push()
        var blob = new Blob(stringBuffer, {
            type: "text/plain;charset=utf-8",
        });
        FileSaver.saveAs(blob, "savedConfig.txt");
    }

    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
        >
            <Box position="absolute" left={0} top={0} h="100%" w="100%">
                {/* Google Map Box */}
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                    onClick={(e) => handleMapClick(e)}
                >
                    {nodes.map((node, i) => (
                        <Marker
                            key={i}
                            position={node}
                            onClick={(e) => handleMarkerClick(e)}
                            label={node.label}
                        ></Marker>
                    ))}
                    {paths.map((path, i) => {
                        return (
                            <Polyline
                                path={path}
                                key={i}
                                options={{
                                    strokeColor: "#ff2527",
                                    strokeOpacity: 0.5,
                                    strokeWeight: 1,
                                }}
                            />
                        );
                    })}
                    {finalPath.map((path, i) => {
                        // console.log(path);
                        return (
                            <Polyline
                                path={path}
                                key={i + 9999}
                                options={{
                                    strokeColor: "#0000FF",
                                    strokeOpacity: 1,
                                    strokeWeight: 5,
                                }}
                            />
                        );
                    })}
                </GoogleMap>
            </Box>
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
                        <IconButton
                            aria-label="center back"
                            icon={<FaTimes />}
                            onClick={clearRoute}
                        />
                        <IconButton
                            aria-label="center back"
                            icon={<FaDownload />}
                            onClick={handleSaveFile}
                        />
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
                    <Text>
                        Distance: {Math.round(distance * 10000) / 10000} km{" "}
                    </Text>
                    <Text>Route: {route} </Text>
                    <Link
                        color="teal.500"
                        as={ReachLink}
                        to="/"
                        colorScheme="pink"
                    >
                        Kembali?
                    </Link>
                </HStack>
            </Box>
        </Flex>
    );
}

export default Map;
