import React, { useState } from "react";
import { Box, Heading, Text, Image, Stack } from "@chakra-ui/react";
import Converter from "../Converter";
import Explainer from "../Explainer";

function CardFlip() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: any) => {
    const tag = e.target.tagName.toLowerCase();
    const isFormElement = ["input", "textarea", "select", "button"].includes(
      tag
    );
    if (isFormElement) return; // Don't flip if user is interacting with a form element

    setIsFlipped(!isFlipped);
  };

  const textColor = "gray.800";

  return (
    <Box
      width="500px"
      height="600px"
      position="relative"
      mt={10}
      onClick={handleFlip}
      style={{
        perspective: "1000px",
        paddingTop: "5%",
      }}
    >
      <Box
        className="card-inner"
        width="100%"
        height="100%"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Card Front */}
        <Box
          className="card-front"
          position="absolute"
          backfaceVisibility="hidden"
          color={textColor}
          borderRadius="md"
          boxShadow="md"
        >
          <Converter />
        </Box>
        {/* Card Back */}
        <Box
          className="card-back"
          position="absolute"
          backfaceVisibility="hidden"
          color={textColor}
          width="100%"
          p="4"
          borderRadius="md"
          boxShadow="md"
          style={{
            transform: "rotateY(180deg)",
          }}
        >
          <Explainer />
        </Box>
      </Box>
    </Box>
  );
}

export default CardFlip;
