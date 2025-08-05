const Home = require("../models/home");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  console.log("session values :", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "Airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("favourites");
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  console.log("comming to fav", req.body);
  res.redirect("/favourites");
};
exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter((fav) => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};

exports.getBookings = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate("booking");
  res.render("store/bookings", {
    registeredHomes: user.booking,
    pageTitle: "My bookkings",
    currentPage: "booking",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postAddToBooking = async (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user) {
    return res.redirect("/login");
  }

  const homeId = req.body.id;
  const userId = req.session.user._id;

  try {
    const user = await User.findById(userId);
    if (!user.booking.includes(homeId)) {
      user.booking.push(homeId);
      await user.save();
    }
    console.log("coming to booking", req.body);
    res.redirect("/bookings");
  } catch (err) {
    console.error("Error while booking home:", err);
    res.status(500).send("Something went wrong while booking.");
  }
};

// exports.postAddToBooking = async (req, res, next) => {
//   const homeId = req.body.id;
//   const userId = req.session.user._id;
//   const user = await User.findById(userId);
//   if (!user.booking.includes(homeId)) {
//     user.booking.push(homeId);
//     await user.save();
//   }
//   console.log("comming to booking", req.body);
//   res.redirect("/bookings");
// };
