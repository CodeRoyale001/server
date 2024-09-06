const { ApolloServer } = require("@apollo/server");
const { problemQuery, problemTypedef, problemMutation, problemResolver } = require("./problem");

async function startGqlServer() {
    const server = new ApolloServer({
        typeDefs: `
        ${problemTypedef}
        ${problemQuery}
        ${problemMutation}
        `,
        resolvers: {
            Query: {
                ...problemResolver.query
            },
            Mutation: {
                ...problemResolver.mutation
            }
        }
    });

    await server.start();
    return server;
}

module.exports = startGqlServer;
