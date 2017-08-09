---
title: Recursive Descent Parsers
date: 2016-12-20
---

In this tutorial we are going to implement a small programming language using the top-down recursive descent method of parsing.
Recursive descent parsing utilizes a set of mutually recursive functions to do the parsing.
Each function handles a different production rule in the language's grammar.
This makes implementing the parser relatively straightforward as the parser code closely resembles the grammar.

## Grammar
The language we will be implementing will be a simple language consisting of variable declarations, assignment statements, and print statements.
All variables will be integers.
Here is the grammar represented in Extended Backus-Naur Form (EBNF):
```no-highlight
prog      = decl-list, stmt-list ;
decl-list = decl | decl, decl-list ;
decl      = 'var', id_list, ';' ;
id-list   = id | id, ',', id-list ;
stmt-list = stmt | stmt, ',', stmt-list ;
stmt      = id, '=', expr, ';' | 'print', expr, ';' ;
expr      = term, { '+', term | '-', term } ;
term      = factor, { '*', factor | '/', factor } ;
factor    = '(', expr, ')' | id | int ;
```

What this grammar basically means is that a program in the language consists of declarations followed by statements, with any number of either.
A declaration consists of the keyword var and then a list of variable names.
A statement is either an assignment of an expression to a variable or a print statement.
An expression in this language is a basic math expression of addition/subtraction and multiplication/division.

An example program would then look like:
```no-highlight
var a , b ;
a = 5 ;
b = 6 ;
print ( a * b ) / 2 ;
```

Which would output `15` as a result.

## Interpreter
We are going to implement the interpreter using Node.js and JavaScript but feel free to use the language your're most comfortable with.
The basic principles will be the same.
As stated earlier, non-terminal symbols on the left hand side of the grammar will become functions in the parser, so there will be functions `prog`, `decl_list`, `decl`, `id_list`, and so on.
These functions will be relataively simple functions that take care of their corresponding rule in the grammar.

Below is the code we'll need to get started.
If you're not familiar with Node then don't worry about the `use strict` and `require` function.
The important thing to understand is how the grammar maps onto the functions.

```javascript
'use strict';
const fs = require('fs');

const var_map = {};
const tokens = fs.readFileSync(process.argv[2], 'utf-8').replace(/\n/g, ' ').trim().split(' ');
const iter = tokens[Symbol.iterator]();
let token = '';
```

The first thing we do is create an empty object that will map variable names to values (e.g. `var_map['a'] = 5`).
We then read the file given by the command line arg into an array of strings.
For simplicity, its assumed that the every token in the language is separated by whitespace.
This allows us to just split the input file on whitespace to get all the tokens.
An iterator is used to keep track of the current token and the `token` variable is used to hold the current token value.

We are also going to need two utility functions:

```javascript
function match(tok) {
    if (tok === token) {
        next();
    } else {
        process.exit(1);
    }
}

function next() {
    const tmp = iter.next();
    if (!tmp.done) {
        token = tmp.value;
    } else {
        process.exit(0);
    }
}
```

`match` compares the current token with the given token and calls `next` if there is a match.
Otherwise it exits the script.
`next` uses the iterator defined above to advance the current token.
Once the iterator is consumed the program exits.

Now we can get started with the parser.
As per the grammar the first function will be `prog`.

```javascript
function prog() {
    decl_list();
    stmt_list();
}
```

We can see how `prog` mimics the way the grammar looks.
Programs consist of declarations and then statements, therefore `prog` calls `decl_list` and then calls `stmt_list`.

Next we have the functions dealing with parsing variable declarations.

```javascript
function decl_list() {
    if (token === 'var') {
        next();
        decl();
        decl_list();
    }
}

function decl() {
    id_list();
    match(';');
}

function id_list() {
    var_map[token] = 0;
    next();
    if (token === ',') {
        next();
        id_list();
    }
}
```

We can see from the grammar that the first thing we look for in a declaration is the keyword `var`.
If this is the case, we advance the token and call `decl` to parse the declaration.
`decl_list` is then recursively called to deal with any remaining declarations.
`decl` calls `id_list` which parses the list of variable names.
These names are added to the `var_map` and initialized to zero.
In accordance with the grammar, each variable name will be separated by a comma.
If a comma is found then the token is advanced and `id_list` calls itself to continue parsing.
Once `id_list` returns, `decl` then matches a semicolon and returns.

