import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true},
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        // 使用正则表达式验证密码复杂度
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
      },
      message: "Password must be at least 8 characters long, include a letter, a number, and a special character."
    }
  }
});

export default mongoose.model('User', UserSchema);