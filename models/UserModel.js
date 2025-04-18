import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: 'My city',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

/*
When you define UserSchema.methods.toJSON, you're overriding the default behavior of how the object is turned into JSON.
JavaScript calls .toJSON() automatically when an object is being stringified (e.g. JSON.stringify(user) or res.json(user) in Express).
When sending data as JSON (e.g., in an API response), you want a plain object without Mongoose-specific properties.
*/
UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('UserModel', UserSchema);
