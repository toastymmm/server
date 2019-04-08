import mongodb = require('mongodb')
import turf = require('@turf/turf')

namespace Database {

    export interface ObjectID {
        _id: string
    }

    export interface UserInfo {
        _id: mongodb.ObjectID
        username: string,
        password: string,
        admin: boolean,
        email: string,
        banned: boolean,
        warned: boolean,
        numReports: number,
        numWarnings: number,
        messageCreatedCount: number,
        messageDiscoveredCount: number,
        accountCreated: string,
        lastLogin: string
    }

    export interface Message {
        text:string,
        category: string,
        date: Date,
        numReports: number
    }
    
    export interface MessageFeature {
        _id?: mongodb.ObjectID
        feature: turf.helpers.Feature<turf.helpers.Point, Message>
        creator: mongodb.ObjectID
    }

    export interface Favorite {
        _id: mongodb.ObjectID,
        messageId: mongodb.ObjectID,
        userId: mongodb.ObjectID
    }

    export var client:mongodb.MongoClient
    export var db:mongodb.Db
    export var users:mongodb.Collection<UserInfo>
    export var messages:mongodb.Collection<MessageFeature>
    export var favorites:mongodb.Collection<Favorite>

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
            this.messages = this.db.collection('messages')
            this.favorites = this.db.collection('favorites')
            return this.db
        })
    }

    export function disconnectFromMongo() {
        client.close()
    }
}

export = Database
