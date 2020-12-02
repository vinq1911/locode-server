var express = require('express');
var app = express();
var Engine = require('tingodb')();
var db = new Engine.Db('./data', {});
var tingo = require('./src/tingo.js');

let server;

tingo.dbInit(db, async (collection) => {

    console.log('(re)creating indices...');
    const indexResult1 = await collection.createIndex({"fullcode": 1});
    console.log('index created:',indexResult1);
    const indexResult2 = await collection.createIndex({"countryid": 1});
    console.log('index created:',indexResult2);
    const indexResult3 = await collection.createIndex({"location": "2dsphere"});
    console.log('index created:',indexResult3);

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        } else {
            console.log(req.url);
            return next();
        }
    });


    /// not working, lacking tingodb support atm
    app.get('/nearest/:lon/:lat', function (req, res) {
        console.log('finding from longitude:',req.params.lon,'latitude:',req.params.lat);
        collection.find({location: { $near:
            {
              $geometry: { type: "Point",  coordinates: [ req.params.lon, req.params.lat ] },
              $minDistance: 0,
              $maxDistance: 1000000
            }
        }}).toArray(function(err, locodeResult) {
            console.log('result:',locodeResult);
            res.send(
                JSON.stringify(locodeResult)
            );
        });
    });

    app.get('/find/:locode', function (req, res) {
        collection.find({fullcode: req.params.locode.toUpperCase()}).toArray(function(err, locodeResult) {
            res.send(
                JSON.stringify(locodeResult)
            );
        });
    });

    app.get('/list', function (req, res) {
        collection.find().toArray(function(err, locodeResult) {
            const loCodes = locodeResult.map(d => {
                return d.fullcode;
            });
            res.send(
                JSON.stringify(loCodes)
            );
        });
    });

    server = app.listen(process.env.LSRV_PORT || 8081, function () {
        var host = server.address().address
        var port = server.address().port
        console.log("Example app listening at http://%s:%s", host, port)
    })

});
 
