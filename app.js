const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");


const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://LinglingGan:520258abc@cluster0.cyufohm.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});

//create the items schema using mongoose 
const itemsSchema = {
    name: String
};
//create a db using only singular word 
const Item = mongoose.model("Item", itemsSchema);
//create the items using the model 

const item1 = new Item ({
    name: "Welcome to your todo list!"
});

const item2 = new Item ({
    name: "Hit the + button to add a new item!"
});

const item3 = new Item ({
    name: "<-- Hit this to delete an item!"
});

//add the items to a list as a default list 

const defaultItems = [item1, item2, item3];

//create a list schema using mongoose 
const listSchema = {
    name: String,
    items: [itemsSchema]
};

//create a list db using model 
const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {
    Item.find({}).then(function(foundItem){
      if (foundItem.length === 0) {
       Item.insertMany(defaultItems);
       res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: foundItem });
      }
    }).catch(function(err){
        console.log(err)
    });
});



app.post("/", function(req, res){
    //grab the value of the textbox
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });
    if (listName === "Today"){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    // if (req.body.list === "work" ) {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId).then(function(err){
            if(!err) {
               console.log("Deleted!") 
               res.redirect("/");
            }
        });
    } else {
        List.findOne({ name: listName }).then(function(foundList){
        if (foundList) {
          foundList.items.pull({ _id: checkedItemId });
          return foundList.save();
        }
      }).then(function(){
        res.redirect("/" + listName);
      })
      .catch(function(err){
        console.log(err);
      });
    }
});




app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}).then(function(foundList){
            if (!foundList) {
                //create a list using the dynamic data 
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                //create the page and render it to the specific page 
                res.redirect("/" + customListName);
            } else {
                //if there is a list already, we just render it 
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
    }).catch(function(err){
        console.log(err)
    });
});
  
  

app.post("/work", function(req, res){
    //grab the value of the textbox
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res) {
    res.render("about");

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server started");
});