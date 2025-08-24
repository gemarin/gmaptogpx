"use client";

import {
  Box,
  Flex,
  HStack,
  Button,
  Heading,
  Stack,
  Icon,
  Link,
} from "@chakra-ui/react";
import { FaPenNib } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import React from "react";

export default function Footer() {
  return (
    <>
      <Box
        bg={"gray.100"}
        position={"fixed"}
        left={0}
        bottom={0}
        width={"100%"}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <HStack borderSpacing={23} alignItems={"center"}>
              {<Icon as={FaGithub} />}
              <Link href="https://github.com/gemarin/gmaptogpx">Repo</Link>
            </HStack>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"}>
              <Flex alignItems={"center"}>
                <Link href="https://www.linkedin.com/in/gaby-marin/">
                  {<Icon as={FaPenNib} />}
                  Created By Gaby Marin
                </Link>
              </Flex>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
