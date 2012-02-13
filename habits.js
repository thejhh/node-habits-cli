#!/usr/bin/env node
var commands = {},
    basedir = process.env.HOME || __dirname,
    db = require('./db.js').open(basedir + '/.habits.json'),
    foreach = require('snippets').foreach;

/* Print duration */
function duration(time) {
	var total_secs = time / 1000,
	    days = Math.floor(total_secs/(24*3600)),
	    hours = Math.floor(total_secs/3600) - days*24,
	    minutes = Math.floor(total_secs/60) - hours*60 - days*24*60,
	    tokens = [];
	if(days !== 0) tokens.push(days + ' days');
	if(hours !== 0) tokens.push(hours +' hours');
	if(tokens.length === 0) tokens.push(minutes + ' minutes');
	return tokens.join(' ');
}

/* Event when database becomes ready */
db.on('ready', function() {
	if(!db.habits) {
		db.habits = [];
		db.commit(function(err) {
			if(err) console.error('Failed to commit: ' + err);
		});
	}
});

/* Help command */
commands.help = function() {
	console.log('Commands:');
	console.log('  list      -- list habits');
	console.log('  add HABIT -- add new habit');
	console.log('  trigger|do HABIT -- trigger habit');
};

/* Add habit */
commands.add = function(name) {
	db.whenReady(function() {
		db.habits.push({'name':name});
		db.commit(function(err) {
			if(err) console.error('Failed to commit: ' + err);
			else console.log('OK');
		});
	});
};

/* Trigger habit */
commands.trigger = function(name) {
	db.whenReady(function() {
		var habit;
		foreach(db.habits).each(function(obj) {
			if(obj.name.toLowerCase() === name.toLowerCase()) {
				habit = obj;
			}
		});
		
		if(!habit) {
			console.log('Could not find habit by name ' + name);
			return;
		}
		
		habit.last = (new Date()).getTime();
		db.commit(function(err) {
			if(err) console.error('Failed to commit: ' + err);
			else console.log('OK');
		});
	});
};

commands['do'] = commands.trigger;

/* List habits */
commands.list = function() {
	console.log('Habit | Last time');
	console.log('------+----------');
	db.whenReady(function() {
		foreach(db.habits).each(function(habit) {
			var last = new Date(),
			    now = new Date(),
			    msecs;
			if(habit.last) {
				last.setTime(habit.last);
				msecs = now.getTime() - last.getTime();
			}
			if(!habit.last) {
				console.log(habit.name + ' | Never done before');
			} else {
				console.log(habit.name + ' | ' + duration(msecs) + ' ago');
			}
		});
	});
};

/* */
(function() {
	var optimist = require('optimist'),
	    argv = optimist
	    .usage('Usage: $0 COMMAND [arguments]')
	    .argv,
	    name = argv._.shift(),
	    fn = commands[name];
	if(fn && commands.hasOwnProperty(name) && (typeof fn === 'function')) {
		commands[name].apply(commands, argv._);
	} else {
		console.error('Error: Unknown command: ' + name);
		optimist.showHelp();
	}
})();

/* EOF */
