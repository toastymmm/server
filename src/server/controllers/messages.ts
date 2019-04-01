'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import Message = db.Message
import MessageFeature = db.MessageFeature
import api = require('../api')
import turf = require('@turf/turf')
import mongodb = require('mongodb')

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, false)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface MessagesPayload {
    lon: swaggerTools.SwaggerRequestParameter<number>,
    lat: swaggerTools.SwaggerRequestParameter<number>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<number> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message GET API
interface GetMessagePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message GET API
interface PatchMessagePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    message: swaggerTools.SwaggerRequestParameter<Message>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string>
        | swaggerTools.SwaggerRequestParameter<Message>
        | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message DELETE API
interface DeleteMessagePayload {
    id: swaggerTools.SwaggerRequestParameter<string>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /message POST API
interface PostMessagePayload {
    message: swaggerTools.SwaggerRequestParameter<MessageFeature>,
    [paramName: string]: swaggerTools.SwaggerRequestParameter<MessageFeature> | undefined;
}

module.exports.messages = function (req: api.Request & swaggerTools.Swagger20Request<MessagesPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    var rangeInMeters = 100
    const rangeInDegrees = turf.lengthToDegrees(rangeInMeters, "meters")

    //capture search in variable
    const lon = req.swagger.params.lon.value;
    const lat = req.swagger.params.lat.value;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    db.messages.find({'feature.geometry': {$geoWithin: { $centerSphere: [ [ lon, lat ], rangeInDegrees ]}}}).toArray().then((data) => {
        if (data) {
            res.status(OK)
            res.send(JSON.stringify(data))
            res.end()
        }
        else {
            res.status(OK)
            res.send(JSON.stringify([], null, 2))
            res.end()
        }
    }).catch((err) => {
        res.status(InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}

module.exports.getMessage = function (req: api.Request & swaggerTools.Swagger20Request<GetMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //capture search in variable
    const id = req.swagger.params.id.value;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    db.messages.find({}).toArray().then((data) => {
        if (data) {
            res.status(OK)
            res.send(JSON.stringify(data))
            res.end()
        }
        else {
            res.status(OK)
            res.send(JSON.stringify([], null, 2))
            res.end()
        }
    }).catch((err) => {
        res.status(InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })
}

module.exports.patchMessage = function (req: api.Request & swaggerTools.Swagger20Request<PatchMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //capture search in variable
    const id = req.swagger.params.id.value;

    res.status(InternalServerError)
    res.send(JSON.stringify({ message: inspect(new Error("Not Implemented")) }, null, 2))
    res.end()
}

module.exports.deleteMessage = function (req: api.Request & swaggerTools.Swagger20Request<DeleteMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //capture search in variable
    const id = req.swagger.params.id.value;

    res.status(InternalServerError)
    res.send(JSON.stringify({ message: inspect(new Error("Not Implemented")) }, null, 2))
    res.end()
}

module.exports.postMessage = function (req: api.Request & swaggerTools.Swagger20Request<PostMessagePayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //message to insert into db
    const message = req.swagger.params.message.value;

    const newMessage = {
        feature: message.feature,
        creator: new mongodb.ObjectID(req.session.userid)
    }

    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    db.messages.insertOne(newMessage).then((result) => {
        if (result) {
            db.messages.findOne({'_id': new mongodb.ObjectID(result.insertedId)}).then((newObject) => {
                res.send(JSON.stringify(newObject))
                res.end()
            })
            
        }
        else {
            res.status(InternalServerError)
            res.send(JSON.stringify(result))
            res.end()
        }
    }).catch((err) => {
        res.status(InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        res.end()
    })


}