const sql=require('mysql');
const express=require('express');
const session=require('express-session');
const path=require('path');
const { request } = require('http');
const { response } = require('express');

const connection=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'Password',
    database:'nodelogin'
});

const app=express();
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true

})
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'static')));



// http://localhost:3000/
app.get('/',(req,res)=>{
    res.sendFile(path.join( __dirname,'/login.html'));
})

//authenticate the user
// http://localhost:3000/auth

app.post('/auth',(req,res)=>{
    //capture the input fields
    let username=req.body.username;
    let password=req.body.password;
    //Ensure the input fields exists and are not empty
    if(username && password){
        //Execute the sql query that select the account from the database based on the specific username and password
        connection.query('SELECT * FROM accounts WHERE username=? and password=?',[username,password],function(err,results,fields){
            //If there is an issue with the query output the error
            if(err)throw err;
            //if the account exists
            if(results.length>0){
                //Authenticate the user
                req.session.loggedin=true;
                req.session.username=username;
                //Redirect to the Homepage
                res.redirect(__dirname,'/home');

            }else{
                res.send('Incorrect Username or Password');
            }
            res.end();

        });

    }else{
        res.send("Please enter User name and Password");
        res.end();
    }
});

//http://localhost:3000/home
app.get('/home',(req,res)=>{
    //if the user is logged in
    if(req.session.loggedin){
        //Output Username
        res.send("Welcome Back " + req.session.username + '!');
    }else{
        res.send("Please login to view this page!")
    }
    res.end();
});

app.listen(3000,()=>{
    console.log('Listening at port 3000...');
});

module.exports=app;





// MySql command for root login from cmd: mysql -u root -p