"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast, Button, Input, Switch } from "@chakra-ui/react";
import TweetCard from "./TweetCard";
import Loading from "../../app/loading";
import { useSession } from "next-auth/react";

function page({ generateSimilar }) {
  const [handle, setHandle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [tuser, setTuser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [savedTweetIds, setSavedTweetIds] = useState([]);
  const toast = useToast();

  const { status } = useSession();

  // useEffect(() => {
  //   setKeyword(null);
  //   getTimelineTweetsByHandle();
  // }, [handle]);
  // useEffect(() => {
  //   setHandle(null);
  //   searchKeyword();
  // }, [keyword]);

  useEffect(() => {
    if (status === "authenticated") getSavedTweetIds();
  }, [status]);

  const getSavedTweetIds = async () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/saved-tweets?id=true`)
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          const savedIds = res.data.savedTweets.map((t) => t.id);
          setSavedTweetIds(savedIds);
        } else {
          toast({
            status: "error",
            title: res.data.error || "Error getting saved tweets",
            errorDescription: res.data.errorDescription || "Please try again",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          status: "error",
          title: "Error reaching servers",
          errorDescription: "Please try again later",
        });
      });
  };

  const getTimelineTweetsByHandle = async (inputValue) => {
    if (!inputValue) return;
    setHandle(inputValue);
    setLoading(true);
    axios
      .get(
        cursor
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/get-handle-tweets/${inputValue}?cursor=${cursor}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/posts/get-handle-tweets/${inputValue}`
      )
      .then((res) => {
        setLoading(false);
        // console.log(res.data);
        if (res.data?.success) {
          setTuser(res.data?.tuser);
          setTweets([...tweets, ...res.data?.tweets]);
          setCursor(res.data.cursor);
        } else
          toast({
            status: "error",
            title: res.data?.error || "Internal Server error",
          });
      })
      .catch((err) => {
        setLoading(false);
        setHandle(null);
        console.log(err);
        toast({ status: "error", title: "Some error occured" });
      });
  };

  const searchKeyword = async (inputValue) => {
    if (!inputValue) return;
    setKeyword(inputValue);
    setLoading(true);
    axios
      .get(
        cursor
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/search/${inputValue}?cursor=${cursor}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/posts/search/${inputValue}`
      )
      .then((res) => {
        setLoading(false);
        // console.log(res.data);
        if (res.data?.success) {
          setTuser(null);
          setTweets([...tweets, ...res.data?.tweets]);
          setCursor(res.data.cursor);
        } else
          toast({
            status: "error",
            title: res.data?.error || "Internal Server error",
          });
      })
      .catch((err) => {
        setLoading(false);
        setKeyword(null);
        console.log(err);
        toast({ status: "error", title: "Some error occured" });
      });
  };

  return (
    <div>
      <div style={{ fontSize: "22px", fontWeight: "700", marginTop: "50px" }}>
        Tweet Library
      </div>

      <div>
        <Input
          onKeyDown={(e) => e.key === "Enter" && setHandle(e.target.value)}
          placeholder="Enter twitter handle or keyword"
          style={{ width: "600px", marginTop: "20px", marginBottom: "10px" }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ marginRight: "10px" }}
            colorScheme="blue"
            onClick={() => getTimelineTweetsByHandle(inputValue)}
          >
            Get Handle Tweets
          </Button>
          <Button
            style={{}}
            colorScheme="blue"
            onClick={() => searchKeyword(inputValue)}
          >
            Get Keyword Tweets
          </Button>
        </div>
      </div>

      <div style={{ margin: "10px 0px" }}>
        {["NavalismHQ", "elonmusk", "ArvidKahl", "AlexHormozi"].map(
          (handle) => (
            <Button
              key={handle}
              size="xs"
              variant={"outline"}
              onClick={() => getTimelineTweetsByHandle(handle)}
              style={{ borderRadius: "5px", margin: "5px" }}
            >
              {handle}
            </Button>
          )
        )}
      </div>
      {loading && (
        <div>
          <Loading />
        </div>
      )}

      <div style={{ margin: "20px" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "600",
            position: "fixed",
            top: "70px",
            left: "0px",
            zIndex: "200",
            padding: "5px",
            border: "1px solid #e6e6e6",
            borderRadius: "5px",
            background: "white",
          }}
        >
          {/* <span style={{ marginLeft: "100px" }}>Tweets</span> */}
          <div
            style={{
              display: "inline-block",
              float: "right",
            }}
          >
            Engagement Mode:{" "}
            <Switch
              onChange={(e) => setShowReplyBox(!showReplyBox)}
              value={showReplyBox}
              style={{ marginTop: "-3px", marginLeft: "3px" }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {tweets?.length > 0 &&
          tweets.map((tweet) => (
            <TweetCard
              key={tweet.tweet_id}
              tweet={tweet}
              user={tuser}
              generateSimilar={() => generateSimilar(tweet)}
              showReplyBox={showReplyBox}
              savedTweetIds={savedTweetIds}
              setSavedTweetIds={(ids) => setSavedTweetIds(ids)}
            />
          ))}
      </div>
      {cursor && (
        <Button
          style={{ margin: "10px", marginBottom: "40px" }}
          onClick={() => getTimelineTweetsByHandle()}
          variant={"outline"}
          isLoading={loading}
          loadingText={"Loading more tweets"}
        >
          Load more
        </Button>
      )}
    </div>
  );
}

export default page;
