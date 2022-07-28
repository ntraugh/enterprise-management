const { clients, projects } = require("../projectdata");
const Project = require('../models/Projects')
const Client = require("../models/Clients")
const { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList } = require("graphql")

const ClientType = new GraphQLObjectType({
    name: "Client",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})

const ProjectType = new GraphQLObjectType({
    name: "Project",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientID)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType ({
    name: "RootQueryType", 
    fields: () => ({
// query to grab all projects
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return Project.find()
            }
        },
// query to grab project by id
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args){
                return Project.findById(args.id)
            }
        },
// query to grab all clients
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return Client.find()
            }
        },
// query to grab client by id
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID}},
            resolve(parent, args){
                return Client.findById(args.id)
            }
        }
    })
})

module.exports = new GraphQLSchema ({
    query: RootQuery
})