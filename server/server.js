const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const {findPoly, puppeteer, regions} = require('./scraping/findPoly');
const {findDoctor} = require('./scraping/findDoctor');
const {searchDoctors} = require('./scraping/searchDoctors');


const app = express();

app.set('port', 3000);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));


//получение запроса на поликлиники в выбранном районе
app.use('/api/regions', async (req, res) => {
  const value = await findPoly(req.body.region)
  res.json(value)
});

//получение запроса на врачей в выбранной поликлинике
app.use('/api/poly', async (req, res) => {
  const value = await findDoctor(req.body.region, req.body.index)
  //console.log(value)
  res.json(value)
});

//получение запроса на поиск врача в выбранном районе
app.use('/api/search', async (req, res) => {
  const value = await searchDoctors(req.body.region, req.body.doctor)
  //console.log(req.body.region, req.body.doctor)
  //console.log(value)
  res.json(value)
});


app.use(express.static(path.resolve(__dirname, '../dist')))
app.get('/', () => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
})

app.listen(app.get('port'), () => {
  console.log(`[OK] Server is running on localhost:${app.get('port')}`);
});