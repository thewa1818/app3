import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Typography,
} from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const ContactButton = ({ postId }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(""); // Reset fields
    setEmail("");
    setGender("male");
    setAge("");
    setSubmittedData(null); // Reset submitted data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "userMessages"), {
        // userMessages コレクションに送信
        postId,
        message,
        email,
        gender,
        age,
        createdAt: serverTimestamp(),
      });
      console.log("Message sent successfully with ID: ", docRef.id);
      setSubmittedData({
        message,
        email,
        gender,
        age,
      });
      setSnackbarOpen(true); // Show snackbar on success
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ width: 140 }}>
        問い合わせする
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>問い合わせフォーム</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="message"
              label="メッセージ"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="email"
              label="連絡先メールアドレス"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormLabel component="legend">性別</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <FormControlLabel value="male" control={<Radio />} label="男性" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="女性"
              />
            </RadioGroup>
            <TextField
              margin="dense"
              id="age"
              label="年齢"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>キャンセル</Button>
            <Button type="submit" color="primary">
              送信する
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="送信が完了しました"
      />
      {submittedData && (
        <Dialog open={!!submittedData} onClose={handleClose}>
          <DialogTitle>送信された情報</DialogTitle>
          <DialogContent>
            <Typography>メッセージ: {submittedData.message}</Typography>
            <Typography>連絡先メールアドレス: {submittedData.email}</Typography>
            <Typography>性別: {submittedData.gender}</Typography>
            <Typography>年齢: {submittedData.age}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ContactButton;
