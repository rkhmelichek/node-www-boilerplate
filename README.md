node-www-boilerplate
====================

A boilerplate project for creating node.js web applications.

Getting Started
===============

These steps will set up a new project derived from `node-www-boilerplate`,
that will then allow you to track and merge updates from `node-www-boilerplate`.

Alternatively, if you don't care about that, just copy/clone/fork this and start hacking away.

*
Clone the boilerplate project.
```bash
git clone https://github.com/rkhmelichek/node-www-boilerplate.git my-application
```

*
Create a branch for the boilerplate project.
You can use it to later merge updates if you like.
```bash
git branch boilerplate
git remote add boilerplate https://github.com/rkhmelichek/node-www-boilerplate.git
```

*
You'll probably want to set a new upstream repository (hosted on github or elsewhere).
```bash
git remote remove origin
git remote add origin git@github.com:username/my-application.git
git push -u origin master
```

*
Install dependencies and run the application.
```bash
npm install
npm start
```

* Write your award-winning web app ...

*
Periodically, you may want to merge updates to the boilerplate project.
```bash
git checkout boilerplate
git pull boilerplate master
git checkout master
git merge boilerplate
```