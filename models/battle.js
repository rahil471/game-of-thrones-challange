const mongoose = require('mongoose');
const async = require('async');

var BattleSchema = mongoose.Schema({
    "name" : {type: String},
    "year" : {type: Number},
    "battle_number" :  {type: Number},
    "attacker_king" : {type: String},
    "defender_king" : {type: String},
    "attacker_1" : {type: String},
    "attacker_2" : {type: String},
    "attacker_3" : {type: String},
    "attacker_4" : {type: String},
    "defender_1" : {type: String},
    "defender_2" : {type: String},
    "defender_3" : {type: String},
    "defender_4" : {type: String},
    "attacker_outcome" : {type: String},
    "battle_type" : {type: String},
    "major_death" : {type: Number},
    "major_capture" : {type: Number},
    "attacker_size" : {type: String},
    "defender_size" : {type: Number},
    "attacker_commander" : {type: String},
    "defender_commander" : {type: String},
    "summer" : {type: Number},
    "location" : {type: String},
    "region" : {type: String},
    "note" : {type: String}
}, {
    timestamps: true
});


/** 
 * @function getBattleLocations
 * Gets a distinct list of Battle Locations
 * @param { function } callback
 */
BattleSchema.statics.getBattleLocations = function(callback){
    return this.distinct('location', {'location': {'$ne': ""}}, callback);
}

/** 
 * @function search
 * Generic filter function
 * @param { Object } query
 * @param { function } callback
 */
BattleSchema.statics.search = function(query, callback){
    let conditions = [];
    for(key in query){
        if(key === 'king'){
            conditions.push({'$or': [{attacker_king: query[key]}, {defender_king: query[key]}]})
        } else {
            conditions.push({[key]: query[key]});
        }
    }
    return this.find({'$and': conditions}, callback);
}

/** 
 * @function mostActive
 * Gets stats for mostactive entitis
 * @param { function } callback
 */
BattleSchema.statics.mostActive = function(callback){
    let most_active = {
        attacker_king: "",
        defender_king:"",
        name: "",
        region: ""
    }
    async.waterfall(
        [
            (callback)=>{
                this.aggregate(
                    [
                        { 
                            $group: { 
                                _id : '$attacker_king',
                                'count': { $sum: 1} 
                            }
                        },{
                            $sort : { 'count': -1}
                        },{
                            $limit: 1
                        }
                    ], function(err, data){
                        if(err){
                            return callback(err);
                        }
                        most_active.attacker_king = data[0] ? data[0]._id : "";
                        callback(null);
                    }
                );
            },
            (callback)=>{
                this.aggregate(
                    [
                        { 
                            $group: { 
                                _id : '$defender_king',
                                'count': { $sum: 1} 
                            }
                        },{
                            $sort : { 'count': -1}
                        },{
                            $limit: 1
                        }
                    ], function(err, data){
                        if(err){
                            return callback(err);
                        }
                        most_active.defender_king = data[0] ? data[0]._id : "";
                        callback(null);
                    }
                );
            },
            (callback)=>{
                this.aggregate(
                    [
                        { 
                            $group: { 
                                _id : '$region',
                                'count': { $sum: 1} 
                            }
                        },{
                            $sort : { 'count': -1}
                        },{
                            $limit: 1
                        }
                    ], function(err, data){
                        if(err){
                            return callback(err);
                        }
                        most_active.region = data[0] ? data[0]._id : "";
                        callback(null);
                    }
                );
            },
            (callback)=>{
                this.aggregate(
                    [
                        { 
                            $group: { 
                                _id : '$name',
                                'count': { $sum: 1} 
                            }
                        },{
                            $sort : { 'count': -1}
                        },{
                            $limit: 1
                        }
                    ], function(err, data){
                        if(err){
                            return callback(err);
                        }
                        most_active.name = data[0] ? data[0]._id : "";
                        callback(null);
                    }
                );
            }
        ],
        (err)=>{
            if(err){
                return callback(err);
            }
            callback(null, most_active);
        }
    );
}

/** 
 * @function defenderSize
 * Gets stats on defender size
 * @param { function } callback
 */
BattleSchema.statics.defenderSize = function(callback){
    let defender_size = {};
    this.aggregate([
        {
            $match: {
                defender_size: { $ne: ""}
            }
        },
        { 
            $group: { 
                _id : '',
                'min': { $min: '$defender_size'}, 
                'max': {$max: '$defender_size'}, 
                'avg': {$avg: '$defender_size'},
                'battleType': {$addToSet: '$battle_type'}    
            }
        }
    ], (err, data)=>{
        if(err){
            return callback(err);
        }
        defender_size.min = data[0] ? data[0].min : "";
        defender_size.max = data[0] ? data[0].max : "";
        defender_size.avg = data[0] ? data[0].avg : "";
        battle_type = data[0] ? data[0].battleType : "";
        callback(null, defender_size, battle_type);
    });
}

/** 
 * @function attackerOutcome
 * Gets stats for attacker's outcome
 * @param { function } callback
 */
BattleSchema.statics.attackerOutcome = function(callback){
    let attacker_outcome = {};
    this.aggregate( [
        {
            $match: {
                attacker_outcome: { $ne: ""}
            }
        },
        { 
            $group: { 
                _id : '$attacker_outcome',
                'count': { $sum: 1} 
            }
        }
    ], (err, data)=>{
        if(err){
            return callback(err);
        }
        for(let i=0; i< data.length; i++){
            attacker_outcome[data[i]['_id']] = data[i]['count'];
        }
        callback(null, attacker_outcome);
    });
}


module.exports = mongoose.model('battle', BattleSchema, 'battle');