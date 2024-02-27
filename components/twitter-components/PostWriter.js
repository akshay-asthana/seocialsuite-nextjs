import { Button, IconButton, Textarea, useToast } from "@chakra-ui/react";
import { Input, Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import TweetCard from "./TweetCard";
import PostCard from "./PostCard";

const tones = [
  "Conversational",
  "Bold",
  "Candid",
  "Sarcastic",
  "Comical",
  "Funny",
  "Informative",
  "Inspiring",
  "Optimistic",
  "Pessimistic",
  "Friendly",
  "Professional",
  "Worried",
  "Curious",
  "Encouraging",
];

const tweet_types = [
  "Observation",
  "Question",
  "Personal Anecdote",
  "Story from a friend",
  "Story from family",
  "My experience",
  "Scientific fact",
];

function PostWriter({
  hidePostWriter,
  selectedTweet = null,
  setSelectedTweet = () => {},
}) {
  const [inputTopic, setInputTopic] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [postParams, setPostParams] = useState({
    tone: null,
    type: null,
    useHashtags: false,
  });
  const toast = useToast();

  useEffect(() => {
    generateSimilarPosts();
  }, [selectedTweet]);

  const generatePosts = () => {
    setLoadingPost(true);
    setSelectedTweet(null);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/generate-post`, {
        topic: inputTopic,
        postParams,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          setLoadingPost(false);
          setGeneratedPosts(res.data?.posts?.posts);
        }
      })
      .catch((err) => {
        setLoadingPost(false);
        console.log(err);
        toast({
          status: "error",
          title: "Error reaching servers",
          description: "Please try again later",
        });
      });
  };
  const generateSimilarPosts = () => {
    if (!selectedTweet) return;
    setLoadingPost(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/generate-similar`, {
        tweetText: selectedTweet?.text,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          setLoadingPost(false);
          setGeneratedPosts(res.data?.posts?.posts);
        }
      })
      .catch((err) => {
        setLoadingPost(false);
        console.log(err);
        toast({
          status: "error",
          title: "Error reaching servers",
          description: "Please try again later",
        });
      });
  };

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        overflow: "scroll",
        paddingBottom: "20px",
      }}
    >
      <IconButton
        onClick={() => hidePostWriter()}
        variant="link"
        size="sm"
        icon={<IoMdClose />}
        style={{
          position: "absolute",
          left: "5px",
          top: "5px",
          borderRadius: "5px",
        }}
      />
      <div style={{ fontSize: "22px", fontWeight: "600" }}>
        Super Post Writer
      </div>
      <div>
        <div
          style={{ textAlign: "left", margin: "10px 20px", fontSize: "14px" }}
        >
          Topic or instructions:
        </div>
        <div>
          <Input
            value={inputTopic}
            onChange={(e) => setInputTopic(e.target.value)}
            style={{ width: "90%" }}
            placeholder="Generate tweets on ..."
          />
          <div
            style={{
              margin: "10px 0px",
              display: "flex",
              padding: "0px 5px ",
              justifyContent: "space-evenly",
            }}
          >
            <div style={{}}>
              <Select
                placeholder="Select tone"
                size={"xs"}
                variant={"filled"}
                onChange={(e) =>
                  setPostParams({ ...postParams, tone: e.target.value })
                }
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </Select>
            </div>
            <div style={{}}>
              <Select
                placeholder="Select format"
                size={"xs"}
                variant={"filled"}
                onChange={(e) =>
                  setPostParams({ ...postParams, type: e.target.value })
                }
              >
                {tweet_types.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <Button
            style={{ marginTop: "5px" }}
            colorScheme="blue"
            onClick={() => generatePosts()}
            loadingText={"Generating"}
            isLoading={loadingPost}
          >
            Generate
          </Button>
        </div>
      </div>
      <div style={{ height: "20px" }} />
      {selectedTweet && (
        <div style={{ display: "grid", justifyContent: "center" }}>
          <TweetCard
            tweet={selectedTweet}
            generateSimilar={() => generateSimilarPosts()}
          />
        </div>
      )}
      {generatedPosts.length > 0 && (
        <div style={{ textAlign: "left", padding: "5px 10px" }}>
          <div
            style={{ fontSize: "18px", fontWeight: "500", padding: "0px 10px" }}
          >
            {selectedTweet ? "Similar" : "Generated"} Posts:
          </div>
          {generatedPosts.map((post) => (
            <PostCard key={post.postContent} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PostWriter;
