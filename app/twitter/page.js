"use client";
import React, { useEffect, useState } from "react";
import Library from "../../components/twitter-components/Library";
import PostWriter from "../../components/twitter-components/PostWriter";
import { Button, position } from "@chakra-ui/react";
import { BsChevronDoubleLeft } from "react-icons/bs";

function page(props) {
  const [showPostWriter, setShowPostWriter] = useState(false);
  const [postWriterWidth, setPostWriterWidth] = useState("500px");
  const [selectedTweet, setSelectedTweet] = useState(null);

  useEffect(() => {
    if (selectedTweet) setShowPostWriter(true);
  }, [selectedTweet]);

  const handleDrag = (e) => {
    let width = window.innerWidth - e.clientX;
    if (width < 600) return;
    setPostWriterWidth(window.innerWidth - e.clientX);
  };
  return (
    <div style={{ position: "relative" }}>
      {!showPostWriter && (
        <Button
          onClick={() => setShowPostWriter(true)}
          size={"sm"}
          variant={"outline"}
          style={{
            position: "fixed",
            top: "70px",
            right: "-10px",
            background: "#fff",
            zIndex: "100",
          }}
        >
          <span style={{ fontSize: "12px" }}>
            <BsChevronDoubleLeft />
          </span>{" "}
          Use Super Post Writer
        </Button>
      )}
      <div style={{ display: "flex", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "scroll",
            marginRight: showPostWriter ? postWriterWidth : "0px",
          }}
        >
          <Library generateSimilar={(t) => setSelectedTweet(t)} />
        </div>
        {showPostWriter && (
          <div
            style={{
              width: postWriterWidth,
              // borderLeft: "1px solid #e5e5e5",
              position: "fixed",
              right: "0px",
              marginTop: "-10px",
              paddingTop: "10px",
              height: "90vh",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                width: "3px",
                borderLeft: "2px solid #e5e5e5",
                height: "105%",
                overflow: "hidden",
                cursor: "col-resize",
                zIndex: "10",
              }}
              onMouseDown={(e) => {
                document.addEventListener("mousemove", handleDrag);
                document.addEventListener("mouseup", () => {
                  document.removeEventListener("mousemove", handleDrag);
                });
              }}
            />
            <PostWriter
              hidePostWriter={() => setShowPostWriter(false)}
              selectedTweet={selectedTweet}
              setSelectedTweet={(t) => setSelectedTweet(t)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
