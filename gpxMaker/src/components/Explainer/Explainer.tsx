"use client";

import { Stack, Heading, Text, Container } from "@chakra-ui/react";
import React from "react";

const headerAndDescription = [
  {
    header: "Enter GMAP Pedometer URL",
    description: `Paste a route number from the GMAP Pedometer URL. The URL should look like this: www.gmap-pedometer.com/?r=1234567, with the route number being the value after r= (ex: 1234567).`,
  },
  {
    header: "Processing",
    description:
      "The app loads the route page, extracts the actual route coordinates and elevation data, and converts them into standard GPX format with all required metadata.",
  },
  {
    header: "Download or Copy",
    description: "The GPX file will automatically download for you.",
  },
  {
    header: "Note",
    description:
      "This tool only works with public routes from gmap-pedometer.com. The conversion process uses browser automation to extract the route data. Please be patient as this may take a few seconds.",
  },
];

export default function Explainer() {
  return (
    <Container maxW={"lg"} bg={"white"} boxShadow={"xl"} rounded={"lg"} p={6}>
      <Heading
        as={"h2"}
        fontSize={{ base: "xl", sm: "2xl" }}
        textAlign={"center"}
        mb={5}
      >
        How It Works
      </Heading>
      <Stack>
        {headerAndDescription.map((item, index) => (
          <Stack key={index} mb={4}>
            <Heading as={"h4"} fontSize={"lg"} mb={2}>
              {item.header}
            </Heading>
            <Text mt={2} color={"gray.500"}>
              {item.description}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
