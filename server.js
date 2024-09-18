import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import nocache from "nocache";
const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(nocache());

app.set("view engine", "ejs");
app.use(express.static("public"));

function dbConfig() {
  return {
    user: "postgres",
    host: "localhost",
    database: "NEWSNetwork",
    password: "root1234",
    port: 5432,
  };
}

let isLoggedIn = false;

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/news", (req, res) => {
  if (isLoggedIn) {
    res.render("news.ejs");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login-signup.ejs");
});

app.post("/login", async (req, res) => {
  const db = new pg.Client(dbConfig());
  db.connect();
  const email = req.body.email;
  const password = req.body.password;

  const result = await db.query("SELECT email,password FROM user_details");
  // console.log(result)

  if (email && password) {
    let check = result.rows.find(
      (user) => email == user.email && password == user.password
    );

    if (check) {
      isLoggedIn = true;
      res.redirect("/news");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }

  db.end();
});

app.post("/new_user", async (req, res) => {
  const db = new pg.Client(dbConfig());
  db.connect();

  if (req.body.fname != "" && req.body.email != "" && req.body.password != "") {
    const fname = req.body.fname;
    const email = req.body.email;
    const password = req.body.password;
    await db.query(
      "INSERT INTO user_details (name, email, password) VALUES ($1, $2, $3)",
      [fname, email, password]
    );
  }
  isLoggedIn = false;
  res.redirect("/login");
  db.end();
});

app.post("/logout", (req, res) => {
  isLoggedIn = false;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`server is listning on http://localhost:${PORT}`);
});
