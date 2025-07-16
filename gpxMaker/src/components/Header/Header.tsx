"use client";

import { Box, Flex, HStack, Button, Heading, Stack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { MdOutlineCoffee } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import React from "react";

interface Props {
  children: React.ReactNode;
}

// export const Header = () => {
//   return (
//     <>
//       <Box
//         bg={"white"}
//         px={4}
//         justifyContent={"space-between"}
//         borderBlockColor={"gray"}
//         borderBottom={1}
//         borderBottomStyle={"groove"}
//         position={"sticky"}
//       >
//         <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
//           <HStack borderSpacing={23} alignItems={"center"}>
//             {<Icon as={FaMapMarkerAlt} />}
//             <Heading size="2xl">GMAP to GPX Generator</Heading>
//           </HStack>
//           <Flex alignItems={"center"}>
//             <Button variant={"solid"} bgColor={"#000435"} size={"sm"} mr={4}>
//               {<Icon as={MdOutlineCoffee} />}
//               Buy Me A Coffee
//             </Button>
//           </Flex>
//         </Flex>
//       </Box>
//     </>
//   );
// };

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
                  {<Icon as={MdOutlineCoffee} />}
                  Buy Me A Coffee
                </Button>
              </Flex>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
