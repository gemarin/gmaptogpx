import { ChakraProvider, Container, defaultSystem } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header/Header";
import { MainPage } from "./pages/MainPage";
import React from "react";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <>
        <Header />
        <MainPage />
      </>
    </ChakraProvider>
  );
}

export default App;
