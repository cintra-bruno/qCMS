"use strict";
var user_1 = require('../app/models/user');
var mongodb = require('mongodb');
var assert = require('assert');
var bcrypt = require('bcrypt');
var config = require('../config');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
var dbUrl = (config.dbUser && config.dbPwd) ? ('mongodb://' + config.dbUser + ':' + config.dbPwd + '@' + config.dbUrl) : ('mongodb://' + config.dbUrl);
var cookieExp = 3600 * 24 * 99;
var collections = {
    name: 'collections',
    collections: [
        'articles'
    ]
};
var elements = {
    name: 'elements',
    types: [
        'header',
        'text'
    ]
};
var roles = {
    name: 'roles',
    roles: [
        'user',
        'admin'
    ]
};
// SEED COLLECTIONS
MongoClient.connect(dbUrl, function (err, db) {
    assert.equal(null, err);
    db.collection('qcms_helpers').findOne({ 'name': 'collections' }).then(function (document) {
        if (!document) {
            db.collection('qcms_helpers').insertOne(collections).then(function () {
                console.log('added collections');
                db.close();
            });
        }
        else {
            db.collection('qcms_helpers').updateOne({ 'name': 'collections' }, { $set: { 'collections': collections.collections } }).then(function () {
                console.log('updated collections');
                db.close();
            });
        }
    });
});
// SEED ELEMENTS
MongoClient.connect(dbUrl, function (err, db) {
    assert.equal(null, err);
    db.collection('qcms_helpers').findOne({ 'name': 'elements' }).then(function (document) {
        if (!document) {
            db.collection('qcms_helpers').insertOne(elements).then(function () {
                console.log('added elements');
                db.close();
            });
        }
        else {
            db.collection('qcms_helpers').updateOne({ 'name': 'elements' }, { $set: { 'types': elements.types } }).then(function () {
                console.log('updated elements types');
                db.close();
            });
        }
    });
});
// SEED ROLES
MongoClient.connect(dbUrl, function (err, db) {
    assert.equal(null, err);
    db.collection('qcms_helpers').findOne({ 'name': 'roles' }).then(function (document) {
        if (!document) {
            db.collection('qcms_helpers').insertOne(roles).then(function () {
                console.log('added roles');
                db.close();
            });
        }
        else {
            db.collection('qcms_helpers').updateOne({ 'name': 'roles' }, { $set: { 'roles': roles.roles } }).then(function () {
                console.log('updated roles');
                db.close();
            });
        }
    });
});
// SEED USER
bcrypt.hash('ch@ngeIt', 8, function (bcerr, result) {
    MongoClient.connect(dbUrl, function (err, db) {
        assert.equal(null, err);
        db.collection('qcms_users').findOne({ 'login': 'admin' }).then(function (document) {
            if (!document) {
                var admin = new user_1.User('admin', 'admin', 'admin', 'admin', result);
                db.collection('qcms_users').insertOne(admin).then(function () {
                    db.close();
                    console.log('added admin');
                });
            }
            else {
                console.log('skipped admin added');
                db.close();
            }
        });
    });
});
// CREATE SESSION COLLECTION
MongoClient.connect(dbUrl, function (err, db) {
    assert.equal(null, err);
    db.listCollections({ 'name': 'qcms_sessions' }).toArray().then(function (documents) {
        if (documents.length === 0) {
            db.createCollection('qcms_sessions').then(function () {
                db.collection('qcms_sessions').createIndex({ 'createdAt': 1 }, { expireAfterSeconds: cookieExp }).then(function () {
                    db.close();
                    console.log('Created sessions collection');
                });
            });
        }
        else {
            db.close();
            console.log('Skipped creating sessions collection');
        }
    });
});
//# sourceMappingURL=seed.js.map