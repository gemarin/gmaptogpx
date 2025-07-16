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

export default function Converter() {
  const [routeNumber, setRouteNumber] = useState("");
  const [state, setState] = useState<
    "initial" | "submitting" | "success" | "error"
  >("initial");
  const [error, setError] = useState(false);

  const downloadGPX = async () => {
    try {
      const res = await fetch(`http://localhost:63431/api/gpx/${routeNumber}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      //TODO: change file name to optional name or just route number

      a.download = `route_${routeNumber}.gpx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to download GPX");
      setState("error");
    } finally {
      setState("initial");
      //TODO: set a popup success alert
      console.log("GPX download completed");
    }
  };

  const validInput = (input: string) => {
    if (input.includes("https")) return false;
  };

  return (
    <Container maxW={"lg"} bg={"white"} boxShadow={"xl"} rounded={"lg"} p={6}>
      <Heading
        as={"h2"}
        fontSize={{ base: "xl", sm: "2xl" }}
        textAlign={"center"}
        mb={5}
      >
        Enter a Gmap Pedometer Url or Route Number to convert it to GPX format
        that can be used with GPS devices and mapping applications.
      </Heading>
      <Stack
        direction={{ base: "column", md: "column" }}
        as={"form"}
        // spacing={"12px"}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          setError(false);
          setState("submitting");

          // remove this code and implement your submit logic right here
          try {
            setTimeout(() => {
              // if (email === "fail@example.com") {
              //   setError(true);
              //   setState("initial");
              //   return;
              // }
              downloadGPX();
            }, 1000);
          } catch (e) {}
        }}
      >
        <FormControl>
          <Input
            variant={"outline"}
            borderWidth={1}
            color={"gray.800"}
            _placeholder={{
              color: "gray.400",
            }}
            borderColor={"gray.300"}
            id={"routeNumber"}
            type={"text"}
            required
            placeholder={"www.gmap-pedometer.com/?r=#######"}
            aria-label={"www.gmap-pedometer.com/?r=#######"}
            value={routeNumber}
            disabled={error}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRouteNumber(e.target.value)
            }
          />
        </FormControl>
        <FormControl w={{ base: "100%", md: "40%" }}>
          <Button
            colorScheme={state === "success" ? "green" : "blue"}
            loading={state === "submitting"}
            w="100%"
            bgColor={"blue.500"}
            type={state === "success" ? "button" : "submit"}
          >
            {state === "success" ? <CheckIcon /> : "Generate GPX"}
          </Button>
        </FormControl>
      </Stack>
      <Text mt={2} textAlign={"center"} color={error ? "red.500" : "gray.500"}>
        {error
          ? "Oh no an error occured! 😢 Please try again later."
          : "Example: wwww.gmap-pedometer.com/?r=1234567 or 1234567."}
      </Text>
    </Container>
  );
}
