import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import "./App.css";
import Header from "./components/Header/Header";
import { MainPage } from "./pages/MainPage";
import React from "react";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <>
        <Header />
        <MainPage />
        <Footer />
      </>
    </ChakraProvider>
  );
}

export default App;
