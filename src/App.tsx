import {
  ChakraProvider, theme
} from "@chakra-ui/react"
import * as React from "react"
import PathVisualizer from "./PathVisualizer/PathVisualizer"

export const App = () => (
  <ChakraProvider theme={theme}>
    <PathVisualizer />
  </ChakraProvider>
)
