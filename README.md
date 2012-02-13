

Simple CLI tool to keep track of habits
=======================================

Prototype for habit tracker concept.

Sample usage:

	jhh@zeta3-lts:~$ habits help
	Commands:
	  list      -- list habits
	  add HABIT -- add new habit
	  trigger|do HABIT -- trigger habit
	jhh@zeta3-lts:~$ habits list
	Habit | Last time
	------+----------
	Teeth | 8 minutes ago
	jhh@zeta3-lts:~$ habits do teeth
	OK
	jhh@zeta3-lts:~$ habits list
	Habit | Last time
	------+----------
	Teeth | 0 minutes ago

