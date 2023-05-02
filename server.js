const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
;
let alert = require('alert')
// var popup = require('popups')
const app = express();


var mysql = require('mysql2');
const { encode } = require('punycode');
var path = require('path')
app.use(express.static(path.join(__dirname ,'public')))
let encodeUrl = parseUrl.urlencoded({ extended: false });

//session middleware
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "root", // my username
    password: "Bohara@123", // my password
    database: "AuthForm"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/HomePage/index.html');
})
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/RegistrationForm/register.html');
})

app.post('/Student_register', encodeUrl, (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var gender = req.body.gender;
    var email = req.body.email;
    var phone = req.body.phone;
    var usn = req.body.usn;
    var sem = req.body.sem;
    var password = req.body.password;
   var confirmPassword = req.body.confirmPassword
   console.log(firstName)
    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // checking user already registered or no
        // con.query(`SELECT * FROM student WHERE email = '${email}' AND password  = '${password}'`, function(err, result){
            con.query(`SELECT * FROM student WHERE email = '${email}' `, function(err, result){
      
        if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.sendFile(__dirname + '/RegistrationForm/failReg.html');
            }else{
            //creating user page in userPage function
            function userPage(){
                // We create a session for the dashboard (user page) page and save the user data to this session:
                req.session.user = {
                    firstname: firstName,
                    lastname: lastName,
                    gender: gender,
                    email: email,
                    phone:phone,
                    usn: usn,
                    sem: sem,
                    password: password,
                    confirmpassword:confirmPassword 
                };

                // res.send(`
                // <!DOCTYPE html>
                // <html lang="en">
                // <head>
                //     <title>Login and register form with Node.js, Express.js and MySQL</title>
                //     <meta charset="UTF-8">
                //     <meta name="viewport" content="width=device-width, initial-scale=1">
                //     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                // </head>
                // <body>
                //     <div class="container">
                //         <h3 >Hi, ${req.session.user.firstname} ${req.session.user.lastname}</h3>
                //         <h2> registration successful</>
                //         <a href="/">Log out</a>
                //     </div>
                // </body>
                // </html>
                // `);
          
                res.sendFile(__dirname + '/RegistrationForm/Face_Register/index.html')
          
          
            } 
               
                var sql = `INSERT INTO student (firstname, lastname, gender, email, phone, usn, sem, password, confirmpassword) VALUES 
                ('${firstName}', '${lastName}', '${gender}', '${email}', '${phone}', '${usn}', '${sem}', '${password}', '${confirmPassword}')`;

                
                con.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        userPage();
                    };
                });

        }

        });
    });


});

app.get("/login", (req, res)=>{
    res.sendFile(__dirname + "/LoginForm/login.html");
});
app.get('/ForgetPassword', (req, res) => {
    res.sendFile(__dirname + '/LoginForm/forget.html');
})

app.get('/studentprofile', (req, res) => {
    res.sendFile(__dirname + '/Profile/Studentprofile.html');
})

app.get('/teacherprofile', (req, res) => {
    res.sendFile(__dirname + '/Profile/Teacherprofile.html');
})



