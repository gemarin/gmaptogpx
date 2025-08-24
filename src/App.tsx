import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { MainPage } from "./pages/MainPage";
import Footer from "./components/Footer/Footer";
import Pipes from "./components/PipelineBackground/Pipes";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <div className="app-content">
          <Pipes />
          <Header />
          <MainPage />
          <Footer />
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
