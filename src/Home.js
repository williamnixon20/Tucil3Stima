import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Link,
    Input,
    SkeletonText,
    Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import { Link as ReachLink } from "react-router-dom";

function Home() {
    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="100vh"
            w="100vw"
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
                    <ButtonGroup>
                        <Link as={ReachLink} to="/Map" colorScheme="pink">
                            Bonus?
                        </Link>

                        {/* <Button
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
                        /> */}
                    </ButtonGroup>
                </HStack>
            </Box>
        </Flex>
    );
}

export default Home;
