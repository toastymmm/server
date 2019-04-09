'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import UserInfo = db.UserInfo
import mongodb = require('mongodb')

const inspect = (input: any) => util.inspect(input, false, Infinity, true)

// Make sure this matches the Swagger.json body parameter for the /signup API
interface SignupPayload {
    userinfo: swaggerTools.SwaggerRequestParameter<UserInfo>
    [paramName: string]: swaggerTools.SwaggerRequestParameter<UserInfo> | undefined;
}

interface LoginPayload {
	userinfo: swaggerTools.SwaggerRequestParameter<UserInfo>
	[paramName: string]: swaggerTools.SwaggerRequestParameter<UserInfo> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /users API
interface UsersPayload {
    [paramName: string]: undefined;
}

module.exports.signup = function (req: api.Request & swaggerTools.Swagger20Request<SignupPayload>, res: any, next: any) {
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

	/* alias sent params */
	const sent_username = req.swagger.params.userinfo.value.username;
	const sent_password = req.swagger.params.userinfo.value.password;

	/* first check if user exists */
	db.users.findOne({'username' : sent_username}).then((user) => {
		if (user) {
			res.status(api.OK)
			res.send(JSON.stringify({message: "Username already in use."}))
			res.end()
		} else {

			/* do all the fields for new user. */
			const new_user_to_make = {
				_id: new mongodb.ObjectID(),
				username: sent_username,
				password: sent_password,
				admin: false,
				email: "",
				banned: false,
				warned: false,
				numReports: 0,
				numWarnings: 0,
				messageCreatedCount: 0,
				messageDiscoveredCount: 0,
				accountCreated: "",
				lastLogin: ""
			}

			/* attempt to insert new user */
			db.users.insertOne(new_user_to_make).then((success) => {
				if (success) {
					if (req.session) {
						req.session.username = new_user_to_make.username;
						req.session.userid = ""+new_user_to_make._id;
						req.session.admin = new_user_to_make.admin;
					}

					res.status(api.OK)
					res.send(JSON.stringify({message: "Yeet brochacho. New user yote."}))
					res.end()
				} else {
					res.status(api.InternalServerError)
					res.send(JSON.stringify({message: "Error occurred. Rip in peace."}))
					res.end()
				}
			})
		}
	})
}

module.exports.userLogin = function (req: api.Request & swaggerTools.Swagger20Request<LoginPayload>, res: any, next: any) {
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

	/* alias sent params */
	const sent_username = req.swagger.params.userinfo.value.username;
	const sent_password = req.swagger.params.userinfo.value.password;

	db.users.findOne({username: sent_username}).then((user) => {
		if (user && user.password == sent_password) {
			if (req.session) {
				req.session.username = sent_username
				req.session.userid = ""+user._id
				req.session.admin = user.admin
			}

			res.status(api.OK)
			res.send(JSON.stringify({message: "All good broseph. You're in."}))
			res.end()
		} else {
			res.status(api.Forbidden)
			res.send(JSON.stringify({message: "Error: username or password doesn't match."}))
			res.end()
		}
	})
}

module.exports.userLogout = function (req: any, res: any, next: any) {
    // print out the params
    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    let username: string = '', userid: string = ''
    if (req.session) {
        username = req.session.username
        userid = req.session.userid
        delete req.session.userid
        delete req.session.username
    }

    res.setHeader('Content-Type', 'application/json')
    res.status(api.OK)
    res.send(JSON.stringify({ message: "Logged out user: ${username}" }, null, 2))
    res.end()
}

module.exports.users = function (req: api.Request & swaggerTools.Swagger20Request<UsersPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    if (!req.session.admin) {
        res.status(api.Forbidden)
        res.send(JSON.stringify({ message: inspect(new Error("Only admins can see the user list")) }, null, 2))
        return res.end()
    }

    db.users.find({}).toArray().then((data) => {
        if (data) {
            res.status(api.OK)
            res.send(JSON.stringify(data.map((elem) => {
                delete elem.password
                return elem
            })))
            res.end()
        }
        else {
            res.status(api.InternalServerError)
            res.send(JSON.stringify({ message: inspect(new Error(`No user array. ${data}`)) }, null, 2))
            return res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}