"use strict";
var mongodb = require('mongodb');
var assert = require('assert');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectID;
var dbUrl = 'mongodb://localhost:27017/qcms';
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
// SEED COLLECTIONS
MongoClient.connect(dbUrl, function (err, db) {
    assert.equal(null, err);
    db.collection('helpers').findOne({ 'name': 'collections' }).then(function (document) {
        if (!document) {
            db.collection('helpers').insertOne(collections).then(function () {
                console.log('added collections');
                db.close();
            });
        }
        else {
            console.log('skipped collections');
            db.close();
        }
    });
});
// SEED ELEMENTS
MongoClient.connect(dbUrl, function (err, db) {
    assert.equal(null, err);
    db.collection('helpers').findOne({ 'name': 'elements' }).then(function (document) {
        if (!document) {
            db.collection('helpers').insertOne(elements).then(function () {
                console.log('added elements');
                db.close();
            });
        }
        else {
            console.log('skipped elements');
            db.close();
        }
    });
});
//# sourceMappingURL=seed.js.map