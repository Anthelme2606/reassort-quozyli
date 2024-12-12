const express = require('express');
require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const cors = require('cors');
const http = require('http');
const { json } = require('body-parser');
const morgan = require('morgan');
const { graphqlUploadExpress, GraphQLUpload } = require('graphql-upload-minimal');
// const { PubSub } = require('graphql-subscriptions');
const {pubsub}=require('./public/utils/pubsub');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require('graphql');
// Import custom modules
const startDatabase = require('./app/database/db');
const {context} = require('./app/middleware/context');
const typeDefs = require('./app/graphql/types');
const resolvers = require('./app/graphql/resolveurs');

// Setup environment variables
const PORT = process.env.SERVER_PORT || 5000;
// const pubsub = new PubSub();
const APP_URL=process.env.APP_URL || 'http://localhost:5000/graphql';
const WS_URL=process.env.WS_URL || 'ws://localhost:5000/graphql';

const startServer = async () => {
  const app = express();

  // Start the database
  await startDatabase();

  // Middleware logging
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: true }));

  // Use CORS
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  // File upload middleware using graphql-upload
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Limit: 10MB and 10 files

  // Create the HTTP server
  const httpServer = http.createServer(app);

  // Create executable schema with typeDefs, resolvers, and subscriptions
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: {
      Upload: GraphQLUpload,
      ...resolvers,
    },
  });

  // Initialize Subscription Server for WebSocket support
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket, context) => {
        console.log('Client connected for subscriptions');
        return { pubsub }; // Pass pubsub instance to subscriptions
      },
      onDisconnect: () => {
        console.log('Client disconnected from subscriptions');
      },
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );

  // Create Apollo Server instance with the executable schema
  const server = new ApolloServer({
    schema,
    formatError: (err) => {
      console.error(err); // Log the full error
      const { message, extensions } = err;
      return { message, code: extensions?.code };
    },
    csrfPrevention: false,
    includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      {
        // Close subscription server when Apollo server is shut down
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  // Start Apollo server
  await server.start();

  // Apply the Apollo middleware
  app.use(
    '/graphql',
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await context({ req });
        return { user, pubsub }; // Pass pubsub for real-time features
      },
    })
  );

  // Serve uploaded files (optional)
  app.use('/uploads', express.static('uploads'));

  // Start the HTTP server with subscriptions enabled
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at ${APP_URL}`);
    console.log(`🚀 Subscriptions ready at ${WS_URL}`);
  });
};

startServer().catch(console.error);