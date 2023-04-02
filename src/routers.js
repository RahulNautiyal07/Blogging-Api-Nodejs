const express = require('express');
const router = express.Router();
const usersRouters = require('./modules/users/usersController');
const todosRouters = require('./modules/todos/todosController');
const postsRouters = require('./modules/posts/postsController');
const commentsRouters = require('./modules/comments/commentsController');

router.use('/users',usersRouters);
router.use('/todos',todosRouters);
router.use('/posts',postsRouters);
router.use('/comments',commentsRouters);


module.exports = router;

