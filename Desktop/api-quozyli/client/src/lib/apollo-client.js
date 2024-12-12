import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { WebSocketLink } from '@apollo/client/link/ws';
import Cookies from 'js-cookie';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';


console.log(process.env.REACT_APP_API_URL,"message");
// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000/graphql', // Replace with your actual GraphQL endpoint
// });

// Set the Authorization header for every request
const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
});

// Create a WebSocket link for subscriptions
const wsLink = new WebSocketLink({
  uri:process.env.REACT_APP_API_WS, // Same URL as your HTTP link, but with ws://
  options: {
    reconnect: true,
    connectionParams: {
      authToken: Cookies.get('token') || '', // Optionally pass the auth token
    },
  },
});

// Use split to route requests to the correct link


// Use split to send data to each link
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, // Use WebSocket link for subscriptions
  authLink.concat(createUploadLink({ uri:process.env.REACT_APP_API_URL })) // Use HTTP link for queries and mutations
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

// Provider for the application
const ServerProvider = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default ServerProvider;
