"use client";

import {
  Button,
  Input,
  Stack,
  Heading,
  Text,
  Container,
  Link,
} from "@chakra-ui/react";
import { MdDownloadDone } from "react-icons/md";

import { FormControl } from "@chakra-ui/form-control";
import React, { FormEvent, ChangeEvent, useState } from "react";

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
    }
  };

  const validInput = (input: string) => {
    if (input) return false;
  };

  return (
    <Container maxW={"lg"} bg={"white"} boxShadow={"xl"} rounded={"lg"} p={6}>
      <Heading
        as={"h2"}
        fontSize={{ base: "xl", sm: "2xl" }}
        textAlign={"center"}
        mb={5}
      >
        Enter a GMAP Pedometer Route Number to convert it to GPX format.
      </Heading>
      <Stack
        direction={{ base: "column", md: "column" }}
        as={"form"}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          setError(false);
          setState("submitting");

          try {
            setTimeout(() => {
              downloadGPX();
            }, 1000);
          } catch (e) {
            setError(true);
            setState("error");
          }
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
            {state === "success" ? <MdDownloadDone /> : "Generate GPX"}
          </Button>
        </FormControl>

        <Text mt={2} justifyContent={"center"} color={"red.500"}>
          {error ?? "Oh no an error occured! 😢 Please try again later."}
        </Text>
        <Link justifyContent={"center"} color={"gray.500"}>
          Click Here to Learn How it Works!
        </Link>
      </Stack>
    </Container>
  );
}
