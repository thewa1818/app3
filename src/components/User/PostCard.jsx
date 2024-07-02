import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ContactButton from "./ContactButton";
import MessageDisplay from "./MessageDisplay";

const PostCard = ({ post, handleFavoriteToggle, isFavorite }) => {
  return (
    <div className="card" key={post.id} style={{ paddingTop: 30 }}>
      <Card>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* タイトル */}
            <Typography variant="h5" component="div">
              {post.title}
            </Typography>
          </div>
          <Typography variant="body2" color="textSecondary">
            {post.text}
          </Typography>
          <div className="img-container">
            <img src={post.imageUrl} alt="Post" className="post-image" />
          </div>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ paddingTop: 5 }}
          >
            開始日: {post.startDate}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            終了日: {post.endDate}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ paddingBottom: 5 }}
          >
            場所: {post.location}
          </Typography>
          <div
            className="button-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <MessageDisplay post={post} />
            <ContactButton postId={post.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCard;
