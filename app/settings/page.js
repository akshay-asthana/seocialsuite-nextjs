"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, useToast, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Loading from "../loading";

function page(props) {
  const [loading, setLoading] = useState(false);
  const [accountSettings, setAccountSettings] = useState({});
  const [twitterClientId, setTwitterClientId] = useState("");
  const [twitterClientSecret, setTwitterClientSecret] = useState("");
  const [editSecrets, setEditSecrets] = useState(false);
  const [secretsSaved, setSecretsSaved] = useState(false);

  const toast = useToast();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") getAccountSettings();
  }, [status]);

  const getAccountSettings = async () => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/account-settings`)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setAccountSettings(res.data.accountSettings);
          setEditSecrets(!res.data.secretsSaved);
          setSecretsSaved(res.data.secretsSaved);
        } else toast({ status: "error", title: "Some error occured." });
      })
      .catch((err) => {
        setLoading(false);
        toast({
          status: "error",
          title: "Error fetching settings from server.",
        });
      });
  };
  const saveAccountSettings = async () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/save-account-settings`,
        {
          settings: accountSettings,
          secrets: {
            twitterClientId,
            twitterClientSecret,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setAccountSettings(res.data.accountSettings);
          setSecretsSaved(res.data.secretsSaved);
          setEditSecrets(!res.data.secretsSaved);
          toast({
            status: "success",
            title: "Settings saved successfully",
          });
        }
      })
      .catch((err) =>
        toast({
          status: "error",
          title: "Error saving settings.",
        })
      );
  };
  const initiateTwitterSignIn = async () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/twitter-v2/login`)
      .then((res) => {
        // console.log(res.data);
        window.open(res.data, "_blank");
        if (res.data.success) {
        }
      })
      .catch((err) =>
        toast({
          status: "error",
          title: "Some error occured",
        })
      );
  };

  if (loading) return <Loading />;
  return (
    <div>
      <div style={{ fontSize: "20px", fontWeight: "600" }}>
        Account Settings
      </div>

      <div
        style={{
          display: "grid",
          justifyContent: "center",
          gridGap: "10px",
          margin: "50px 0px",
        }}
      >
        <div style={{ fontSize: "22px", fontWeight: "500" }}>Twitter Setup</div>
        <div
          style={{
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "600",
            marginTop: "20px",
          }}
        >
          Step 1: Generate Client Id and Secret
          <div
            style={{
              fontSize: "16px",
              fontWeight: "300",
              padding: "10px 30px",
            }}
          >
            <ol>
              <li>Go to developers.twitter.com</li>
              <li>Create a new app</li>
              <li>Create OAuth sign in credentials</li>
              <li>
                Callback url:
                {` ${process.env.NEXT_PUBLIC_API_URL}/api/twitter-v2/callback`}
              </li>
            </ol>
          </div>
        </div>
        <div
          style={{
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "600",
            marginTop: "30px",
          }}
        >
          Step 2: Enter your Client Id and Secret here
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Client Id{" "}
            {secretsSaved && (
              <span style={{ float: "right" }}>
                <Button
                  size={"sm"}
                  variant={"link"}
                  onClick={() => setEditSecrets(!editSecrets)}
                >
                  {editSecrets ? "Cancel" : "Change Credentials"}
                </Button>
              </span>
            )}
          </div>
          <div>
            <Input
              style={{ width: "600px" }}
              value={editSecrets ? twitterClientId : "[Redacted]"}
              onChange={(e) => setTwitterClientId(e.target.value)}
              disabled={!editSecrets}
            />
          </div>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>
            Client Secret
          </div>
          <div>
            <Input
              style={{ width: "600px" }}
              value={editSecrets ? twitterClientSecret : "[Redacted]"}
              onChange={(e) => setTwitterClientSecret(e.target.value)}
              disabled={!editSecrets}
            />
          </div>
        </div>
        <Button
          style={{}}
          colorScheme="blue"
          onClick={() => saveAccountSettings()}
          isDisabled={!editSecrets}
        >
          {editSecrets ? "Save Credentials" : "Saved"}
        </Button>
        <div
          style={{
            textAlign: "left",
            fontSize: "20px",
            fontWeight: "600",
            marginTop: "30px",
          }}
        >
          Step 3: Connect your twitter account
        </div>

        <Button onClick={() => initiateTwitterSignIn()} colorScheme="blue">
          Connect twitter account
        </Button>
        <div
          style={{
            fontWeight: "300",
            maxWidth: "600px",
            textAlign: "left",
            padding: "10px",
            fontSize: "12px",
          }}
        >
          Note: If you're having trouble connecting your twitter account please
          make sure that you have followed all the steps correctly and client id
          and secret are correct. You can edit them by clicking on Change
          Credentials button.
        </div>
      </div>
    </div>
  );
}

export default page;
