const db = require('../config/db_sql');
const Fuse = require('fuse.js')
const jwt = require('jsonwebtoken');

const PAGINATION_LIMIT = 10;
/** Coordinate distance difference between for 5 mins drive
 * Test done from 5.653972034323182, -0.18495920761077314 to 5.636885295272764, -0.18180324696215522
*/
const MINS_5_DISTANCE = 0.017293690484710907;

const getFirstTwoElements = (queryStr) => {
    let splitStr = queryStr.split(' ');
    let twoElements = ['%' + splitStr[0] + '%'];
    if (splitStr.length > 1) {
        twoElements.push('%' + splitStr[1] + '%');
    } else {
        twoElements.push('%' + splitStr[0] + '%');
    }
    return twoElements;
}

const permuteVehicle = (vehicle) => {
    let elem = vehicle.split(' ');
    while (elem.length < 4) { elem.push('*') };
    // return [`${elem[0]} ${elem[1]}`, `${elem[0]} ${elem[2]}`, `${elem[0]} ${elem[3]}`];
    return `${elem[0]} ${elem[1]} | ${elem[0]} ${elem[2]} | ${elem[0]} ${elem[3]}`;
}

const execQuery = async (query, values = []) => {
    return await new Promise((resolve, reject) => {
        db.execute(
            query, values, (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
    }).then(rows => {
        return { success: true, results: rows };
    }).catch(err => {
        console.log(err);
        return { success: false };
    })
}

const transaction = {
    start: async function(){db.beginTransaction()},
    commit: async function(){db.commit()},
    rollback: async function(){db.rollback()}
}

const decodeToken = async (authorizationString) => {
    const token = authorizationString.split(' ')[1];
    try {
        var decoded = jwt.verify(token, process.env.SECRET||'this_is_@_temp.secret');
        decoded['success'] = true;
    } catch (err) {
        console.log(err);
        decoded['success'] = false;
    } finally {
        return decoded;
    }
    // jwt.verify(token,process.env.SECRET,(err,decoded)=>{
    //     if(err){

    //     }else{

    //     }

    // })
}

const getfuzzyParts = (list, pattern) => {
    const options = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        threshold: 0.5,
        // distance: 100,
        useExtendedSearch: true,    // true allows me to use the | (OR) in the pattern. false is default
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,
        keys: [
            "part_name",
            "part_fits_vehicles"
            // "author.firstName"
        ]
    };

    const fuse = new Fuse(list, options);

    return fuse.search(pattern)
}

const getFuzzyVehicles = (list, pattern) => {
    const options = {
        threshold: 0.5,
        keys: [
            "model_name"
        ]
    };
    const fuse = new Fuse(list, options);
    return fuse.search(pattern)
}

/**
 * Sets the distance rating of the shops from the srcCoordinate
 * @param {*} shops 
 * @param {{long:Number,lat:Number}} srcCoordinate 
 */
const setDistanceRatings = (shops, srcCoordinate) => {
    shops.forEach((shop) => {
        // distance in km preffered
        shop['distance'] = calculateDistance(srcCoordinate, { long: shop.shop_long, lat: shop.shop_lat });
        shop['distRating'] = Math.round((shop['distance'] / MINS_5_DISTANCE) + 0.2);
    });
}
const calculateDistance = (src, dest) => {
    return Math.sqrt(Math.pow((src.long - dest.long), 2) + Math.pow((src.lat - dest.lat), 2));
}

module.exports = {
    getFirstTwoElements,
    execQuery,
    getfuzzyParts,
    getFuzzyVehicles,
    permuteVehicle,
    setDistanceRatings,
    decodeToken,
    transaction,
    PAGINATION_LIMIT
}