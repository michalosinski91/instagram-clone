import React, { useState, useRef } from 'react'
import '../styles/App.css'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useAuth0 } from '../auth/react-auth0-wrapper'

const FETCH_LIKES = gql`
    query($id: Int!, $userId: String!) {
        Post(where: { id: { _eq: $id } }) {
            Likes_aggregate {
                aggregate {
                    count
                }
            }
            Likes(where: { user_id: { _eq: $userId } }) {
                id
            }
        }
    }
`

const LIKE_POST = gql`
    mutation($postId: Int!, $userId: String!) {
        insert_Like(objects: [{ post_id: $postId, user_id: $userId }]) {
            affected_rows
        }
    }
`

const DELETE_LIKE = gql`
    mutation($postId: Int!, $userId: String!) {
        delete_Like(
            where: { user_id: { _eq: $userId }, post_id: { _eq: $postId } }
        ) {
            affected_rows
        }
    }
`

const Like = ({ postId }) => {
    const { isAuthenticated, user } = useAuth0()

    const [liked, setLiked] = useState(false)
    const [countLikes, setCountLikes] = useState(-1)

    // stores the value of userId for the lifetime of component
    const userId = useRef(null)
    if (isAuthenticated) {
        userId.current = user.sub
    } else {
        userId.current = 'none'
    }

    // Likes the post and refetches the total likes to update the count
    const [likePost] = useMutation(LIKE_POST, {
        variables: {
            postId: postId, 
            userId: userId.current 
        },
        refetchQueries: [
            {
                query: FETCH_LIKES,
                variables: { 
                    id: postId, 
                    userId: userId.current 
                }
            }
        ]
    })

    // Deletes the like on the post and refetches the total likes to update the count
    const [deleteLike] = useMutation(DELETE_LIKE, {
        variables: { 
            postId: postId,
            userId: userId.current
        },
        refetchQueries: [
            {
                query: FETCH_LIKES,
                variables: {
                    id: postId,
                    userId: userId.current
                }
            }
        ]
    })

    const { data, loading, error } = useQuery(FETCH_LIKES, {
        variables: {
            id: postId,
            userId: userId.current
        }
    })

    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`

    if (countLikes === -1) {
        if (data.Post[0].Likes.length > 0) {
            setLiked(true)
        }
        setCountLikes(data.Post[0].Likes_aggregate.aggregate.count)
    }

    return(
        <div className="post-like-container">
            {isAuthenticated && (
                <>
                    {!liked && (
                        <button
                            className="post-like-button-white button-nodec"
                            onClick={() => {
                                likePost()
                                setLiked(true)
                                setCountLikes(countLikes + 1)
                            }}
                        />
                    )}
                    {liked && (
                        <button
                            className="post-like-button-black button-nodec"
                            onClick={() => {
                                deleteLike()
                                setLiked(false)
                                setCountLikes(countLikes - 1)
                            }}
                        />
                    )}
                </>
            )}
            {countLikes 
                ? <span className="Post-likes">{countLikes} likes</span> 
                : null
            }
        </div>
    )
}

export default Like