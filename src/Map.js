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
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Polyline,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: -6.957223012102734, lng: 107.64566620831309 };
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
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();

    if (!isLoaded) {
        return <SkeletonText />;
    }

    async function calculateRoute() {
        if (
            originRef.current.value === "" ||
            destiantionRef.current.value === ""
        ) {
            return;
        }
        // ALGO, panggil fungsi maybe?
        setDistance(99999999);
        setDuration(12321);
    }

    function clearRoute() {
        window.location.reload();
    }

    function handleMapClick(event) {
        let newMarker = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setNodes([...nodes, newMarker]);
    }

    function handleMarkerClick(event) {
        setMarkers([
            ...markers,
            { lat: event.latLng.lat(), lng: event.latLng.lng() },
        ]);
        // Mestinya markers.length == 2, tapi setMarkers asinkronus.
        // Ini hacky way biar bisa dapet marker terbaru
        if (markers.length === 1) {
            let oldMarker = markers[0];
            let newMarker = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };
            setPaths([
                ...paths,
                [
                    { lat: oldMarker.lat, lng: oldMarker.lng },
                    { lat: newMarker.lat, lng: newMarker.lng },
                ],
            ]);

            setMarkers([]);
        }
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
                    zoom={16}
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
                            label="a"
                        ></Marker>
                    ))}
                    {paths.map((path) => {
                        console.log(path);
                        return (
                            <Polyline
                                path={path}
                                options={{
                                    strokeColor: "#ff2527",
                                    strokeOpacity: 0.75,
                                    strokeWeight: 2,
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
                    </ButtonGroup>
                </HStack>
                <HStack spacing={4} mt={4} justifyContent="space-around">
                    <Text>Distance: {distance} </Text>
                    <Text>Route: {duration} </Text>
                    {/* <IconButton
                        aria-label="center back"
                        icon={<FaLocationArrow />}
                        isRound
                        onClick={() => {
                            map.panTo(center);
                            map.setZoom(15);
                        }}
                    /> */}
                    {/* <Link as={ReachLink} to="/" colorScheme="pink">
                        Kembali?
                    </Link> */}
                </HStack>
            </Box>
        </Flex>
    );
}

export default Map;
