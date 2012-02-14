#!/usr/bin/env node
var commands = {},
    basedir = process.env.HOME || __dirname,
    db = require('filedb').open(basedir + '/.habits.json'),
    foreach = require('snippets').foreach,
	rpad = require('snippets').rpad;

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
	db.whenReady(function() {
		var habits = [], key_size;
		foreach(db.habits).each(function(habit) {
			var last = new Date(),
			    now = new Date(),
			    msecs;
			
			if(key_size === undefined) {
				key_size = habit.name.length;
			} else if(habit.name.length > key_size) {
				key_size = habit.name.length;
			}
			
			if(habit.last) {
				last.setTime(habit.last);
				msecs = now.getTime() - last.getTime();
				habits.push({'name':habit.name, 'last':habit.last, 'msecs':msecs});
			} else {
				habits.push({'name':habit.name});
			}
		});
		
		habits.sort(function(a, b) {
			var a_msecs = a.msecs || 0,
			    b_msecs = b.msecs || 0;
			return (a_msecs === b_msecs) ? 0 : ( (a_msecs < b_msecs) ? 1 : -1 ); 
		});
		
		console.log(rpad('Habit', key_size, ' ') + ' | Last time');
		console.log(rpad('', key_size, '-') + '-+----------');
		foreach(habits).each(function(habit) {
			if(!habit.msecs) {
				console.log(rpad(habit.name, key_size, ' ') + ' | ');
			} else {
				console.log(rpad(habit.name, key_size, ' ') + ' | ' + duration(habit.msecs) + ' ago');
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
