import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import gql from 'graphql-tag';

const networkInterface = createNetworkInterface({ uri: 'http://localhost:3000/graphql' });

const wsClient = new SubscriptionClient(`ws://localhost:3000/subscriptions`, {  reconnect: true });
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);
const GqlClient = new ApolloClient({ networkInterface: networkInterfaceWithSubscriptions });

export function provideClient(): ApolloClient {
  return GqlClient;
}
