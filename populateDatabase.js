var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/climbRecdb');

var Climbers = require('./models/Climbers');
var Climbs = require('./models/Climbs');
var Ascents = require('./models/Ascents');

var Constants = require('./Constants');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
for (var i in db.collections){
	db.collections[i].remove(function(){});
}

var climberIds = [];
var climbIds = [];

function addClimbersList(climbersList, callback){
	if (climbersList.length > 0){
		var climber0 = climbersList[0];
		Climbers.addClimber(
			// name, is_female, city, country, optional_info
			climber0[0],
			climber0[1],
			climber0[2],
			climber0[3],
			climber0[4],
			function(err, climber){
				climberIds.push(climber._id);
				var remainingClimbersList = climbersList.slice(1);
				addClimbersList(remainingClimbersList, callback);
			});
	} else {
		console.log('adding last climber');
		callback();
		// setTimeout(callback, 1000); //race condition here...I'm ok with it for a test script tho :|
	}
}

function addClimbsList(climbsList, callback){
	if (climbsList.length > 0) {
		var climb0 = climbsList[0];
		Climbs.addClimb(
			//name, crag, grade
			climb0[0],
			climb0[1],
			climb0[2],
			function(err, climb){
				climbIds.push(climb._id);
				var remainingClimbsList = climbsList.slice(1);
				addClimbsList(remainingClimbsList, callback);
			});
	} else {
		console.log('adding last climb');
		// setTimeout(callback, 3000);
		callback();
	}
}

var climbersToAdd = [
	// [name, is_female, city, country, optional_info],
	['Charlie Andrews', false, 'Los Angeles','United States', {} ],
	['Inigo Montoya', true, 'Denver','United States', {} ],
];

var climbsToAdd = [
	// [name, crag, grade],
	['Lethal Weapon', 'New Jack City', '7b+'],
	['Ghetto Blaster', 'Malibu Creek', '8a'],
];

addClimbersList(climbersToAdd, function(){
	addClimbsList(climbsToAdd, function(){
		console.log(climberIds);
		console.log(climbIds);
		Ascents.addAscent(
			climberIds[0], 
			climbIds[0], 
			false, 
			0, 
			new Date(), 
			Constants.ASCENT_TYPE_STRING.ONSIGHT, 
			function(err,ascent){
				if (err) {console.log(err); return;}
				Ascents.addAscent(
					climberIds[1], 
					climbIds[1], 
					true, 
					3, 
					new Date(), 
					Constants.ASCENT_TYPE_STRING.REDPOINT, 
					function(err, ascent){
						if (err) {console.log(err); return;}
						console.log('adding last ascent');
				});
		});		
	});
});
