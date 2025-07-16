"use client";

import {
  Button,
  Input,
  Stack,
  Heading,
  Text,
  Container,
  Flex,
} from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import React, { FormEvent, ChangeEvent, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import { HiOutlineMapPin } from "react-icons/hi2";

interface Props {
  children: React.ReactNode;
}

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
      <Stack
      // direction={{ base: "column", md: "row" }}
      // as={"form"}
      // spacing={"12px"}
      >
        <Text mt={2} textAlign={"center"} color={"gray.500"}>
          {
            " Enter GMap Pedometer URL. Paste a URL from GMap Pedometer or just the route number. The URL should look like this: www.gmap-pedometer.com/?r=1234567 or the route number can be just the 1234567 (the number at the end of the url). Please do not include https:// in your link."
          }
        </Text>
        <Text mt={2} textAlign={"center"} color={"gray.500"}>
          {
            "Processing. The app loads the route page, extracts the actual route coordinates and elevation data, and converts them into standard GPX format with all required metadata."
          }
        </Text>
        <Text mt={2} textAlign={"center"} color={"gray.500"}>
          {
            "Download or Copy. The GPX file will automatically download for you or you can copy it to your clipboard."
          }
        </Text>
        <Text mt={2} textAlign={"center"} color={"gray.500"}>
          {
            "Note. This tool only works with public routes from gmap-pedometer.com. The conversion process uses browser automation to extract the route data. Please be patient as this may take a few seconds."
          }
        </Text>
      </Stack>
    </Container>
  );
}
