'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')

const OK = 200
const BadRequest = 400
const InternalServerError = 500

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface ListMessagesPayload {
    searchInfo: swaggerTools.SwaggerRequestParameter<string>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

module.exports.listMessages = function (req: api.Request & swaggerTools.Swagger20Request<ListMessagesPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        return
    }

    //capture search in variable
    const incomingSearch = req.swagger.params.searchInfo.value;
    //if there is a search, match with database docs that belong to that user and put them in array.
    //returned items must belong to the user AND match what was searched in any field belonging to that doc
    if (incomingSearch) {

        db.messages.find({
            "feature.properties.text": { '$regex': `.*${incomingSearch}.*`, '$options': 'i' }
        }).toArray().then((data) => {
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
    //otherwise return all documents belonging to that user
    else {
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
}