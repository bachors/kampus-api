const { gql, ApolloError } = require('apollo-server-express')
const puppeteer = require('../config/puppeteer')
const { API_BASEURL } = require('../config')

const typeDef = gql`
    type PC {
        json: String
    }
    
    extend type Query {
        getPc(keyword: String!): [PC]
    }
`

const resolvers = {
    Query: {
        // todo

        getPc: async (_, { keyword }) => {
            const browser = await puppeteer()
            try {
                const page = await browser.newPage()
                await page.goto(encodeURI('http://bachors.com'))
                
                const result = await page.evaluate(() => {
                    const detail = []
                    
                    return detail
                })

                return result
            } catch (reason) {
                console.log(reason)
                return {}
            } finally {
                browser.close()
            }
        }
    }
}

exports.typeDef = typeDef
exports.resolvers = resolvers
