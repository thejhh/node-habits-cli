

Simple CLI tool to keep track of habits
=======================================

Prototype for habit tracker concept.

Getting help:

	$ habits help
	Commands:
	  list      -- list habits
	  add HABIT -- add new habit
	  trigger|do HABIT -- trigger habit

Listing habits:

	$ habits list
	Habit | Last time
	------+----------
	Teeth | 8 minutes ago

Triggering a habit:

	$ habits do teeth
	OK
	$ habits list
	Habit | Last time
	------+----------
	Teeth | 0 minutes ago

After a while the list looks like:

	$ habits list
	Habit                | Last time
	---------------------+----------
	teeth                | 3 hours ago
	litterbox            | 3 hours ago
	drink.water          | 2 hours ago
	eat.baguette         | 2 hours ago
	work                 | 1 hours ago
	coding               | 1 hours ago
	freeciv.lt30         | 58 minutes ago
	freeciv.lt30.techdoc | 55 minutes ago
	nor.email            | 25 minutes ago
	facebook             | 25 minutes ago
	freeciv.lt23ex       | 14 minutes ago
	drink.drpepper       | 0 minutes ago
