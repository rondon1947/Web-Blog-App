var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var express = require('express');
var app = express();

mongoose.connect("mongodb://localhost:27017/blog_app", { useUnifiedTopology: true, useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://i2.wp.com/handluggageonly.co.uk/wp-content/uploads/2016/09/Ben-Nevis.jpg?fit=1600%2C1065&ssl=1",
//     body: "This is a Test Blog.. So here come the Gibberish - djcbdbcbchbchcbdcb hjcbhc hjc chbscjbc schshjs sg scvds cdskjncnds cdhjbcshbcsnmc hsdbc cbdscb dshjb.",
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.redirect("/blogs/new");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
})

app.listen(3000, function(){
    console.log("Blog server started at localhost:3000");
});