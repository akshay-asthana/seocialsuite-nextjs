import React, { useState } from "react";
import axios from "axios";
import { Input, Textarea, Button, useToast } from "@chakra-ui/react";

function CreateContext({ onContextCreate }) {
  const [contextToCreate, setContextToCreate] = useState({});
  const toast = useToast();
  const createNewContext = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/contexts/create`, {
        contextToCreate,
      })
      .then((res) => {
        if (res.data?.success) {
          toast({
            status: "success",
            title: `${contextToCreate.name} was created`,
          });
          onContextCreate(res.data.context);
        }
        toast({
          status: "error",
          title: res.data?.error || "Some error occured",
          description: res.data?.errorDescription || "Please try again",
        });
      });
  };
  return (
    <div style={styles.mainContainer}>
      <div>
        <div style={{ fontWeight: "600", fontSize: "22px" }}>
          Create New Context
        </div>
        <div style={styles.container}>
          <div style={styles.label}>Name</div>
          <div style={styles.inputContainer}>
            <Input
              onChange={(e) =>
                setContextToCreate({ ...contextToCreate, name: e.target.value })
              }
            />
          </div>
        </div>
        <div style={styles.container}>
          <div style={styles.label}>Description</div>
          <div style={styles.inputContainer}>
            <Textarea />
          </div>
        </div>
        <div style={styles.container}>
          <div style={styles.label}>Keywords</div>
          <div style={styles.inputContainer}>
            <Textarea />
          </div>
        </div>
        <div style={styles.container}>
          <div style={styles.label}>Custom Instructions</div>
          <div style={styles.inputContainer}>
            <Input />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainContainer: {
    border: "1px solid #343434",
    borderRadius: "10px",
    padding: "20px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    padding: "20px",
    textAlign: "left",
    margin: "0px auto",
  },
  label: {
    fontWeight: "500",
    margin: "0px 10px",
    width: "200px",
  },
  inputContainer: {},
};

export default CreateContext;
