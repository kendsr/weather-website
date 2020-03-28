const path = require('path');
const hbs = require('hbs');
const express = require('express');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const app = express();
// Set up static dir
app.use(express.static(publicDirPath));
// Set up handlebars templates
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Kendsr'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Message',
        message: 'This is a helpful message!',
        name: 'Kendsr'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Kendsr'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error:'You must provide address'
        }); 
    }
    
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });               
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Help article nor found!',
        name: 'Kendsr'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        msg: 'Page not found',
        name: 'Kendsr'
    });
});

app.listen(3000, () => {
    console.log('Server started port 3000...');
});