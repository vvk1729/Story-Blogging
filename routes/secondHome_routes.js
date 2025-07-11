const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");


// All Get Requests
router.get("/" , ensureAuthenticated ,(req,res) => {
    Post.find()
        .populate("userId")
        .then((result) => {
            res.render("second/home" ,{posts: result.reverse() , curr_user: req.user});
        })
        .catch((err) => {
            res.send(err);
        });
});

// Create page GET ROUTE
router.get("/create" ,ensureAuthenticated, (req,res) => {
    res.render("second/create");
});

// Detail of single story
router.get('/storyDetail/:id' ,ensureAuthenticated, (req,res) => {
    const id = req.params.id;
    Post.findById(id)
        .populate("userId")
        .then((result) => {
            res.render("second/details" , {details: result , curr_user: req.user});
        })
        .catch((err) => {
            res.send(err);
            console.log(err);
        });
});

// Portfolio 
router.get("/portfolio" ,ensureAuthenticated, (req,res) => {
    User.findById(req.user)
    .populate("Posts")
    .then(result => {
      console.log("Portfolio is working properly");
      res.render('second/portfolio' , {user: result , curr_user: req.user});
    })
    .catch(err => {
      console.log(err);
    })
});

//others portfolio
router.get("/portfolio/:id" , ensureAuthenticated , (req,res) => {
    const id = req.params.id;
    User.findById(id)
        .populate("Posts")
        .then((result) => {
            res.render("second/portfolio" , {user: result , curr_user: req.user});
        })
        .catch((err) => {
            res.send(err);
            console.log(err);
        });
})

// new story POST request
router.post("/create"  , ensureAuthenticated, async(req,res) => {
    const { userId } = req.body;

    console.log(req.body);
    console.log(req.user);
    const newPost = new Post({
        title: req.body.title,
        about: req.body.about,
        description: req.body.description,
        userId: req.user,
    });

    await newPost.save()
        .then((r) => {console.log("the post is saved")})
        .catch((err) => res.send({msg: "ur post is not saved" , err}));
                                                                        
    const postOwner = await User.findById(newPost.userId);

    postOwner.Posts.push(newPost);

    await postOwner.save(function(err){
        if(err)console.log(err);
        else console.log("post is pushed into user data");
    });

    res.redirect("/home");
});

// Delete the user post only
router.post("/delete/:id" , ensureAuthenticated ,(req,res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then((result) => {
            console.log("post is deleted");
            res.redirect('/home');
            
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = router;