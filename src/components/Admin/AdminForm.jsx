import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ImageLogo from "./image.svg";
import "./AdminForm.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

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

const AdminForm = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("画像を選択してください。");
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        text,
        imageUrl,
        location,
        startDate,
        endDate,
        timestamp: new Date(),
      });

      console.log("Document written with ID: ", docRef.id); // ドキュメントIDをコンソールに出力

      alert("データが正常に登録されました。");

      setTitle("");
      setText("");
      setImage(null);
      setImagePreview(null);
      setLocation("");
      setStartDate("");
      setEndDate("");
      navigate("/admin/kanri");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("データの登録に失敗しました。");
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, pt: 8 }}>
          <Typography variant="h4" gutterBottom>
            新規登録する
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="タイトル"
              margin="normal"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="テキスト"
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>場所</InputLabel>
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                label="場所"
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <div className="outerBox">
              <div className="title">
                <h2>画像アップローダー</h2>
                <p>JpegかPngの画像ファイル</p>
              </div>
              <div className="imageUploadBox">
                <div className="imageLogoAndText">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="imagePreview"
                    />
                  ) : (
                    <>
                      <img src={ImageLogo} alt="imagelogo" />
                      <p>ここにドラッグ＆ドロップしてね</p>
                    </>
                  )}
                </div>
                <input
                  className="imageUploadInput"
                  type="file"
                  onChange={handleImageChange}
                  required
                />
              </div>
              <p>または</p>
              <Button variant="contained" component="label">
                ファイルを選択
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Button>
            </div>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 20 }}
            >
              登録する
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default AdminForm;
