"use client";
import React, { useEffect, useState } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  Avatar,
  Tooltip,
  Button,
  IconButton,
  Textarea,
  useToast,
  Input,
} from "@chakra-ui/react";
import axios from "axios";

import { AiOutlineRetweet, AiOutlineHeart } from "react-icons/ai";
import { GoReply, GoLinkExternal } from "react-icons/go";
import { VscComment } from "react-icons/vsc";
import { GoEye } from "react-icons/go";
import { CiBookmark } from "react-icons/ci";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";

import { formatViews } from "@/utils/utils";
import { formatDistance } from "date-fns";
import ImageGallery from "react-image-gallery";
import { useSession } from "next-auth/react";

const replyTypes = [
  "One Liner",
  "One Word",
  "Agree",
  "Disagree",
  "Controversial",
  "Question",
  "Quote",
  "Congrats",
  "Inspiring",
  "Thanks",
  "Funny",
  "Sarcastic",
  "Happy",
  "Angry",
  "Sad",
  "Support",
  "Add value",
  "Follow up",
];

function TweetCard({
  tweet,
  user,
  generateSimilar = () => {},
  showReplyBox = false,
  savedTweetIds,
  setSavedTweetIds = () => {},
}) {
  const [replyText, setReplyText] = useState("");
  const [selectedReplyTypes, setSelectedReplyTypes] = useState([]);
  const [selectedReplyType, setSelectedReplyType] = useState("");

  const [replyInstruction, setReplyInstruction] = useState("");
  const [loadingAIReply, setLoadingAIReply] = useState(false);
  const [postingReply, setPostingReply] = useState(false);
  const [isSaved, setIsSaved] = useState(
    savedTweetIds.includes(tweet.tweet_id)
  );
  const { status } = useSession();

  const toast = useToast();
  // console.log(tweet);

  useState(() => {
    if (status === "authenticated" && !savedTweetIds) checkSavedTweet();
  }, [status]);

  useEffect(() => {
    setIsSaved(savedTweetIds.includes(tweet.tweet_id));
  }, [savedTweetIds]);

  const getAIReply = () => {
    if (!tweet || !tweet.text) return;
    setLoadingAIReply(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/generate-reply`, {
        postContent: tweet.text,
        // selectedReplyTypes,
        selectedReplyType,
        instruction: replyInstruction,
      })
      .then((res) => {
        setLoadingAIReply(false);
        // console.log(res.data);
        if (res.data.success) {
          setReplyText(res.data.reply);
        } else
          toast({
            status: "error",
            title: res.data.error || "Some error occured",
          });
      })
      .catch((err) => {
        setLoadingAIReply(false);
        console.log(err);
        toast({
          status: "error",
          title: "Internal server error.",
        });
      });
  };

  const replyInstantly = () => {
    if (!tweet || !replyText) return;
    setPostingReply(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/reply-now`, {
        postContent: replyText,
        tweet_id: tweet.tweetId,
      })
      .then((res) => {
        // console.log(res.data);
        setPostingReply(false);
        setReplyText("");
        if (res.data.success) {
          toast({ status: "success", title: res.data.message });
        } else
          toast({
            status: "error",
            title: res.data.error || "Some error occured",
          });
      })
      .catch((err) => {
        setPostingReply(false);
        console.log(err);
        toast({
          status: "error",
          title: "Internal server error.",
        });
      });
  };

  const checkSavedTweet = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/check-saved-post`, {
        tweet_id: tweet.tweet_id,
      })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          isSaved(res.data.isSaved);
        } else
          toast({
            status: "error",
            title: res.data.error || "Some error occured",
          });
      })
      .catch((err) => {
        console.log(err);
        toast({
          status: "error",
          title: "Internal server error.",
        });
      });
  };

  const toggleSaveTweet = () => {
    axios
      .post(
        isSaved
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/remove-saved-post`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/posts/save-post`,
        {
          tweet_id: tweet.tweet_id,
        }
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          setSavedTweetIds(
            isSaved
              ? savedTweetIds.filter((tid) => tid !== tweet.tweet_id)
              : [tweet.tweet_id, ...savedTweetIds]
          );
        } else
          toast({
            status: "error",
            title: res.data.error || "Some error occured",
          });
      })
      .catch((err) => {
        console.log(err);
        toast({
          status: "error",
          title: "Internal server error.",
        });
      });
  };
  // if (tweet.media?.video) console.log(tweet);

  return (
    tweet && (
      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "5px",
          margin: "25px 10px",
          display: "flex",
          // boxShadow: "5px 5px 10px rgba(240,240,240,100%)",
        }}
      >
        <div
          style={{
            padding: "5px",
            width: "350px",
            textAlign: "left",
            position: "relative",
            minHeight: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "5px 5px",
              position: "relative",
            }}
          >
            <Avatar
              size="sm"
              name={tweet.author?.name}
              src={tweet.author?.avatar}
            />
            <div style={{ margin: "0px 10px" }}>
              <div>{tweet.author?.name}</div>
              <div style={{ fontSize: "14px", fontWeight: "300" }}>
                @{tweet.author?.screen_name}
              </div>
            </div>
            <span
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "5px",
                right: "5px",
              }}
              onClick={(e) =>
                window.open(`https://twitter.com/user/status/${tweet.tweet_id}`)
              }
            >
              <Tooltip label={"View tweet"}>
                <GoLinkExternal />
              </Tooltip>
            </span>
          </div>

          <div style={{ padding: "5px", marginBottom: "100px" }}>
            {tweet?.text}
            <div style={{ marginTop: "5px" }}>
              {tweet.media?.photo?.length > 0 && (
                <ImageGallery
                  showThumbnails={tweet.media?.photo?.length > 1}
                  showNav={false}
                  showPlayButton={false}
                  // showFullscreenButton={false}
                  items={tweet.media?.photo.map((i) => {
                    return {
                      original: i.media_url_https,
                      thumbnail: i.media_url_https,
                    };
                  })}
                />
              )}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "5px",
              left: "0px",
              width: "100%",
              marginTop: "20px",
              padding: "0px 10px",
            }}
          >
            <div
              style={{
                textAlign: "right",
                fontWeight: "300",
                margin: "5px",
                fontSize: "14px",
              }}
            >
              {tweet?.created_at &&
                formatDistance(tweet?.created_at, new Date(), {
                  addSuffix: true,
                  comparisonPredicate: true,
                })}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "300",
                  fontSize: "14px",
                }}
              >
                <span style={{ marginRight: "3px" }}>
                  <AiOutlineHeart />
                </span>
                <span style={{}}>{formatViews(tweet?.favorites)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "300",
                  fontSize: "14px",
                }}
              >
                <span style={{ marginRight: "3px" }}>
                  <AiOutlineRetweet />
                </span>
                <span style={{}}>{formatViews(tweet?.retweets)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "300",
                  fontSize: "14px",
                }}
              >
                <span style={{ marginRight: "3px" }}>
                  <CiBookmark />
                </span>
                <span style={{}}>{formatViews(tweet?.bookmarks)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "300",
                  fontSize: "14px",
                }}
              >
                <span style={{ marginRight: "3px" }}>
                  <GoEye />
                </span>
                <span style={{}}>{formatViews(tweet?.views)}</span>
              </div>
            </div>
            <div
              style={{
                marginBottom: "5px 0px",

                textAlign: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                size="sm"
                leftIcon={isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
                onClick={() => toggleSaveTweet()}
                variant={"ghost"}
                // size="md"
              >
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                size="sm"
                style={{
                  marginLeft: "30px",
                  // background: "black",
                  // color: "white",
                }}
                colorScheme="blue"
                onClick={() => generateSimilar(tweet)}
              >
                Generate Similar →
              </Button>
            </div>
          </div>
        </div>
        {showReplyBox && (
          <div style={{ padding: "10px" }}>
            <div
              style={{
                marginBottom: "10px",
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              {/* <div style={{ fontSize: "14px", fontWeight: "600" }}>
                AI reply writer:
              </div> */}
              <div style={{ maxWidth: "350px" }}>
                {replyTypes.map((r) => (
                  <Button
                    key={r}
                    style={{
                      borderRadius: "15px",
                      margin: "3px",
                      padding: "10px",
                      background:
                        selectedReplyType === r
                          ? "hsl(204, 70%, 61%)"
                          : "#e8e8e8",
                      color: selectedReplyType === r ? "white" : "black",
                      // background: selectedReplyTypes.includes(r)
                      //   ? "hsl(204, 70%, 91%)"
                      //   : "#e8e8e8",
                    }}
                    onClick={
                      () =>
                        selectedReplyType === r
                          ? setSelectedReplyType("")
                          : setSelectedReplyType(r)
                      // selectedReplyTypes.includes(r)
                      //   ? setSelectedReplyTypes(
                      //       selectedReplyTypes.filter((sr) => sr !== r)
                      //     )
                      //   : setSelectedReplyTypes([...selectedReplyTypes, r])
                    }
                    size="sm"
                    variant={"outline"}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <div style={{ display: "flex", marginTop: "5px" }}>
                <Input
                  size={"sm"}
                  style={{
                    width: "60%",
                    marginRight: "10px",
                    fontSize: "14px",
                  }}
                  onChange={(e) => setReplyInstruction(e.target.value)}
                  placeholder="Instruction for AI"
                  onKeyDown={(e) => e.key === "Enter" && getAIReply()}
                />

                <Button
                  onClick={() => getAIReply()}
                  isLoading={loadingAIReply}
                  loadingText={"Getting AI Reply"}
                  size="sm"
                >
                  Generate Reply
                </Button>
              </div>
            </div>
            <div>
              <Textarea
                onChange={(e) => setReplyText(e.target.value)}
                value={replyText}
                placeholder="Write a thoughtful reply"
                style={{ fontSize: "14px", minHeight: "120px" }}
              />
              {replyText.length > 0 && (
                <Button
                  style={{ fontSize: "12px", float: "left", marginTop: "3px" }}
                  variant={"link"}
                  onClick={() => setReplyText("")}
                >
                  Clear
                </Button>
              )}
              <Button
                style={{
                  // color: "white",
                  // background: "black",
                  float: "right",
                  margin: "5px 0px",
                  display: "inline-block",
                }}
                colorScheme="blue"
                onClick={() => replyInstantly()}
                size="sm"
                isDisabled={!replyText}
                isLoading={postingReply}
                // loadingText={"Posting"}
              >
                Post reply
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default TweetCard;
