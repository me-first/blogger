const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required to create blog'],
    },
    about: {
      type: String,
      trim: true,
      required: [true, 'Give detail about your blog post'],
    },
    image: String,
    blogType: {
      type: String,
      enum: [
        'mern',
        'technology',
        'sports',
        'entertainment',
        'fiction',
        'ui-ux',
      ],
      required: [true, 'Must include type of blog post'],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  if (this.blogType === 'mern' && !this.image)
    this.image =
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635677088/itx2fgojhrrwqtgwborr.jpg';
  if (this.blogType === 'ui-ux' && !this.image)
    this.image =
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635677314/uxst9a9bgn8wr4j8nprx.png';
  if (this.blogType === 'technology' && !this.image)
    this.image =
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635677375/wy9mhe7yal1kbaoseuet.jpg';
  if (this.blogType === 'fiction' && !this.image)
    this.image =
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635677326/y6oy7ouhorm1gjeiajsk.png';
  if (this.blogType === 'sports' && !this.image)
    this.image =
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635677355/exhrbqhhbzglybk3erue.jpg';
  if (this.blogType === 'entertainment' && !this.image)
    this.image =
      'https://res.cloudinary.com/ds9vpuvdm/image/upload/v1635677338/ivreofkktize47cdsc8c.png';

  next();
});

blogSchema.pre(/^find/, function (next) {
  this.find().populate({ path: 'author', select: 'name' });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
