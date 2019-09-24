import React, { useState } from 'react';
import '../styles/App.css';
import { useAuth0 } from '../auth/react-auth0-wrapper'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { setContext } from 'apollo-link-context'
import { Switch, Route } from 'react-router-dom'
import Feed  from './Feed'

import Header from './Header'

function App() {
  const { isAuthenticated, user } = useAuth0()

  const [accessToken, setAccessToken] = useState('')
  
  const { getTokenSilently, loading } = useAuth0()

  
  if (loading) {
    return 'Loading...'
  }

  //attempts to fetch a token from Auth0 client
  //if the token is invalid, it is refreshed silently and returned
  //accessToken gets set
  const getAccessToken = async () => {
    try {
      const token = await getTokenSilently()
      setAccessToken(token)
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
          authorization: `Bearer ${token}`
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


  return (
    <ApolloProvider client={client}>
      <Header />      
      <Switch>
        <Route exact path='/' component={Feed} />  
      </Switch>  
    </ApolloProvider>
  );
}

export default App;
