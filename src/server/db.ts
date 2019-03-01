import mongodb = require('mongodb')

namespace Database {

    export interface ObjectID {
        _id: string
    }

    export interface UserInfo {
        _id: mongodb.ObjectID
        username: string,
        password: string
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var users:mongodb.Collection<UserInfo>

    export async function connectToMongo():Promise<mongodb.Db> {
        if ( this.db ) return Promise.resolve(this.db)
        return mongodb.connect('mongodb://localhost:27017', {
            bufferMaxEntries:   0,
            reconnectTries:     5000,
            useNewUrlParser: true
        }).then(client => {
            this.client = client
            this.db = this.client.db("messageInABottle")
            this.users = this.db.collection('users')
            return this.db
        })
    }

    export function disconnectFromMongo() {
        client.close()
    }
}

export = Database
