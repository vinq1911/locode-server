const initData = require('../locodes.json');

exports.dbInit = (db, cb) => {
    console.log('initializing collection...');
    var collection = db.collection("locodes");
    collection.count((err, count) => {
        if (count === 0) {
            console.log('collection is empty. populating...');
            collection.insert(
                Object.keys(initData).map(
                    (locode) => { 
                        return {
                            fullcode: locode,
                            countryid: initData[locode].country_id,
                            locode: initData[locode].lo_code,
                            name: initData[locode].name,
                            location: { type: 'Point', coordinates: [ initData[locode].lon, initData[locode].lat ] },
                            localname: initData[locode].local_name,
                            functionmask: initData[locode].function_mask,
                            iata: initData[locode].iata,
                            status: initData[locode].status
                        }
                    }
                ), {w:1}, async (err, result) => {
                console.log('collection populated. starting...');
                cb(collection);
            });
        } else {
            console.log('collection data found. starting...');
            cb(collection);
        }
    })
}