Once all declarations have been parsed, the remainder of the program will be statements.
Statements will either be an assignment statement in which a value is assigned to a variable or a print statement in which an expression will be evaluated and its value output to the screen.

```javascript
function stmt_list() {
    if (token === 'print' || token in var_map) {
        stmt();
        stmt_list();
    }
}

function stmt() {
    if (token === 'print') {
        next();
        const v = expr();
        console.log(v);
    } else if (token in var_map) {
        const t = token;
        next();
        match('=');
        var_map[t] = expr();
    }
    match(';');
}
```

`stmt_list` functions similarly to `decl_list`.
It checks for each kind of statement and then calls `stmt` to do that actual parsing.
It then calls itself to deal with any more statements.
Inside `stmt` we check to see if we have a print or assignment statement and proceed accordingly.
If the statement is a print statement then we advance the token and get the value of the expression after the print and log it to the console.
If the current token is in the `var_map` then we know its an assignment statement.
We then save the current token, advance, and match an equals sign.
The value of the expression after the equals is then saved in the `var_map` at the corresponding variable name we saved previous.

Finally we have the functions that parse mathematical expressions in the language.

```javascript
function expr() {
    const t1 = term();
    let t2 = 0;
    while (token === '+' || token === '-') {
        const oper = token;
        next();
        if (oper === '+') {
            t2 += term();
        } else {
            t2 -= term();
        }
    }
    return t1 + t2;
}
```

Looking at the grammar we see that expressions consist of a single term followed by any number of additions or subtractions of more terms.
This is modeled as a while loop that runs until the `token` is no longer a plus or minus.
The first step is getting the value of the left hand side of the expression by calling `term`.
The variable `t2` is initialized to zero in case there is only a single term.
This makes it so that the return is unaffected if there isn't a second term.
Then we loop as long as the current token is a plus or minus (i.e. as long as there are more terms in the expression).
Inside the loop, we save the operator and advance the token.
`t2` is then either incremented or decremented by the value returned by `term` based on the operator.
If the operator is plus then `t2` is incremented, otherwise its decremented.
That way, returning `t1 + t2` will be the correct value when the expression involves subtraction.

```javascript
function term() {
    const f1 = factor();
    let f2 = 1;
    while (token === '*' || token === '/') {
        const oper = token;
        next();
        if (oper === '*') {
            f2 *= factor();
        } else {
            f2 /= factor();
        }
    }
    return Math.floor(f1 * f2);
}
```

`term` functions in much the same way as `expr`.
The only differnces being the operations being done.
Also note that `f2` is set to `1` instead of `0` like in `expr`.
This makes sense because multiplying by `1` doesn't change the value of the return when there isn't a second factor.
just like in `expr`, adding `0` doesn't affect the return.
Note that we need `Math.floor` in the return statement if we want to restrict our language to integer math.
This makes calculations involving division round down to the nearest whole number.

```javascript
function factor() {
    let v = 0;
    if (token === '(') {
        next();
        v = expr();
        match(')');
    } else if (token in var_map) {
        v = var_map[token];
        next();
    } else {
        v = Number.parseInt(token);
        next();
    }
    return v;
}
```

`factor` is the final function in the grammar.
There are three cases dealt with in `factor`: nested expression, variable name, and integer literal.
If an open paranthesis is found then the token is advanced and `expr` is called to parse the inner expression.
A closing paranthesis is then matched to advance the token.
If the token is in the `var_map` then its value is retrieved and the token is advanced. 
Otherwise, we know the token must be an integer literal.
Its value is obtained and the token is advanced.
`factor` then returns the value of `v`.

The final bit of code we need to actually run the interpreter is as follows:
```javascript
next();
prog();
```

`next` advances `token` to point to the first token in the list and `prog` starts the parsing.

We can run the interpreter by issuing the command `node eval.js <file>` where `eval.js` contains all the previous code examples and `<file>` is the name of the program you want to run.
Running the example program given earlier in the terminal would look like:
```no-highlight
$ node eval.js example.txt
15
```

### Conclusion
Recursive descent parsers are a straightforward means of parsing a language.
Each non-terminal symbol in the grammar begins a function in the parser.
This allows the code to closely follow the grammar and makes implementation relatively easy.
I hope this tutorial was helpful in explaing recursive descent parsers.
