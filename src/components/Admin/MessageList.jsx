import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Avatar,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModalChat from "./ModalChat";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const MessageList = ({ postId, open, handleClose, userMessage }) => {
  const [messages, setMessages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(""); // 返信先のメールアドレス
  const [modalOpen, setModalOpen] = useState(false); // Modal open state

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, "userMessages"),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    };

    if (open) {
      fetchMessages();
    }
  }, [open, postId]);

  useEffect(() => {
    // userMessage が空でない場合、messages ステートに追加する
    if (userMessage) {
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }
  }, [userMessage]);

  const handleReply = (senderEmail) => {
    setReplyTo(senderEmail);
    setModalOpen(true); // Open the modal when replying
  };

  const refreshMessages = async () => {
    const q = query(
      collection(db, "userMessages"),
      where("postId", "==", postId)
    );
    const querySnapshot = await getDocs(q);
    const messagesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMessages(messagesData);
    setModalOpen(false); // Close modal after refreshing messages
    setSnackbarOpen(true); // Show snackbar after sending reply
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSendReply = async (messageContent) => {
    try {
      // Firestore に返信を追加
      const messageRef = doc(db, "adminMessages");
      await updateDoc(messageRef, {
        adminMessage: true,
        postId: postId,
        message: messageContent,
        senderEmail: "admin@example.com",
        createdAt: serverTimestamp(),
      });
      await refreshMessages();
    } catch (error) {
      console.error("Error sending reply: ", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>メッセージリスト</DialogTitle>
        <DialogContent dividers>
          <List sx={{ maxHeight: "60vh", overflow: "auto" }}>
            {messages.length === 0 ? (
              <Typography variant="body1">
                まだ問い合わせはありません。
              </Typography>
            ) : (
              messages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <Avatar sx={{ mr: 1 }}>
                        <AccountCircleIcon />
                      </Avatar>
                      <ListItemText
                        primary={message.message}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              メールアドレス: {message.email}
                              <br />
                              性別: {message.gender}
                              <br />
                              年齢: {message.age}
                              <br />
                            </Typography>
                            <br />
                            {message.createdAt &&
                              message.createdAt.toDate().toLocaleString()}
                          </React.Fragment>
                        }
                      />
                    </Box>
                    {!message.adminMessage && (
                      <Button
                        variant="outlined"
                        onClick={() => handleReply(message.email)}
                        sx={{ ml: 2 }}
                      >
                        返信する
                      </Button>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Chat Component */}
      <ModalChat
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        senderEmail={replyTo}
        postId={postId}
        sendMessage={handleSendReply} // handleSendReply を渡す
        refreshMessages={refreshMessages}
      />

      {/* Snackbar for Reply Sent Confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="返信が送信されました"
      />
    </>
  );
};

export default MessageList;
