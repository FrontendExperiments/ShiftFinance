import {MongoClient} from "mongodb";

// Connection URL
const url = process.env.MONGO_URL;
const client = new MongoClient(url, {
    auth: {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PWD
    },
    authSource: process.env.MONGO_DATABASE
});

// Database Name
const dbName = process.env.MONGO_DATABASE;
const isAuthenticated = false

async function connect() {
    if (!isAuthenticated){
        await client.connect();
        console.log('Connected successfully to server');
    }
    return client.db(dbName);
}

module.exports = connect