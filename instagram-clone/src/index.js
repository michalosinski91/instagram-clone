import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { setContext } from 'apollo-link-context'

const httpLink = new HttpLink({
    uri: 'https://instaclone-graphql.herokuapp.com/v1/graphql'
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})


ReactDOM.render(<ApolloProvider client={client}>
        <App />
    </ApolloProvider>, document.getElementById('root'));
    


serviceWorker.unregister();
