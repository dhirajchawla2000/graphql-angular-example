import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

const PORT = 3000;
const pubsub = new PubSub();

const authors = [
  { id: 1, firstName: 'Dhiraj', lastName: 'Chawla' },
  { id: 2, firstName: 'Yogender', lastName: 'Kumar' },
  { id: 3, firstName: 'Nikhil', lastName: 'Seth' }
];

const posts = [
  { id: 1, authorId: 1, title: 'Minions', url: 'https://media.giphy.com/media/oobNzX5ICcRZC/giphy.gif', votes: 2 },
  { id: 2, authorId: 2, title: 'Iron Man', url: 'https://media.giphy.com/media/wEgs1cd7vDTt6/giphy.gif', votes: 3 },
  { id: 3, authorId: 2, title: 'Captain America', url: 'https://media.giphy.com/media/1lk1IcVgqPLkA/giphy.gif', votes: 1 },
  { id: 4, authorId: 3, title: 'Cat', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', votes: 7 }
];

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
	  url: String
    author: Author
    votes: Int
  }

  type Query {
    posts: [Post]
    authors: [Author]
	  post(id: Int!): Post
  }

  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
    addPost (
	    authorId: Int!
	    title: String!
    ): Post
    deletePost (
      postId: Int!
    ): Boolean
  }

  type Subscription {
    postUpvoted(id: Int!): Post
    postDeleted(id: Int!): Post
  }
`;

const resolvers = {
  Query: {
    posts: () => {
      return posts;
    },
    authors: () => authors,
    post: (_, { id }) => find(posts, {id: id})
  },
  Mutation: {
    upvotePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      pubsub.publish('postUpvoted', {postUpvoted: post});
      return post;
    },
    addPost: (_, { authorId, title }) => {
      let post = { id: posts.length+1, authorId: authorId, title: title, votes: 0 };
      posts.push(post);
      return post;
    },
    deletePost: (_, { postId }) => {
      const post = find(posts, { id: postId });
      if (!post) {
        return false;
      }
      for (let i=0; i<posts.length; i++) {
        if (posts[i].id === post.id) {
          posts.splice(i, 1);
          pubsub.publish('postDeleted', {postDeleted: post});
          break;
        }
      }
      return true;
    }
  },
  Subscription: {
    postUpvoted: {
      subscribe: withFilter(() => pubsub.asyncIterator('postUpvoted'),
      (payload, args) => {
        return payload.postUpvoted.id === args.id;
      })
    },
    postDeleted: {
      subscribe: withFilter(() => pubsub.asyncIterator('postDeleted'),
      (payload, args) => {
        return payload.postDeleted.id === args.id;
      })
    }
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

var app = express();

app.use('*', cors());

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: schema }));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`API Server is now running on http://localhost:${PORT}`); // eslint-disable-line no-console
  console.log(`API Server over web socket with subscriptions is now running on ws://localhost:${PORT}/subscriptions`);
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server: server,
    path: '/subscriptions',
  });
});
