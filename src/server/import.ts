import mongodb = require('mongodb')
import db = require('./db')

const users = [
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik",
	 //this hash is for "password"
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik2",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik3",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik4",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
    {
        "_id": new mongodb.ObjectID(),
        "username": "nik5",
        "password": "$2a$10$xh3LdNOsFwzCSga4yAJ0oekXaVpMCqCfmZOlCehVX/z0MLFIb2ac2",
    },
]

async function go() {
    await db.connectToMongo()
    if (await db.db.listCollections({ name: 'users' }).hasNext())
        await db.users.drop()
    await Promise.all(users.map(async user => {
        return await db.users.insertOne(user)
    }))
    db.disconnectFromMongo()
    return "Success!!"
}
go().then(console.log).catch(console.error)
