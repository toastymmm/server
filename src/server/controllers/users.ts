'use strict';

import util = require('util')
import swaggerTools = require('swagger-tools')
import db = require('../db')
import api = require('../api')
import User = db.User
import UserInfo = db.UserInfo
import mongodb = require('mongodb')

import bcrypt = require('bcryptjs')

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

// Make sure this matches the Swagger.json body parameter for the /users API
interface GetUserPayload {
	userId: swaggerTools.SwaggerRequestParameter<string>
	[paramName: string]: swaggerTools.SwaggerRequestParameter<string> | undefined;
}

// Make sure this matches the Swagger.json body parameter for the /users API
interface PatchUserPayload {
	userId: swaggerTools.SwaggerRequestParameter<string>
	userInfo: swaggerTools.SwaggerRequestParameter<Partial<UserInfo>>
	[paramName: string]: swaggerTools.SwaggerRequestParameter<string> | swaggerTools.SwaggerRequestParameter<Partial<UserInfo>>| undefined;
}

module.exports.signup = function (req: api.Request & swaggerTools.Swagger20Request<SignupPayload>, res: any, next: any) {
    console.log(inspect(req.swagger.params))
    res.setHeader('Content-Type', 'application/json')

	/* alias sent params */
	const sent_username = req.swagger.params.userinfo.value.username;
	const sent_password = req.swagger.params.userinfo.value.password;

	bcrypt.hash(sent_password, 10).then((password_hash) => {
		/* first check if user exists */
		db.users.findOne({ 'username': sent_username }).then((user) => {
			if (user) {
				res.status(api.Forbidden)
				res.send(JSON.stringify({ message: "Username already in use." }))
				res.end()
			} else {

				/* do all the fields for new user. */
				const new_user_to_make:User = {
					_id: new mongodb.ObjectID(),
					username: sent_username,
					password: password_hash,
					admin: false,
					email: "",
					banned: false,
					warned: false,
					numReports: 0,
					numWarnings: 0,
					messageCreatedCount: 0,
					messageDiscoveredCount: 0,
					accountCreated: new Date().toISOString(),
					lastLogin: new Date().toISOString()
				}

				/* attempt to insert new user */
				db.users.insertOne(new_user_to_make).then((success) => {
					if (success) {
						if (req.session) {
							req.session.username = new_user_to_make.username;
							req.session.userid = "" + new_user_to_make._id;
							req.session.admin = new_user_to_make.admin;
						}

						res.status(api.OK)
						res.send(JSON.stringify({ message: "Yeet brochacho. New user yote." }))
						res.end()
					} else {
						res.status(api.InternalServerError)
						res.send(JSON.stringify({ message: "Error occurred. Rip in peace." }))
						res.end()
					}
				})
			}
		})
	})
}

module.exports.userLogin = function (req: api.Request & swaggerTools.Swagger20Request<LoginPayload>, res: any, next: any) {
    console.log(inspect(req.swagger.params))
	res.setHeader('Content-Type', 'application/json')

	const bad_user_pass_msg = "Error: username or password doesn't match."

	/* alias sent params */
	const sent_username = req.swagger.params.userinfo.value.username;
	const sent_password = req.swagger.params.userinfo.value.password;

	db.users.findOne({username: sent_username}).then((user) => {
		if (user) {
			bcrypt.compare(sent_password, user.password).then((is_correct_password) => {
				if (is_correct_password) {
					if (req.session) {
						req.session.username = sent_username
						req.session.userid = ""+user._id
						req.session.admin = user.admin

						res.cookie('username', req.session.username)
						res.cookie('userid', req.session.userid)
					}

					res.status(api.OK)
					res.send(JSON.stringify({message: "All good broseph. You're in."}))
					res.end()
				} else {
					res.status(api.Forbidden)
					res.send(JSON.stringify({message: bad_user_pass_msg}))
					res.end()
				}
			})
		} else {
			res.status(api.Forbidden)
			res.send(JSON.stringify({message: bad_user_pass_msg}))
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

module.exports.getUser = function (req: api.Request & swaggerTools.Swagger20Request<GetUserPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    db.users.findOne({_id: new mongodb.ObjectID(req.swagger.params.userId.value)}).then((user) => {
        if (user) {
			res.status(api.OK)
			if (req.session.admin || req.session.userid == req.swagger.params.userId.value) {
				delete user.password;
				res.send(JSON.stringify(user));
				return res.end()
			}
			else {
				res.send(JSON.stringify({
					_id: user._id,
					username: user.username
				}));
				return res.end()
			}
        }
        else {
            res.status(api.NotFound)
            res.send(JSON.stringify({ message: inspect(new Error(`No user with the id. ${req.swagger.params.userId.value}`)) }, null, 2))
            return res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}

module.exports.patchUser = function (req: api.Request & swaggerTools.Swagger20Request<PatchUserPayload>, res: any, next: any) {

    console.log(util.inspect(req.swagger.params, false, Infinity, true))

    res.setHeader('Content-Type', 'application/json')

    if (!req.session) {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(new Error("No session object exists.")) }, null, 2))
        return res.end()
    }

    const userId = req.swagger.params.userId.value;
    const userInfo = req.swagger.params.userInfo.value;
    //verify the user exists
    db.users.findOne({'_id': new mongodb.ObjectID(userId)}).then((data) => {
        if (data) {
            //verify admin or creator is modifying message
            if (new mongodb.ObjectID(data._id).equals(req.session.userid) || req.session.admin) {
                //update
                return db.users.updateOne({ '_id' : new mongodb.ObjectID(userId)}, {$set : userInfo}, (err, result) => {
					if (err) {
						res.status(api.InternalServerError)
						res.send(JSON.stringify({message: inspect(err)},null,2))
						return res.end()
					}

	                //load updated message to be sent back
					return db.messages.findOne({'_id': new mongodb.ObjectID(userId)}).then((updated) =>{
						res.status(api.OK)
						res.send(JSON.stringify(updated))
						return res.end()
					}).catch((err) => {
						res.status(api.InternalServerError)
						res.send(JSON.stringify({message: inspect(err)},null,2))
						return res.end()
					})           
				})
            }
            else {
                res.status(api.Forbidden)
                res.send(JSON.stringify({ message: `Only admins or the user themselves can modify a user`}))
                return res.end()
            }
        }
        else {
            res.status(api.NotFound)
            res.send(JSON.stringify({ message: `User does not exist with id ${userId}` }, null, 2))
            return res.end()
        }
    }).catch((err) => {
        res.status(api.InternalServerError)
        res.send(JSON.stringify({ message: inspect(err) }, null, 2))
        return res.end()
    })
}
