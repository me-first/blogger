const mongoose = require('mongoose');
const Blog = require('./blogModel');

const commentSchema = new mongoose.Schema(
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
    comment: {
      type: String,
      trim: true,
      required: [true, 'comment must belong to blog'],
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.statics.calcComments = async function (blogId) {
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
    comments: stats[0]?.numOfLikes,
  });
};

commentSchema.post('save', async function (docs, next) {
  await this.constructor.calcComments(docs.blog);
});
commentSchema.post(/^findOneAnd/, async function (docs, next) {
  await docs.constructor.calcComments(docs.blog);
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
