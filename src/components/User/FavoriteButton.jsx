import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const FavoriteButton = ({ postId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkIfFavorite = async (userId) => {
      const userRef = doc(db, "favorites", userId);
      const userDoc = await getDoc(userRef);
      setIsFavorite(
        userDoc.exists() && userDoc.data().favorites.includes(postId)
      );
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        checkIfFavorite(user.uid);
      } else {
        setCurrentUser(null);
        setIsFavorite(false);
      }
    });

    return () => unsubscribe();
  }, [postId]);

  const handleFavoriteToggle = async () => {
    if (!currentUser) return;

    const userRef = doc(db, "favorites", currentUser.uid);
    const userDoc = await getDoc(userRef);
    let userFavorites = userDoc.exists() ? userDoc.data().favorites : [];

    if (userFavorites.includes(postId)) {
      userFavorites = userFavorites.filter((fav) => fav !== postId);
    } else {
      userFavorites.push(postId);
    }

    await setDoc(userRef, { favorites: userFavorites });
    setIsFavorite(userFavorites.includes(postId));
  };

  return (
    <IconButton onClick={handleFavoriteToggle}>
      {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

export default FavoriteButton;
