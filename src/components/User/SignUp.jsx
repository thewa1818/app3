import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ローディングステートを追加
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // ローディング開始

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/userhome"); // リダイレクト
    } catch (error) {
      // Firebaseからのエラーコードに応じたエラーメッセージを設定
      switch (error.code) {
        case "auth/weak-password":
          setError("パスワードが弱すぎます。もう一度お試しください。");
          break;
        case "auth/email-already-in-use":
          setError(
            "そのメールアドレスは既に使用されています。別のメールアドレスをお試しください。"
          );
          break;
        case "auth/invalid-email":
          setError(
            "無効なメールアドレス形式です。正しい形式で入力してください。"
          );
          break;
        default:
          setError("新規登録に失敗しました。もう一度お試しください。");
          break;
      }
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          新規ユーザー登録
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading} // ローディング中はボタンを無効化
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "登録する"}
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