app.post('/Teacher_register', encodeUrl, (req, res) => {
    var T_firstName = req.body.T_firstName;
    var T_lastName = req.body.T_lastName;
    var T_email = req.body.T_email;
    var T_phone = req.body.T_phone;
    var T_faculty = req.body.T_faculty;
    var T_password = req.body.T_password;
   var T_confirmPassword = req.body.T_confirmPassword

   console.log(T_firstName)
    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // checking user already registered or no
             con.query(`SELECT * FROM teacher WHERE T_email = '${T_email}' `, function(err, result){
      
        if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.sendFile(__dirname + '/RegistrationForm/failReg.html');
            }else{
            //creating user page in userPage function
            function Teacher_userPage(){
                // We create a session for the dashboard (Teacher) page and save the user data to this session:
                req.session.user = {
                    T_firstname: T_firstName,
                    T_lastname: T_lastName,
                    T_email: T_email,
                    T_faculty:T_faculty,
                    T_phone:T_phone,
                    T_password: T_password,
                    T_confirmpassword:T_confirmPassword 
                };

                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Login and register form with Node.js, Express.js and MySQL</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h3>Hi, ${req.session.user.T_firstname} ${req.session.user.T_lastname}</h3>
                       
                        <a href="/">Log out</a>
                    </div>
                </body>
                </html>
                `);
            } 




               
                var sql = `INSERT INTO teacher (T_firstname, T_lastname, T_email, T_phone, T_faculty, T_password, T_confirmpassword) VALUES 
                ('${T_firstName}', '${T_lastName}',  '${T_email}', '${T_phone}', '${T_faculty}',  '${T_password}', '${T_confirmPassword}')`;

               
                console.log(req.body.T_email)
                con.query(sql, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        // using userPage function for creating user page
                        Teacher_userPage();
                    };
                });

        }

        });
    });


});



app.post('/session', encodeUrl,(req,res) =>{
  
    var subjectcode = req.body.subjectcode;
    var subjectname = req.body.subjectname;
    var sessiontime = req.body.sessiontime   
  
    
    console.log(req.body.subjectcode)
                   
                    var sql = `INSERT INTO session_db ( subject_code,subject_name, session_time) VALUES 
                    ('${subjectcode}','${subjectname}', '${sessiontime}')`;
    
                              con.query(sql, function (err, result) {
                        if (err){
                            console.log(err);
                        }else{
                            // using userPage function for creating user page
                            // console.log("session created")
                            console.log("Session created successfully.");
                     
 alert("session is successfuly created")

//  res.redirect(req.originalUrl)




                        };
                    });
    
            });

app.post("/profile", encodeUrl, (req, res) => {
    var Email = req.body.email;
    var Password = req.body.password;
  
    con.connect(function (err) {
      if (err) {
        console.log(err);
      };
  
      con.query(`SELECT * FROM teacher WHERE T_email = '${Email}' AND T_password = '${Password}'`, function (err, result) {
        if (err) {
          console.log(err);
        };
  
        function teacherUserPage() {
          // We create a session for the dashboard (user page) page and save the user data to this session:
          req.session.user = {
            firstname: result[0].T_firstname,
            lastname: result[0].T_lastname,
            role: "teacher"
          };

  

        //   res.redirect("/studentprofile");
      
        var Teacher_name=   req.session.user.firstname + ' ' +   req.session.user.lastname
        res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create session</title>
    <link rel="stylesheet" href="/css/TeacherprofStyle.css">
</head>
<body>
    <!--Card class for displaying user's data from the SAVED database-->
    <div class="card">
        <div class="card_background_img"></div>
        <div class="card_profile_img"></div>
        <div class="user_details">
            <h3>${Teacher_name}</h3>
            <p>Teacher</p>
        </div>
        <div class="card_count">
            <div class="count">
                <div class="fans">
                    <h3>Cloudtend Id: 123456789</h3>
                    <h3>Computer Science Department</h3>
                </div>
            </div>
             <div class="btn">Edit Profile</div>
        </div>
    </div>
     <!--event_container class for displaying existing sessions-->
    <div class="event_container">
    <div class="search_bar"> <!--Searchbar-->
        <div class="form">
            <div class="title">Create<br> a session <br> for the students!</div>
            <div class="subtitle">Fill the details below and click on create to start a new session.</div>
            <form   id="session-form" action="/session" method="POST"> 
          <div class="input-container_ic1">
          <label for="subjectCode" class="placeholder">Subject Code: </label>
          <input id="subjectcode" name="subjectcode" class="input" type="text" placeholder="" required />
      </div>
      <div class="input-container_ic2">
          <label for="subject" class="placeholder">Subject name:</label>
        <input id="subjectname" class="input" name="subjectname" type="text" placeholder="" required />
      </div>
      <div class="input-container_ic3" >
          <label  class="placeholder">Session time (in minutes):</>
        <input id="sessiontime" class="input" name="sessiontime" style="width: 315px;" type="number" placeholder="" required />
      </div>

     

      <button type="submit" class="submit">Create</button>
      
     </form>
          </div>
        </div>
    </div>
    <script>
    function clearInputs() {
      document.getElementById("session-form").reset();
    }
  </script>
    

</body>


</html>



        
        `)
    
        }
  
        if (Object.keys(result).length > 0) {
          teacherUserPage();

        } 
        
        else {
          con.query(`SELECT * FROM student WHERE email = '${Email}' AND password = '${Password}'`, function (err, result) {
            if (err) {
              console.log(err);
            };


            function studentUserPage() {
              // We create a session for the dashboard (user page) page and save the user data to this session:
              req.session.user = {
                firstname: result[0].firstname,
                lastname: result[0].lastname,
                usn: result[0].usn,
                sem: result[0].sem,
               
              };

      
  
            //   res.redirect("/studentprofile");

              var s_name = req.session.user.firstname + " " + req.session.user.lastname
              var s_usn= req.session.user.usn
              var s_sem = req.session.user.sem
            
             // session database
           

                    //    res.redirect("/teacherprofile");
                   // Send the updated HTML page with the student details
                   res.send(`
                   <!DOCTYPE html>
                   <html lang="en">
                   <head>
                       <meta charset="UTF-8">
                       <meta http-equiv="X-UA-Compatible" content="IE=edge">
                       <meta name="viewport" content="width=device-width, initial-scale=1.0">
                       <title>Session Login</title>
                       <link rel="stylesheet" href="/css/StudentprofStyle.css">
                   </head>
                   <body>
                       <!--Card class for displaying user's data from the SAVED database-->
                       <div class="card">
                           <div class="card_background_img"></div>
                           <div class="card_profile_img"></div>
                           <div class="user_details">
                               <h3>${s_name}</h3>
                               <p>Computer Science & Technology</p>
                           </div>
                           <div class="card_count">
                               <div class="count">
                                   <div class="fans">
                                       <h3>USN : ${s_usn}</h3>
                                       <h3>Semester: ${s_sem}</h3>
                                   </div>
                               </div>
                               <div class="btn">Edit Profile</div>
                           </div>
                       </div>
                        <!--event_container class for displaying existing sessions-->
                       <div class="event_container">
                       <div class="search_bar"> <!--Searchbar-->
                           <div class="search">
                               <input type="text" class="searchTerm" placeholder="Search for existing sessions">
                               <button type="submit" class="searchButton">Search
                              </button>
                            </div>
                           </div>
                         
                           <div class="ExistEvent">
                               <div class="horizontal_line"></div>
                               <p>Existing sessions ⬇️</p>
                           </div>
                           <div class="events">
                               <div class="E1">
                                   <p>18CE2023|Cloud Computing| 8th semester</p>
                                   <button type="submit" class="joinButton">Join
                                   </button>
                               </div>
                               <div class="E2"><p>18CE2024|Computer networks| 8th semester</p>
                                   <button type="submit" class="joinButton">Join
                                   </button></div>
                               <div class="E3"><p>18CE2025|Incident response| 8th semester</p>
                                   <button type="submit" class="joinButton">Join
                                   </button></div>
                           </div>
                       </div>
                   `)
            }
  
            if (Object.keys(result).length > 0) {
              studentUserPage();
            } else {
              res.sendFile(__dirname + '/LoginForm/failLog.html');
            }
          });
        }
      });
    });
    
    
  });
  

app.listen(4000, ()=>{
    console.log("Server running on port 4000");
});