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

function Home() {
    const [mode, setMode] = useState(true);
    const [distance, setDistance] = useState("");
    const [nodes, setNodes] = useState("N/A");
    const [route, setRoute] = useState("");
    const [graph, setGraph] = useState(null);

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();

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
        setRoute(path_res.toString());
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
                    console.log(g.nodes);
                    console.log(Object.keys(g.nodes).toString());
                    setNodes(Object.keys(g.nodes));
                } catch (err) {
                    console.log(err);
                    alert(
                        "Invalid file for regular! Make sure it starts with R"
                    );
                }
            };
        } catch (err) {
            alert(
                "Invalid file format! Make sure the format is right (starts with R)"
            );
        }
    }

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
        </Flex>
    );
}

export default Home;
