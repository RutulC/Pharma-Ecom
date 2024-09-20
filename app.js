const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const passport = require("passport");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { isLoggedIn } = require("./middleware");
const LocalStratey = require("passport-local");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongo");

const Product = require("./models/products");
const User = require("./models/user");

mongoose
  .connect("mongodb://localhost:27017/pharma", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connection Open!!");
  })
  .catch((err) => {
    console.log("Oh No Mongo Error!!");
    console.log(err);
  });
// const url = 'mongodb://localhost/pharma';
// mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
// const connection = mongoose.connection;
// connection.once('open', ()=>{
//   console.log('Mongo Connection Open')
// }).catch((err=> {
//       console.log("Oh No Mongo Error!!");
//       console.log(err);
// });

const app = express();
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static("public"));

app.use((req,res,next) => {
  res.locals.session = req.session
  next()
})
// Session store
// let mongoStore = new MongoDBStore({
//   mongooseConnection: mongoose.connection,
//   collection: 'sessions'
// })

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  store: MongoDBStore.create({ mongoUrl: "mongodb://localhost/pharma" }, {collection:'sessions'}),
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// Authentication Method
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratey(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Template Engine
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Middleware

// Routes
app.get("/", async (req, res) => {
  const products = await Product.find({});
  res.render("index", { products });
});
app.get("/home", async (req, res) => {
  const products = await Product.find({});
  res.render("home", { products });
});

// Authenticate User Routes
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      console.log(registeredUser);
      req.flash("success", "Welcome to PharmaEcom!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("Error", "Oh ");
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/");
  }
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    return res.redirect("/");
  });
});

// CRUD Operations
app.get("/newProduct", isLoggedIn, (req, res) => {
  res.render("newProduct");
});

app.post(
  "/products",
  catchAsync(async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Sucessfully made a new Product!");
    res.redirect("/");
  })
);

app.get(
  "/products/:id",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Cannot find Product!");
      return res.redirect("/");
    }
    res.render("show", { product });
  })
);

app.get(
  "/products/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render("edit", { product });
  })
);

app.put(
  "/products/:id",
  catchAsync(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      ...req.body.product,
    });
    req.flash("success", "Sucessfully Updated Product!");
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash("success", "Sucessfully Deleted Product!");
    res.redirect("/");
  })
);

app.get("/buy", isLoggedIn, (req, res) => {
  res.render("buy");
});

app.post("/buy", (req, res) => {
  req.flash("success", "ORDER PLACED!!!");
  // console.log("WHooo. submited");
  res.redirect("/");
});

// AddToCart
app.get("/cart", async (req, res) => {
  // const product = await Product.findById(req.params.id)
  res.render("cart", {session});

  // console.log('cart', {Product})
});

app.post("/update-cart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }

  // let cart = req.session.cart
  console.log(req.body)
  const cart = req.session.cart;
  console.log(cart)
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
    };
    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = parseInt(cart.totalPrice) + parseInt(req.body.price);
  } else {
    cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    cart.totalQty = cart.totalQty + 1;
    cart.total = parseInt(cart.totalPrice) + parseInt(req.body.price)
  }

  return res.json({ totalQty: req.session.cart.totalQty});
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

// app.use((err, req, res, next) => {
//   res.send("Something went wrong!");
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Something went wrong";
//   res.status(statusCode).render("error", { err });
// });

app.listen("3000", () => {
  console.log("Serving running on PORT 3000");
});
