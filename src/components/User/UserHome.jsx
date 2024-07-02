import React from "react";
import { Container, Box } from "@mui/material";

import Items from "./Items";
import Header from "./Header";

const UserHome = () => {
  return (
    <Container maxWidth="sm">
      <Box>
        <Header />
        <Box sx={{ pt: 8 }}>
          <Items />
        </Box>
      </Box>
    </Container>
  );
};

export default UserHome;
