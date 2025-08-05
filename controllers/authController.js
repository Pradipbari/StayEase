const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["User does not exist"],
      oldInput: { email },
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Invalid password"],
      oldInput: { email },
      user: {},
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};
exports.postLogOut = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "Signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "",
    },
    user: {},
  });
};
exports.postSignup = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Firstname should be atleast 2 characters long")
    .matches(/^[A-Za-zs]+$/)
    .withMessage("Firstname should contain only alphabets"),
  check("lastName")
    .matches(/^[A-Za-zs]*$/)
    .withMessage("Lastname should contain alphabets only"),
  check("email").isEmail().withMessage("Enter valid email").normalizeEmail(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should atleast 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password should contain atleast one capital letter")
    .matches(/[a-z]/)
    .withMessage("Password should contain atleast one small letter")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one digit")
    .matches(/[~!@#$%^&*()<>?/]/)
    .withMessage("Password should contain atleast one special character")
    .trim(),

  //Confirm password validation
  check("confirmPassword").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Password does not match");
    }
    return true;
  }),

  check("userType")
    .notEmpty()
    .withMessage("Select user type")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("terms")
    .notEmpty()
    .withMessage("Please accept terms and conditions")
    .custom((value, { req }) => {
      if (value != "on") {
        throw new Error("Please accept terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "Signup",
        currentPage: "signup",
        isLoggedIn: false,
        errors: errors.array().map((err) => err.msg),
        oldInput: { firstName, lastName, email, password, userType },
        user: {},
      });
    }
    bcrypt
      .hash(password, 12)
      .then((hashPassword) => {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashPassword,
          userType,
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        let errorMsg = "Something went wrong. Please try again.";

        if (err.code === 11000 && err.keyPattern?.email) {
          errorMsg = "Email already exists. Please login or use another email.";
        }

        return res.status(422).render("auth/signup", {
          pageTitle: "Signup",
          currentPage: "signup",
          isLoggedIn: false,
          errors: [errorMsg],
          oldInput: { firstName, lastName, email, password, userType },
          user: {},
        });
      });
  },
];
