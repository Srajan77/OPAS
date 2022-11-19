const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const ejs = require("ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer(
  {
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 15                           // 15 mb
    },
    // fileFilter: fileFilter

  })

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/assignmentDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database Connected....");
  })
  .catch((err) => {
    console.log(err);
  });



const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    assignment: String,
    rollNo: String,
    enrollment: String,
    subjectName: String,
    semester: String
});

const User = new mongoose.model('User', userSchema);




app.get("/", (req,res) =>{
  res.render("home");
})


app.get("/register", (req,res)=>{
    res.render("register");
})

app.post("/register", function(req,res){
  const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        enrollment: req.body.enrollment,
    })



    newUser.save((err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
        console.log("Successfully saved in the Databse");
        res.render("submitassignment");
        }
    })
})


app.get("/login", (req,res)=>{
    res.render("login");
})


app.post("/login", (req,res) =>{
  const email = req.body.email;
  const password = req.body.password;

    User.findOne({email: email}, function(err, foundUser){
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    res.render("submitassignment");
                }
            }
            else
            {
              res.send("<h2>Please Check your Email</h2>")
            }

        }
    })

})


app.get("/submitassignment", (req,res)=>{
    res.render("submitassignment");
})


app.post("/submitassignment", upload.single('assignments'), function(req,res,next){

  console.log(req.body.name);
 console.log(req.body.rollNo);
 console.log(req.file.path);

    const newUser = new User({
        name: req.body.name,
        rollNo: req.body.rollNo,
        subjectName: req.body.subjectName,
        semester: req.body.semester,
        enrollment: req.body.enrollment,

        assignment: req.file.path
    })

         newUser.save((err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
        console.log("Successfully saved in the Databse");
        res.render("success");
        }
    })

})
 

   


























// app.get("/temp", function(req,res){
//     res.sendFile(__dirname + "/index.html");
// });

// app.post("/items", upload.single('uploadedImages'), function(req, res, next){
//   //console.log(req.body.name);

//  console.log(req.file);       // gives info about the file only i.e path ans url , etc
//   const obj = JSON.parse(JSON.stringify(req.body)); 
//   // const files = req.file;
//   console.log(req.body)        // give info about name and rollNo


//   console.log(req.body.name)
//   console.log(req.body.rollNo)
//   console.log(req.file.path)

//   const assignment = new Assignment({
//     sname: req.body.name,
//     rollNo: req.body.rollNo,
//     fontFile: req.file.path
// })

// assignment.save(function(err){
//     if(err)
//     {
//       console.log(err);
//     }
//     else
//     {
//       console.log("Successfully saved in the database");
//     }
//   })


// })





app.listen(3000, function(req,res){
    console.log("Server started on port 3000");
})
