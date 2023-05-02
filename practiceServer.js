app.post("/profile", encodeUrl, (req, res) => {
    var Email = req.body.email;
    var Password = req.body.password;
  
    con.connect(function (err) {
      if (err) {
        console.log(err);
      }
  
      con.query(
        `SELECT * FROM teacher WHERE T_email = '${Email}' AND T_password = '${Password}'`,
        function (err, result) {
          if (err) {
            console.log(err);
          }
  
          function teacherUserPage() {
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
              firstname: result[0].T_firstname,
              lastname: result[0].T_lastname,
              role: "teacher",
            };
  
            res.render(__dirname + "/views/TeacherProfile.ejs", {
              Teacher_name:
                req.session.user.firstname + " " + req.session.user.lastname,
            });
          }
  
          if (Object.keys(result).length > 0) {
            teacherUserPage();
          } else {
            con.query(
              `SELECT * FROM student WHERE email = '${Email}' AND password = '${Password}'`,
              function (err, result) {
                if (err) {
                  console.log(err);
                }
  
                function studentUserPage() {
                  // We create a session for the dashboard (user page) page and save the user data to this session:
                  req.session.user = {
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    usn: result[0].usn,
                    sem: result[0].sem,
                  };
  
                  var s_name = req.session.user.firstname + " " + req.session.user.lastname
                  var s_usn= req.session.user.usn
                  var s_sem = req.session.user.sem
               
                  res.redirect("/verify");

                  app.post("/verify", (req,res) =>{
                    res.render(__dirname + "/views/StudentProfile.ejs", {
                        name: s_name,
                        usn: s_usn,
                        sem: s_sem
                      });
                  })
  
              }
             
  
              //   res.redirect("/verify");
  
                if (Object.keys(result).length > 0) {
                  studentUserPage();
  
                
  
                } else {
                  res.sendFile(__dirname + "/LoginForm/failLog.html");
                }
              }
            );
          }
        }
      );
    });
  });
  