import {ApolloServer} from '@apollo/server'
import {startStandaloneServer} from '@apollo/server/standalone'
import {readFileSync} from 'fs'
import path from 'path'
import {gql} from 'graphql-tag'
import {resolvers} from './resolvers'
import {SpotifyAPI} from './datasources/spotify-api'

const typeDefs = gql(
    readFileSync(path.resolve(__dirname, './schema.graphql'), {
        encoding: 'utf-8'
    })
)

async function startApolloServer() {
    const server = new ApolloServer({typeDefs, resolvers})
    const {url} = await startStandaloneServer(server, {
        context: async () => {
            const {cache} = server
            // this object becomes our resolver's contextValue, the third positional argument
            return {
                dataSources: {
                    spotifyAPI: new SpotifyAPI({cache})
                }
            }
        }
    })
    console.log(`🚀  Server is running!\n📭  Query at ${url}`)
}

startApolloServer()
