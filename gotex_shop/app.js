const express = require('express');
const app = express();
const mysql = require('mysql');

// public - папка где хранится статика
app.use(express.static('public'));

// задаем шаблонизатор pug
app.set('view engine', 'pug');

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '31201919',
  database: 'market',
});

// con.connect((err) => {
//   if (err) throw err;
//   console.log('Connected');
// });

app.listen(3000, () => {
  console.log('node expres work on 3000');
});

app.get('/', function(req, res) {
  con.query(
    'SELECT * FROM goods',
    function(error, result) {
    if (error) throw error;

    let goods = {};
    for (let i = 0; i < result.length; i++) {
      goods[result[i]['id']] = result[i];
    }

    console.log(JSON.parse(JSON.stringify(goods)));

    res.render('main', {
      foo: 'От производителя',
      bar: 100,
      goods: JSON.parse(JSON.stringify(goods)),
    });
  });
});

app.get('/cat', function(req, res){
    console.log(req.query.id);
    let catId=req.query.id;

    let cat=new Promise(function(resolve,reject){
        con.query(
            'SELECT * FROM category WHERE id='+catId, 
            function(error, result) {
                if (error) throw error;
                resolve(result);
            });

    });

    let goods=new Promise(function(resolve,reject){
        con.query(
            'SELECT * FROM goods WHERE category='+catId, 
            function(error, result) {
                if (error) throw error;
                resolve(result);
            });
    });
    Promise.all([cat,goods]).then(function(value){
        console.log(value[0]);
        res.render('cat',{
            cat:JSON.parse(JSON.stringify(value[0])),
            goods:JSON.parse(JSON.stringify(value[1])),
        })
    })
});


    

   



   

