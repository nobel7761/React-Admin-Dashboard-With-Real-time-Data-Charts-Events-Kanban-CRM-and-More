import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = "https://api.crm.refine.dev";
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

// web socket that's going to listen to subscriptions to this graphQL API
// whenever the changes happen we want to immediately listen to them
// we are doing this here in the data provider because in Refine, there is a similar concept of built-in data provider which is called as Live Provider
// this allows our app to update real time
export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("acces_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

export const dataProvider = graphqlDataProvider(client);
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
