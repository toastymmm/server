'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import Message = db.Message
import api = require('../api')
import turf = require('@turf/turf')

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

module.exports.messages = function (req: api.Request & swaggerTools.Swagger20Request<MessagesPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //capture search in variable
    const lon = req.swagger.params.lon.value;
    const lat = req.swagger.params.lat.value;
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