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
                await page.goto(encodeURI('https://pcpartpicker.com/products/cpu/fetch/?xslug=&location=&search=&qid=1&scr=1&scr_vw=1903&scr_vh=726&scr_dw=1920&scr_dh=1080&scr_daw=1920&scr_dah=1050&scr_ddw=1903&scr_ddh=4064&ms=1580870369860'))
				
				await page.setRequestInterception(true);
				  page.on("request", request => {
					request.continue();
				  });
				  page._client.on("Network.responseReceived", data => {
					  
				  });
				  await page.evaluate(() => {
					document.cookie = "foo=bar";
				  });
				  await page.evaluate(() => {
					var myHeaders = new Headers();
					myHeaders.append("X-Custom-Header", "Hello");

					var myInit = {
					  method: "GET",
					  headers: myHeaders
					};

					var myRequest = new Request("https://pcpartpicker.com/products/cpu/fetch/?xslug=&location=&search=&qid=1&scr=1&scr_vw=1903&scr_vh=726&scr_dw=1920&scr_dh=1080&scr_daw=1920&scr_dah=1050&scr_ddw=1903&scr_ddh=4064&ms=1580870369860", myInit);
					fetch(myRequest);
				  });
                
             /*   const result = await page.evaluate(() => {
					const detail = { nama: "aa" }
					
                    
                    return detail
                })*/
				
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
