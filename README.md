# @vamship/grunt-utils
_Library of modules that are useful to build grunt tasks and configure
Gruntfiles._

>This library was originally intended for internal consumption, though the
>functionality provided by this library is fairly generic.

Grunt is a popular task automation framework, and can be used to build
automated tasks that make up a develop/test/build/publish workflow.

This library does not actually implement grunt tasks, but provides utility
classes and modules to not just build grunt tasks, but also configure
gruntfiles for a given project.

## Motivation
In addition to writing code (and tests!), every project brings with it a common
set of tasks that comprise a _development workflow_ for the project. This
workflow includes common activities such as linting, formatting files, testing,
building, packaging, etc.

Having consistent way of performing these tasks makes it easier to switch from
one project to another, because all common tasks will be identical for a given
class of project (nodejs library, API server, etc.).

In order to ensure this consistency, a common task automation framework (Grunt)
is used, combined with a consistent configuration and development tool set for
that framework.

This library exports modules and classes that enable the creation of
consistent Gruntfiles, ensuring that they can be ported from project to project
with minimal (preferably zero) changes.

## Installation
This library can be installed using npm:
```
npm install @vamship/grunt-utils
```

## Usage
The classes and modules exported by this library are independent, and can be
used by importing them into the source code as follows:
```
const {Directory} = require('@vamship/grunt-utils');
...

const root = new Directory('./');
...

// Use the directory object as required

```
