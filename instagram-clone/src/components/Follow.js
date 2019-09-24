import React, { useState, useRef } from 'react'
import '../styles/App.css'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useAuth0 } from '../auth/react-auth0-wrapper'
import { Button } from 'react-bootstrap'
import { NUMBER_OF_FOLLOWERS, NUMBER_OF_FOLLOWING } from './Profile'

const FETCH_FOLLOWERS = gql`
    query($followingId: String!, $userId: String!) {
        Follow(
            where: {
                follower_id: { _eq: $userId }
                following_id: { _eq: $followingId }
            }
        ) {
            id
        }
    }
`

const FOLLOW_USER = gql`
    mutation($followingId: String!, $userId: String!) {
        insert_Follow(
            objects: [{ follower_id: $userId, following_id: $followingId }]
        ) {
            affected_rows
        }
    }
`

const UNFOLLOW_USER = gql`
  mutation($followingId: String!, $userId: String!) {
    delete_Follow(
      where: {
        follower_id: { _eq: $userId }
        following_id: { _eq: $followingId }
      }
    ) {
      affected_rows
    }
  }
`

const Follow = (props) => {
    const { isAuthenticated, user } = useAuth0()

    const [followed, setFollowed] = useState(false)
    
    const firstRun = useRef(true)
    const userId = useRef(null)

    if (isAuthenticated) {
        userId.current = user.sub
    } else {
        userId.current = "none"
    }

    const [followUser] = useMutation(FOLLOW_USER,{
        variables: { 
            followingId: props.id, 
            userId: userId.current 
        },
        refetchQueries: [
            {
                query: FETCH_FOLLOWERS,
                variables: { 
                    followingId: props.id,
                    userId: userId.current
                }
            },
            {
                query: NUMBER_OF_FOLLOWERS,
                variables: {
                    id: props.id
                }
            },
            {
                query: NUMBER_OF_FOLLOWING,
                variables: {
                    id: userId.current
                }
            }
        ]
    })

    const [unfollowUser] = useMutation(UNFOLLOW_USER, {
        variables: {
            followingId: props.id,
            userId: userId.current
        },
        refetchQueries: [
            {
                query: FETCH_FOLLOWERS,
                variables: { 
                    followingId: props.id,
                    userId: userId.current
                }
            },
            {
                query: NUMBER_OF_FOLLOWERS,
                variables: {
                    id: props.id
                }
            },
            {
                query: NUMBER_OF_FOLLOWING,
                variables: {
                    id: userId.current
                }
            }
        ]
    })

    const { data, error, loading } = useQuery(FETCH_FOLLOWERS, {
        variables: {
            followingId: props.id,
            userId: userId.current
        }
    })

    if (loading) return 'Loading...'
    if(error) return `Error! ${error.message}`

    if (firstRun.current) {
        if (data.Follow.length > 0) {
            setFollowed(true)
        }
        firstRun.current = false
    }

    return (
        <div className="post-like-container">
            {!followed && (
                <Button 
                    variant="outline-secondary" 
                    className="profile-logout" 
                    onClick={() => {
                        followUser()
                        setFollowed(true)
                    }}
                >
                    Follow
                </Button>
            )}
            {followed && (
                <Button
                    variant="outline-success"
                    className="profile-logout"
                    onClick={() => {
                        unfollowUser()
                        setFollowed(false)
                    }}
                >
                    Following
                </Button>
            )}
        </div>
    )
}

export default Follow