const { gql, ApolloError } = require('apollo-server-express')
const puppeteer = require('../config/puppeteer')
const { API_BASEURL } = require('../config')

const typeDef = gql`
    type HLR {
        json: String
    }
    
    extend type Query {
        getHlr(keyword: String!): [HLR]
    }
`

const resolvers = {
    Query: {

        getHlr: async (_, {
            keyword
        }) => {
            const browser = await puppeteer()
            try {
                const page = await browser.newPage()

                await page.setRequestInterception(true);
                
                page.on('request', interceptedRequest => {

					// Here, is where you change the request method and 
					// add your post data
					var datag = {
						method: "POST",
                        postData: "msisdn=087743593469"
					};

					// Request modified... finish sending! 
					interceptedRequest.continue(datag);
				});
                
                await page.goto("https://ceebydith.com/cek-hlr-lokasi-hp.html")
				
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
                        method: "POST",
                        postData: "msisdn=" + keyword,
                        headers: myHeaders
                    };

                    var myRequest = new Request("https://ceebydith.com/cek-hlr-lokasi-hp.html", myInit);
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
