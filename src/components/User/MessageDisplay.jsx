import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const MessageDisplay = ({ post }) => {
  const [showReply, setShowReply] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, "messages"),
        where("postId", "==", post.id),
        where("adminMessage", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort messages by createdAt in descending order (newest first)
      fetchedMessages.sort(
        (a, b) => b.createdAt.toDate() - a.createdAt.toDate()
      );

      setMessages(fetchedMessages);
      setLoading(false);
    };

    fetchMessages();
  }, [post.id]);

  const handleToggleReply = () => {
    setShowReply(!showReply);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleToggleReply}>
          <EmailIcon />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          返信を確認
        </Typography>
      </div>
      {showReply && (
        <List style={{ borderTop: "1px solid gray" }}>
          {loading ? (
            <ListItem>
              <ListItemText primary="読み込み中..." />
            </ListItem>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <ListItem alignItems="flex-start" key={message.id}>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      <b>管理者の返信:</b> {message.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="textSecondary">
                      送信日時: {message.createdAt.toDate().toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="まだ返信はありません" />
            </ListItem>
          )}
        </List>
      )}
    </div>
  );
};

export default MessageDisplay;
