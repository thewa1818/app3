import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const Edit = ({ open, handleClose, post, handleUpdate }) => {
  const [editedPost, setEditedPost] = useState(post);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setEditedPost(post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost({ ...editedPost, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = editedPost.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const formData = {
        ...editedPost,
        imageUrl: imageUrl,
      };
      await handleUpdate(formData); // Firestore の更新
      setImageFile(null);
      setImageUrl("");
    } catch (error) {
      console.error("Error updating post with image: ", error);
    }
  };

  if (!editedPost) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>投稿を編集する</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="タイトル"
            margin="normal"
            variant="outlined"
            name="title"
            value={editedPost.title || ""}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="テキスト"
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
            name="text"
            value={editedPost.text || ""}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="location-label">場所</InputLabel>
            <Select
              labelId="location-label"
              name="location"
              value={editedPost.location || ""}
              onChange={handleChange}
              required
            >
              {prefectures.map((prefecture) => (
                <MenuItem key={prefecture} value={prefecture}>
                  {prefecture}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="開始日"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            name="startDate"
            value={editedPost.startDate || ""}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="終了日"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            name="endDate"
            value={editedPost.endDate || ""}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          {imageUrl && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                現在の画像プレビュー:
              </Typography>
              <img src={imageUrl} alt="Post" style={{ maxWidth: "100%" }} />
            </Box>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button type="submit" color="primary">
            更新する
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Edit;
