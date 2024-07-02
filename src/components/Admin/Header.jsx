import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ログアウトしました。");
      navigate("/"); // ログアウト後にリダイレクトするURLを指定
    } catch (error) {
      alert("ログアウト時にエラーが発生しました。");
      console.error("ログアウトエラー:", error);
    }
  };

  const goToAdminHome = () => {
    // /admin/home ページに遷移する
    navigate("/admin/home");
  };

  const goToAdminForm = () => {
    // /admin/update ページに遷移する
    navigate("/admin/upload");
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Site
        </Typography>
        <Button color="inherit" onClick={goToAdminHome}>
          管理画面
        </Button>
        <Button color="inherit" onClick={goToAdminForm}>
          新規登録
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          ログアウト
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
