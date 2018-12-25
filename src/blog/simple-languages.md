---
title: Simplicity in Language Design
date: 2087-07-27
draft: true
---

Write about how a simple language can actually make programs more complex because features built into other languages here to be built from scratch in the simple language.
Ex: enums in golang, several implementations/conventions, no right way to do it

In general, I am a fan of simple programming languages.
I enjoy languages that maintain a simple core but are still powerful enough to do complex things.
In this post, I would like to explore the point at which making a language simpler actually adds complexity.
I would like to know what features must a modern language have, and what features can be left out.

Ex 1: Python doesn't have arbitrary length lambdas, so sometimes you have to create a named function
Ex 2: Golang doesn't have enums, so there are several competing ways of doing them
Ex 3: Golang doesn't have generics
