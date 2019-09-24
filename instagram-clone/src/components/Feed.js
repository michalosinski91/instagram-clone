import React from "react";
import "../styles/App.css";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Container } from "react-bootstrap";
import Post from "./Post.js"

export const POST_LIST = gql`
  {
    Post(order_by: { created_at: desc }) {
      id
    }
  }
`;

function Feed() {

  const { loading, error, data } = useQuery(POST_LIST);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  console.log(data)
  return (
    <>
      {data.Post.map((post, index) => <Post id={post.id} key={index}/>
      )}
    </>
  );
}

export default Feed;