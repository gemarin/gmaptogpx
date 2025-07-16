import { Container, Flex, Stack } from "@chakra-ui/react";
import Converter from "../components/Converter";
import React from "react";
import Explainer from "../components/Explainer";

export const MainPage = () => {
  return (
    <Stack direction={{ base: "column", md: "column-reverse" }}>
      <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"gray.50"}>
        <Converter />
        <Explainer />
      </Flex>
    </Stack>
  );
};
