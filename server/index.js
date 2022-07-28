const express = require("express");
require("dotenv").config({ path: "./.env"});
const { graphqlHTTP } = require("express-graphql")
const PORT = process.env.PORT || 5000;
const connectiondb = require("./config/connection.js")
const schema = require("./schema/index.js")
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connectiondb()

// setting up /graphql end point to grab our data
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))



app.listen(PORT, 
    console.log(`App listening on port: ${PORT}`)
)