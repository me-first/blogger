const mongoose = require('mongoose');
const Blog = require('./blogModel');

const likeSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: 'Blog',
      required: [true, 'Like must belong to blog'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'like must be created by user'],
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ blog: 1, user: 1 }, { unique: true });

likeSchema.statics.calcLikes = async function (blogId) {
  const stats = await this.aggregate([
    {
      $match: { blog: blogId },
    },
    {
      $group: {
        _id: null,
        numOfLikes: { $sum: 1 },
      },
    },
  ]);

  await Blog.findByIdAndUpdate(blogId, {
    likes: stats[0]?.numOfLikes || 0,
  });
};

likeSchema.post('save', async function (docs, next) {
  await this.constructor.calcLikes(docs.blog);
});

//WORK ON DELETE LIKE
// likeSchema.post(/^findOne/, async function (docs, next) {
//   console.log(docs, this);
//   await this.constructor.calcLikes(this.blog);
//   next();
// });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
