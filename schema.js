const { PubSub } = require('graphql-subscriptions');
const { StarWars } = require('fakergem');

const pubsub = new PubSub();

const store = {
  quotes: [],
};

const typeDefs = `
  type Query {
    quotes: [Quote]
  }
  
  type Subscription {
    newQuote: Quote
  }

  type Quote {
    id: ID!,
    from: String!,
    body: String!,
  }
`;

const resolvers = {
  Query: {
    quotes: () => store.quotes,
  },
  Subscription: {
    newQuote: {
      subscribe: () => pubsub.asyncIterator('newQuote'),
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
  context: (headers, secrets) => {
    return {
      headers,
      secrets,
    };
  },
};

// Fake quotes dispatcher
let id = 0;

generateQuote();
const token = setInterval(generateQuote, 30000);

function generateQuote() {
  const newQuote = {
    id: ++id,
    body: StarWars.quote(),
    from: StarWars.character(),
  };
  store.quotes.push(newQuote);
  pubsub.publish('newQuote', {
    newQuote: newQuote,
  });
}

/* setTimeout(() => {
  clearInterval(token);
}, 10000); */
