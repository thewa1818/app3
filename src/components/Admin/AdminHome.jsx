import React from "react";
import { Container, Box } from "@mui/material";
import Kanri from "./Kanri";
import Header from "./Header";

const AdminHome = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Header />
        <Box sx={{ pt: 8 }}>
          <Kanri />
        </Box>
      </Box>
    </Container>
  );
};

export default AdminHome;
