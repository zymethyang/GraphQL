const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;
const _ = require('lodash');
const axios = require('axios');

const users = [
    {
        id: '23', firstname: 'Bill', age: 20,
    },
    {
        id: '47', firstname: 'Hi', age: 23,
    },
    {
        id: '24', firstname: 'Ka', age: 21,
    }
]
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        }
    }
});


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: GraphQLString
        },
        firstname: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyID}`).then(resp => resp.data);
            }
        }
    }
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(resp => resp.data);
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery
})