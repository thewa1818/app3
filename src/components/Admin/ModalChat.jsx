import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const ModalChat = ({
  open,
  handleClose,
  senderEmail,
  postId,
  refreshMessages,
}) => {
  const [reply, setReply] = useState("");

  const handleReplySubmit = async () => {
    try {
      await addDoc(collection(db, "messages"), {
        postId,
        message: reply,
        createdAt: serverTimestamp(),
        senderEmail: "admin@example.com", // 管理者のメールアドレス
        replyTo: senderEmail, // 返信先のメールアドレス
        adminMessage: true, // 管理者メッセージフラグ
      });
      setReply(""); // 送信後に入力欄をクリア
      refreshMessages(); // メッセージ更新
    } catch (error) {
      console.error("Error sending reply: ", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>メッセージを返信する</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reply"
          label="メッセージを入力"
          type="text"
          fullWidth
          multiline
          rows={2}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <Divider style={{ margin: "10px 0" }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          閉じる
        </Button>
        <Button onClick={handleReplySubmit} color="primary">
          送信する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalChat;
