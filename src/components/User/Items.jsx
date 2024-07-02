import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";

import "./Items.css";
import PrefectureSelector from "./PrefectureSelector";

import PostCard from "./PostCard"; // 新しいコンポーネントをインポート

const Items = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all"); // 'all', 'period', 'location', 'favorites'
  const [selectedPrefectures, setSelectedPrefectures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const postData = [];
        querySnapshot.forEach((doc) => {
          postData.push({ id: doc.id, ...doc.data() });
        });
        setPosts(postData);
        setFilteredPosts(postData); // 最初は全ての投稿を表示する
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();

    // リアルタイムでのデータ更新
    const unsubscribe = onSnapshot(collection(db, "posts"), (querySnapshot) => {
      const postData = [];
      querySnapshot.forEach((doc) => {
        postData.push({ id: doc.id, ...doc.data() });
      });
      setPosts(postData);
      setFilteredPosts(postData); // データ更新時にもフィルタリング
    });

    return () => unsubscribe(); // クリーンアップ関数でunsubscribe
  }, []);

  // 検索フォームでのフィルタリング
  useEffect(() => {
    if (searchType === "all") {
      setFilteredPosts(posts);
    } else if (searchType === "period") {
      const filtered = posts.filter((post) => {
        return (
          post.startDate &&
          post.endDate &&
          searchTerm >= post.startDate &&
          searchTerm <= post.endDate
        );
      });
      setFilteredPosts(filtered);
    } else if (searchType === "location") {
      const filtered = posts.filter((post) => {
        return selectedPrefectures.includes(post.location);
      });
      setFilteredPosts(filtered);
    }
  }, [searchType, searchTerm, posts, selectedPrefectures]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm(""); // 検索タイプが変更されたら、検索キーワードをリセット
  };

  const handlePrefectureChange = (value) => {
    setSelectedPrefectures(value); // 都道府県選択の変更を処理
    setSearchType("location"); // 検索タイプを場所で検索に変更
  };

  return (
    <div className="items-container">
      <div className="search-container">
        <FormControl sx={{ minWidth: 200, marginRight: 2, pb: 3 }}>
          <InputLabel htmlFor="search-type-select" shrink>
            検索条件
          </InputLabel>
          <Select
            value={searchType}
            onChange={handleSearchTypeChange}
            inputProps={{ id: "search-type-select" }}
            sx={{ minWidth: 150 }} // セレクトボックスの幅を調整
          >
            <MenuItem value="all">全ての投稿</MenuItem>
            <MenuItem value="period">期間で検索</MenuItem>
            <MenuItem value="location">場所で検索</MenuItem>
          </Select>
        </FormControl>
        {searchType === "period" && (
          <TextField
            type="date"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        )}
        {searchType === "location" && (
          <PrefectureSelector
            value={selectedPrefectures}
            onChange={handlePrefectureChange}
          />
        )}
      </div>
      <div className="cards-container">
        {[...filteredPosts].reverse().map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Items;
