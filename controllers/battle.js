'use strict';
var express = require('express');
var router = express.Router();
var battleModel = require('../models/battle.js');
const async = require('async');

/** list of battles */
router.get('/locations', function(req, res) {
	battleModel.getBattleLocations((err, data)=>{
		if(err){
			return res.status(500).send('Opps Somethigns broke, we are working on it.');
		}
		res.json(data);
	});
});

/** total count of battles */
router.get('/count', function(req, res) {
	battleModel.count((err, data) => {
		if(err){
			return res.status(500).send('Opps Somethigns broke, we are working on it.');
		}
		return res.json(data);
	});
});

/** search battle by name */
router.get('/search', function(req, res) {
	if(Object.keys(req.query).length === 0) {
		return res.status(400).send("Empty query."); 
	}
	battleModel.search(req.query, (err, data) => {
		if(err){
			return res.status(500).send('Opps Somethigns broke, we are working on it.');
		}
		return res.json(data);
	});
});

/** statistics */
router.get('/stats', function(req, res) {
	let stats = {};
	async.waterfall(
		[
			(callback)=>{
				battleModel.mostActive((err, data)=>{
					stats.most_active = data;
					callback(err);
				});
			},
			(callback)=>{
				battleModel.defenderSize((err, defenderSize, battleType)=>{
					stats.defender_size = defenderSize;
					stats.battle_type = battle_type;
					callback(err);
				});
			},
			(callback)=>{
				battleModel.attackerOutcome((err, data)=>{
					stats.attacker_outcome = data;
					callback(err);
				});
			}
		],
		(err)=>{
			if(err){
				return res.status(500).send('Opps Somethigns broke, we are working on it.');
			}
			return res.json(stats);
		}
	);
});

module.exports = router;