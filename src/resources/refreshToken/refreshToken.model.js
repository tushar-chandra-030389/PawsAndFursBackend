import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  expiryTimestamp: {
    type: Number,
    required: true,
  },
});

refreshTokenSchema.pre('validate', async function (next) {
  const nowTimestamp = Date.now();
  const expiryTimestamp = nowTimestamp + 60 * 24 * 60 * 60;

  this.expiryTimestamp = expiryTimestamp;

  next();
});

refreshTokenSchema.pre('save', async function (next) {
  const model = this.model('refreshToken');
  await model.deleteMany({
    userId: this.userId,
  });

  next();
});

export const RefreshTokenModel = mongoose.model(
  'refreshToken',
  refreshTokenSchema
);
