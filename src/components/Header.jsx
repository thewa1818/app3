import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Button } from "@mui/material";
import "../components/fiestHome.css";

const Header = () => {
  return (
    <Container>
      <Box className="hero-section">
        <Box className="hero-overlay">
          <Box className="hero-buttons">
            <p className="hero-text">
              旅人の方はこちらのサービスをご利用ください。
            </p>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
            >
              ログインする
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="secondary"
            >
              新規ユーザー登録
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="admin-section">
        <Box className="admin-overlay">
          <Box className="admin-buttons">
            <p className="admin-text">
              ゲストハウス管理者の方はこちらで管理を行ってください。
            </p>
            <Button
              component={Link}
              to="/admin/login"
              variant="contained"
              color="primary"
            >
              ゲストハウス管理者ログイン
            </Button>
            <Button
              component={Link}
              to="/admin/signup"
              variant="contained"
              color="secondary"
            >
              ゲストハウス管理者新規登録
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Header;
