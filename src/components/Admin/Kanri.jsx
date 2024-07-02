import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import Edit from "./Edit"; // Import the Edit component
import MessageList from "./MessageList";
import MessageIcon from "@mui/icons-material/Message";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Kanri = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [openMessages, setOpenMessages] = useState(false); // State for message list dialog

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postData = [];
        querySnapshot.forEach((doc) => {
          postData.push({ id: doc.id, ...doc.data() });
        });
        setPosts(postData);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedPost(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleUpdate = async (formData) => {
    if (selectedPost) {
      const postDocRef = doc(db, "posts", selectedPost.id);
      try {
        await updateDoc(postDocRef, formData);
        const updatedPosts = posts.map((post) =>
          post.id === selectedPost.id ? { ...post, ...formData } : post
        );
        setPosts(updatedPosts);
        setSnackbarMessage("投稿が更新されました");
        setOpenSnackbar(true);
        handleEditClose();
      } catch (error) {
        console.error("Error updating post: ", error);
      }
    }
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setOpenDeleteDialog(true); // Open delete confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    if (selectedPost) {
      const postDocRef = doc(db, "posts", selectedPost.id);
      try {
        await deleteDoc(postDocRef);
        const updatedPosts = posts.filter((p) => p.id !== selectedPost.id);
        setPosts(updatedPosts);
        setSnackbarMessage("投稿が削除されました");
        setOpenSnackbar(true);
        setOpenDeleteDialog(false); // Close delete confirmation dialog
      } catch (error) {
        console.error("Error deleting post: ", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false); // Close delete confirmation dialog without deleting
  };

  const handleMessagesClick = (post) => {
    setSelectedPost(post);
    setOpenMessages(true);
  };

  const handleMessagesClose = () => {
    setOpenMessages(false);
    setSelectedPost(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <div className="cards-container">
          {posts.map((post) => (
            <div className="card" key={post.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {post.text}
                  </Typography>
                  <div className="img-container">
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="post-image"
                    />
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    開始日: {post.startDate}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    終了日: {post.endDate}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    場所: {post.location}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    投稿日時: {post.timestamp?.toDate().toLocaleString()}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: 1,
                  }}
                >
                  <IconButton
                    aria-label="messages"
                    onClick={() => handleMessagesClick(post)}
                  >
                    <MessageIcon />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleEditClick(post)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteClick(post)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </div>
          ))}
        </div>
      </Box>

      {selectedPost && (
        <MessageList
          postId={selectedPost.id}
          open={openMessages}
          handleClose={handleMessagesClose}
        />
      )}

      <Edit
        open={openEdit}
        handleClose={handleEditClose}
        post={selectedPost}
        handleUpdate={handleUpdate}
      />

      <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>削除の確認</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            本当にこの投稿を削除しますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Kanri;
