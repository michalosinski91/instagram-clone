import React, { useState } from 'react';
import '../styles/App.css';
import { useAuth0 } from '../auth/react-auth0-wrapper'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { setContext } from 'apollo-link-context'
import { Switch, Route } from 'react-router-dom'

import Header from './Header'

function App() {
  const [accessToken, setAccessToken] = useState('')
  
  const { getTokenSilently, loading } = useAuth0()

  //attempts to fetch a token from Auth0 client
  //if the token is invalid, it is refreshed silently and returned
  //accessToken gets set
  const getAccessToken = async () => {
    try {
      const token = await getTokenSilently()
      setAccessToken(token)
      console.log(token)
    } catch (error) {
      console.log(error)
    }
  }
  getAccessToken()
  


  const httpLink = new HttpLink({
    uri: 'https://instaclone-graphql.herokuapp.com/v1/graphql'
  })

  const authLink = setContext((_, { headers }) => {
    const token = accessToken
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: `bearer ${token}`
        }
      }
    } else {
      return {
        headers: {
          ...headers
        }
      }
    }
  })

  const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
  })


  if (loading) {
    return 'Loading...'
  }

  return (
    <ApolloProvider client={client}>
      <Header />        
    </ApolloProvider>
  );
}

export default App;
