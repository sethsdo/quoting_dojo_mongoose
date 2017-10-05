"use strict"

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
mongoose.connect('mongodb://localhost/quotes_mongoose');
const QuotesSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 20 },
    quote: { type: String, required: true, maxlength: 255 }
}, { timestamps: true });

mongoose.model('Quote', QuotesSchema);
const Quote = mongoose.model('Quote');
const session = require('express-session');

app.use(session({ secret: 'expresspasskey' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;


app.get('/', function (req, res) {
    if (!req.session.errors) {
        req.session.errors = [];
    }
    console.log(req.session.errors)
    const context = {
        "errors": req.session.errors,
    }
    console.log(context);
    res.render('index', context);
});


app.post('/addQuote', function (req, res) {
    var quote = new Quote({ name: req.body.name, quote: req.body.quote });
    quote.save(function (err) {
        if (err) {
            req.session.errors = quote.errors;
            res.redirect('/')
        }
        else {
            res.redirect('/quotes');
        }
    })
})

app.get('/quotes', function (req, res) {
    Quote.find({}, function (err, quotes) {
        if (err) {
            console.log("something wen't wrong!")
        }
        console.log(quotes)
        const context = {
            "quotes": quotes,
        }
        res.render('quotes', context);
    });
});

app.get('/back', function (req, res) {
    req.session.destroy();
    res.redirect('/')
});

app.listen(8000, function () {
    console.log("listening on port 8000");
})