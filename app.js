const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const app = express();

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const wikiSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Article = mongoose.model("Article", wikiSchema);

//chain route handler meyhod
//restful api get,post,delete,put,patch
app.route("/articles")

  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save((err) => {
      if (!err) {
        console.log("success");
      } else {
        console.log(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany({}, (err, ) => {
      if (!err) {
        res.send("Successfully deleted...");
      } else {
        res.send(err);
      }
    });
  });
//restful api looks like
app.route("/articles/:reqArticle")

  .get((req, res) => {

    Article.findOne({
      title: req.params.reqArticle
    }, (err, requstedArticle) => {
      if (!err) {
        res.send(requstedArticle);
      } else {
        console.log(err);
      }

    });
  })

  .put((req, res) => {
    Article.updateMany({
        title: req.params.reqArticle
      }, {
        title: req.body.title,
        content: req.body.content
      },

      (err) => {
        if (!err) {
          res.send("updated")
        }
      }
    )
  })

  .patch((req, res) => {
    Article.updateOne(
      {title: req.params.reqArticle},
      {$set: {content: req.body.content}},
      (err) => {
        if (!err) {
          res.send("updated")
        }
      }
    )
  })

  .delete((req, res) => {
    Article.deleteOne({title: req.params.reqArticle}, (err) => {
        if (!err) {
          res.send("deleted")
      }
     }
    )
  })

app.listen(3000, () => {
  console.log("server started on port 3000");
});
