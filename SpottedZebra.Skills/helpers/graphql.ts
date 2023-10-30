import { type IGetAllResponse } from '../types/responses/get-all-response.interface'
import { type IGetOneResponse } from '../types/responses/get-one-response.interface'
import { request } from 'graphql-request'

// This could be pulled out to process.env.GRAPHQL_ENDPOINT
const graphQlEndpoint: string = 'https://sz-sdet-task.herokuapp.com/graphql'

/**
 * Send the provided query to /graphql endpoint
 * @param query
 * @returns an object containing the response data
 */
export async function sendQuery (query: string): Promise<IGetOneResponse | IGetAllResponse> {
  try {
    const response = await request(
      graphQlEndpoint,
      query
    )

    return { data: response } as IGetOneResponse | IGetAllResponse
  } catch (error) {
    return error.response
  }
};

export async function sendMutation (mutation: string, data?: {}) {
  let response
  try {
    response = await request(
      graphQlEndpoint,
      mutation,
      data
      // A headers object containing an access token would go here
    )

    return { data: response }
  } catch (error) {
    return error.response
  }
};
