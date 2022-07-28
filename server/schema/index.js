const { clients, projects } = require("../projectdata");
const Project = require('../models/Projects')
const Client = require("../models/Clients")
const { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLSchema, 
    GraphQLList, GraphQLNonNull, GraphQLEnumType } = require("graphql")

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

// Mutations
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // beginning of CRUD for client
        // adding a client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                email: { type: GraphQLNonNull(GraphQLString)},
                phone: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                const client = new Client ({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return client.save();
            }
        },
        // deleting a client
        deleteClient: {
            type: ClientType,
            args: { id: { type: GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                return Client.findByIdAndRemove(args.id)
            }
        },
        // adding a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                description: { type: GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: "ProjectStatus",
                        values: {
                            "progress": { value: "In Progress"},
                            "finish": { value: "Finished"}
                        }
                    }),
                    defaultValue: "Not Started",
                },
                clientID: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                const project = new Project ({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientID: args.clientID
                })
                return project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: { id: { type: GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                return Project.findByIdAndRemove(args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema ({
    query: RootQuery,
    mutation
})