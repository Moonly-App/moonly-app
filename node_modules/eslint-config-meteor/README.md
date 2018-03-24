# A Meteor Developer's ECMA 6th Edition ESLint Configuration by @iDoMeteor
# <small>v0.0.9</small>

http://github.com/idometeor/eslint-config-meteor

# Installation & Usage

This version is meant for installation via NPM.  To get the .eslintrc which
you would use with your editor or by dropping into a project is located in
[my meteor-skeleton repository](https://github.com/iDoMeteor/meteor-skeleton/)
and [my dotfiles](https://github.com/iDoMeteor/meteor-vim-dotfiles/).

To install this via NPM:

>$ npm install -g eslint-config-meteor

To use it, create a .eslintrc with the following in it (or add to your existing,
not sure how that will go for you tho :>):

  {
    "extends": "meteor"
  }

# Name

I probably should have named this eslint-config-idometeor and made this one
the official Meteor configuration.  If anyone would like me to do so, by
all means, let me know!

## Summary

Meteor upholds a high standard for coding, so do I, and so should you.
With that goal in mind, I set every option in this file with intent.  It
may provide you with a fair amount of frustration if you are new to linting
tools.

This is intended to be integrated into your editor (along with .editorconfig)
in such a way as to allow you to use it continually.  If you drop it on a
large, existing code base that may be... lax in coding standards, expect to
get an enormous amount of reports.

However, if you already have smart ECMA coding style, then you will most
likely appreciate the learning experience / tightening up of your style.

Meteor and ECMA are both intended to be flexible.  This file allows for that
flexibility where appropriate, but also has sane protections for actual
poor programming methodology.  Hopefully it will allow enough flexibility
to still take advantage of the fun parts of the language.

In general, this configuration in tandem with my .jscsrc should provide
one of the best programmatic ways to ensure that your Meteor code is as
near to being inline with the MDG Style Guide as is practical from an
automated tool.

## Caveats

I allow (and prefer, unless Sciencing) ==.  The Abstract Equality
Comparison Algorithm is no more "obscure (src: ESLint)" than is the
Strict Equality Comparison Algorithm.  Actually, it comes first not only
in this paragraph, but also in the ECMA specification (11.9.3 vs 11.9.6).

The standard convention comes from the same old-school origin as using !!.
Namely, poor programming practices and ECMA implementations from the past.
There are distinct advantages to using == in non-precision (read
non-mission-critical) contexts.  I'll leave that dark magic up to you to
discover.

Point is, you should probably be statically typing if you are that are that
concerned about precision, or not concerned about this level of semantics if
your ability to keep your types straight is ... still developing.

That being said, I throw warnings on (x == null) || (x != null). :p

This is not for niave Javascripters, you should be able to
grok what this is going to do for you or use eslint --init at the command
line and go from there.

I use object literals instead of switch, as one should.  However, once in
a while, a switch w/fallthrough and/or no default is actually highly useful.
For instance, Twiefbot uses micro-switches in the natural language
processing.  Therefore, they are allowed, but will throw warnings.  That
means that, while you should not do it, if you really know what you're doing
then go for it.

TODO:
   Thoroughly configure React
   Thoroughly configure Angular

Contributing:
   I welcome pull requests!

