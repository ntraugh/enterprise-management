const express = require("express");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql")
const PORT = process.env.PORT || 5000;
const schema = require("./schema/index.js")

const app = express();

// setting up /graphql end point to grab our data
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))



app.listen(PORT, 
    console.log(`App listening on port: ${PORT}`)
)