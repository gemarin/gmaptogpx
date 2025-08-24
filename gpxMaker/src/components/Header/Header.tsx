"use client";

import { Box, Flex, HStack, Button, Heading, Stack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { FaHandHoldingHeart } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import React from "react";

export default function Header() {
  return (
    <>
      <Box bg={"gray.100"} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <HStack borderSpacing={23} alignItems={"center"}>
              {<Icon as={FaMapMarkerAlt} />}
              <Heading size="2xl">GMAP to GPX Generator</Heading>
            </HStack>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} wordSpacing={7}>
              <Flex alignItems={"center"}>
                <Button
                  variant={"solid"}
                  bgColor={"blue.600"}
                  size={"sm"}
                  mr={4}
                >
                  {<Icon as={FaHandHoldingHeart} />}
                  Enjoy This Tool? Consider Donating!
                </Button>
              </Flex>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
