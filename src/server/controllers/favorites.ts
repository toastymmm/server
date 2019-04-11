'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import Favorite = db.Favorite
import api = require('../api')
import mongodb = require('mongodb')

const inspect = (input: any) => util.inspect(input, false, Infinity, false)

// Make sure this matches the Swagger.json body parameter for the /favorites GET API
interface FavoritesPayload {
    userId: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

interface PostFavoritePayload {
    favorite: swaggerTools.SwaggerRequestParameter<Favorite>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<Favorite> | undefined;
}

module.exports.getFavorites = function (req: api.Request & swaggerTools.Swagger20Request<FavoritesPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    //capture search in variable
    const id = req.swagger.params.userId.value;

    db.favorites.find({"userId" : new mongodb.ObjectID(id)}).toArray().then((data) => {
        if (data) {
            res.status(api.OK)
            res.send(JSON.stringify(data))
            res.end()
        }
        else {
            res.status(api.OK)
            res.send(JSON.stringify([], null, 2))
            res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}

module.exports.postFavorite = function (req: api.Request & swaggerTools.Swagger20Request<PostFavoritePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    const newFav = {
        messageId : req.swagger.params.favorite.value.messageId,
        usedId : req.swagger.params.favorite.value.userId
    }

    db.favorites.insertOne(newFav).then((result) => {
        if (result) {
            db.favorites.findOne({'_id': new mongodb.ObjectID(result.insertedId)}).then((newObject) => {
                res.status(api.OK)
                res.send(JSON.stringify(newObject))
                return res.end()
            }).catch((err) => {
                res.status(api.InternalServerError)
                res.send(JSON.stringify({ message: inspect(err) }, null, 2))
                return res.end()
            })
        }
        else {
            res.status(api.InternalServerError)
            res.send(JSON.stringify(result))
            return res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}