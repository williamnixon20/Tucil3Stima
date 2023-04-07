import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home.js";
import Maps from "./Map.js";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Map" element={<Maps />} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
