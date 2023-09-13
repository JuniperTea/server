import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  //it will decide if you are authenticated
  let token = req.headers.token;
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.headers["userID"] = decoded._id;
    next(); //this makes sure the app moves forward, from here will be to notesrouter as per app.use("/", authenticate, notesRouter);
  } catch {
    res.json({
      status: false,
      message: "Unauthorized",
    });
  }
}
