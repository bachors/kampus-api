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

        getPc: async (_, {
            keyword
        }) => {
            const browser = await puppeteer()
            try {
                const page = await browser.newPage()
                await page.goto(encodeURI(keyword))

                await page.setRequestInterception(true);
                page.on("request", request => {
                    request.continue();
                });
                page._client.on("Network.responseReceived", data => {

                });
                await page.evaluate(() => {
                    document.cookie = "foo=bar";
                });
                await page.evaluate(({keyword}) => {
                    var myHeaders = new Headers();
                    myHeaders.append("X-Custom-Header", "Hello");

                    var myInit = {
                        method: "GET",
                        headers: myHeaders
                    };

                    var myRequest = new Request(keyword, myInit);
                    fetch(myRequest);
                },{keyword});

                let bodyHTML = await page.evaluate(() => document.body.innerHTML);

                return [{
                    "json": bodyHTML
                }]

                await page.waitFor(1000);

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
