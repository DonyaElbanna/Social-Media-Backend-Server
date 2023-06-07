# Social Media Backend Server

## Description

This project is built using Express.js for the server and mongoose for the database. It contains role based authorization (admin and user) and authentication features, Error handling, implements CRUD operations for User, Post, Comment and Review models and uses mongodb aggregation pipelines to get the top rated posts by users.

## Technologies used

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [express-async-errors](https://www.npmjs.com/package/express-async-errors)
- [Joi](https://www.npmjs.com/package/joi)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [multer](https://www.npmjs.com/package/multer)
- [cloudinary](https://www.npmjs.com/package/cloudinary)
- [multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary)

## Available Scripts

In the project directory, you can run:

### `npm i`

install all dependencies.

### `nodemon .`

Launches the server at [http://localhost:9999](http://localhost:9999) and connects to the database.
[postman](https://www.postman.com/) was used for test cases.

## Project Structure

```md
.
├── config/
│ └── default.config.js
├── controllers/
│ ├── avatar.controller.js
│ ├── signup.controller.js
│ ├── login.controller.js
│ ├── user.controller.js
│ ├── post.controller.js
│ ├── comment.controllerjs
│ ├── review.controllerjs
│ └── topPosts.controllerjs
├── models/
│ ├── user.mdel.js
│ ├── post.model.js
│ ├── comment.model.js
│ └── review.model.js
├── routes/
│ ├── avatar.route.js
│ ├── signup.route.js
│ ├── login.route.js
│ ├── user.route.js
│ ├── post.route.js
│ ├── comment.route.js
│ ├── review.route.js
│ └── topPosts.route.js
├── utils/
│ ├── authentication.js
│ ├── Error.js
│ ├── tokenVerification.js
│ ├── namespace.util.js
│ ├── multer.js
│ └── cloudinary.js
├── .gitignore
├── db.js
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

## Routes

- Login: `POST` request at `/auth`

- Signup-add user: `POST` request at `/signup`

### User **(requires authorization)**

- get all users: `GET` request at `/user`
- get single user: `GET` request at `/user/:id`
- edit user (only creator): `PATCH` request at `/user/:id`
- delete user (only admin or creator): `DELETE` request at `/user/:id`

### Post **(requires authorization)**

- get all posts: `GET` request at `/post`
- get single post: `GET` request at `/post/:id`
- add post: `POST` request at `/post`
- edit post (only creator): `PATCH` request at `/post/:id`
- delete post (only admin or creator): `DELETE` request at `/post/:id`

### Comment **(requires authorization)**

- get all comments: `GET` request at `/comment`
- get single comment: `GET` request at `/post/:id/comment/:id`
- add comment: `POST` request at `/post/:id`
- edit comment (only creator): `PATCH` request at `/post/:id/comment/:id`
- delete comment (only admin or creator): `DELETE` request at `/post/:id/comment/:id`

### Review **(requires authorization)**

- get all reviews: `GET` request at `/post`
- get single review: `GET` request at `/post/:id`
- add review: `POST` request at `/post/:id/review`
- edit review (only creator): `PATCH` request at `/post/:id/review/:id`
- delete review (only admin or creator): `DELETE` request at `/post/:id/review/:id`
