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
                db.close();
            });
        }
        else {
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
                db.close();
            });
        }
        else {
            db.close();
        }
    });
});
console.log('All seeds applied');
//# sourceMappingURL=seed.js.map