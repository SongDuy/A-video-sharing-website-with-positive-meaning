const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(express.json());
app.use(cors());

const { get, set, ref, child } = require('firebase/database');
const { database } = require('./src/models/database');
const dbRef = ref(database);

//const authenticateToken = require('./src/middlewares/auth')
// const adminenticateToken = require('./src/middlewares/admin')
// const staffenticateToken = require('./src/middlewares/staff')

const authRouter = require('./src/routes/auth.router');
const staffRouter = require('./src/routes/staff.router');
const adminRouter = require('./src/routes/admin.router');
const VideoRouter = require('./src/routes/video.router');
const CategoryRouter = require('./src/routes/category.router');
const FavoriteRouter = require('./src/routes/favorite.router');
const FollowRouter = require('./src/routes/follow.router');
const CommentRouter = require('./src/routes/comment.router');

//authRouter.use(authenticateToken)
// staffRouter.use(staffenticateToken)
// adminRouter.use(adminenticateToken)

app.use('/api', authRouter);
app.use('/api', staffRouter);
app.use('/api', adminRouter);
app.use('/api', VideoRouter);
app.use('/api', CategoryRouter);
app.use('/api', FavoriteRouter);
app.use('/api', FollowRouter);
app.use('/api', CommentRouter);

get(child(dbRef, `users`)).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});

app.get('/', (req, res) => {
  res.send('home');
});

app.listen(port, () => {
  console.log(`Server đang chạy`)
});
