import React, { useState, useEffect, useRef } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ModalChat from "./ModalChat";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const RealTimeChat = ({ postId }) => {
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "adminMessages"), // コレクション名を修正
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [postId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReply = (senderEmail) => {
    setReplyTo(senderEmail);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setReplyTo("");
  };

  const sendMessage = async (messageContent) => {
    try {
      await addDoc(collection(db, "adminMessages"), {
        postId: postId,
        message: messageContent,
        senderEmail: "admin@example.com",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <List sx={{ flex: 1, overflowY: "auto", marginBottom: "16px" }}>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            alignItems={
              message.senderEmail === "admin@example.com"
                ? "flex-end"
                : "flex-start"
            }
          >
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={message.message}
              secondary={
                <Typography variant="caption" color="textSecondary">
                  {message.senderEmail} -{" "}
                  {message.createdAt &&
                    message.createdAt.toDate().toLocaleString()}
                </Typography>
              }
              sx={{
                bgcolor:
                  message.senderEmail === "admin@example.com"
                    ? "#e0f7fa"
                    : "#f5f5f5",
                borderRadius: "10px",
                padding: "10px",
              }}
            />
            {message.senderEmail !== "admin@example.com" && (
              <Button onClick={() => handleReply(message.senderEmail)}>
                返信する
              </Button>
            )}
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      <Divider />
      <ModalChat
        open={modalOpen}
        handleClose={handleModalClose}
        senderEmail={replyTo}
        postId={postId}
        sendMessage={sendMessage} // sendMessage 関数を ModalChat に渡す
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
};

export default RealTimeChat;
