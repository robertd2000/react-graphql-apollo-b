import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  // ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
// import { onError } from '@apollo/client/link/error'
import App from './App'
import 'dotenv/config'
import './style.css'

const GITHUB_BASE_URL = 'https://api.github.com/graphql'

const httpLink = new HttpLink({
  uri: GITHUB_BASE_URL,
  headers: {
    authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//   }

//   if (networkError) {
//   }
// })

// const link = ApolloLink(() => [errorLink, httpLink])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link: httpLink,
  cache,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
