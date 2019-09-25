import React, { useState } from 'react'
import '../styles/App.css'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { Container, Modal, Button, Row } from 'react-bootstrap'
import { useAuth0 } from '../auth/react-auth0-wrapper'
import { POST_LIST } from './Feed'
import { USER_INFO } from './Profile'

const SUBMIT_POST = gql`
    mutation($url: String!, $userId: String!, $caption: String!) {
        insert_Post(objects: { url: $url, caption: $caption, user_id: $userId }) {
            affected_rows
        }
    }
`

const Upload = () => {
    const [modalShow, setModalShow] = useState(false)
    const [caption, setCaption] = useState('')
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')

    const { user } = useAuth0()

    const [submitPost] = useMutation(SUBMIT_POST)

    return (
        <>
            <button className="button-nodec post-upload-button"
                onClick={() => setModalShow(true)}
            />
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <form
                            onSubmit={e => {
                                e.preventDefault()
                                submitPost({
                                    variables: {
                                        caption,
                                        userId: user.sub,
                                        url
                                    },
                                    refetchQueries: [
                                        { query: POST_LIST },
                                        { query: USER_INFO, variables: {
                                            id: user.sub
                                        }}
                                    ]
                                }).catch(function(error) {
                                    console.log(error)
                                    setError(error.toString())
                                })
                                setCaption('')
                                setUrl('')
                            }}
                        >
                            <Row>
                                <span>Image Url:</span>
                            </Row>
                            <Row>
                                <input
                                    value={url}
                                    onChange={({ target }) => setUrl(target.value)}
                                    type='text'
                                />
                            </Row>
                            <Row>
                                <span>Caption:</span>
                            </Row>
                            <Row>
                                <input
                                    value={caption}
                                    onChange={({ target }) => setCaption(target.value)}
                                    type='text'
                                />
                            </Row>
                            <Row>
                                <Button
                                    variant='outline-dark'
                                    className='profile-logout top-padding'
                                    type='submit'
                                    value='Submit'
                                    onClick={() => setModalShow(false)}
                                >
                                    Submit
                                </Button>
                            </Row>
                            {error}
                        </form>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Upload