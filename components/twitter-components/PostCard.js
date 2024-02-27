import React, { useState } from "react";
import { Button, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";

function PostCard({ post }) {
  const toast = useToast();
  const [postContent, setPostContent] = useState(post.postContent);
  const [posting, setPosting] = useState(null);

  const tweetInstantly = () => {
    if (!postContent) return;
    setPosting(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/tweet-now`, {
        postContent,
      })
      .then((res) => {
        // console.log(res.data);
        setPosting(false);
        if (res.data.success) {
          toast({ status: "success", title: "Tweet was posted successfully!" });
        } else
          toast({
            status: "error",
            title: res.data.error || "Some error occured",
            description: res.data.errorDescription || "Please try again later",
          });
      })
      .catch((err) => {
        console.log(err);
        setPosting(false);
        toast({
          status: "error",
          title: "Internal server error.",
        });
      });
  };

  const saveDraft = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/save-draft`, {
        text: postContent,
      })
      .then((res) => {
        if (res.data.success) {
          toast({ status: "success", title: "Draft saved" });
        } else {
          toast({
            status: "error",
            title: res.data.error || "Internal server error",
          });
        }
      })
      .catch((err) => {
        toast({
          status: "error",
          title: res.data.error || "Internal server error",
        });
      });
  };
  return (
    <div>
      <div
        key={post.postContent}
        style={{
          margin: "15px 5px",
          padding: "10px",
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
        }}
      >
        <Textarea
          value={postContent}
          style={{
            border: "none",
            background: "#f4f4f4",
            padding: "10px",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "1.6",
            minHeight: "100px",
          }}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <Button
          size={"sm"}
          style={{ marginTop: "10px" }}
          colorScheme="blue"
          onClick={() => tweetInstantly()}
          isLoading={posting}
          loadingText={"Posting"}
        >
          Post Now →
        </Button>
        <Button
          size={"sm"}
          variant={"ghost"}
          style={{ marginTop: "10px", float: "right" }}
          colorScheme="blue"
          onClick={() => saveDraft()}
          isLoading={posting}
          loadingText={"Posting"}
        >
          Save Draft
        </Button>
      </div>
    </div>
  );
}

export default PostCard;
