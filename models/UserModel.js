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
Here, this refers to the current Mongoose document (the user).
The .toObject() method converts the Mongoose document into a plain JavaScript object, stripping away Mongoose-specific properties and methods.
This makes it easier to manipulate.
toJSON() is a built-in convention in JavaScript for customizing JSON serialization.
Mongoose allows you to override this on your schema’s documents by defining UserSchema.methods.toJSON.
Whenever you do JSON.stringify(user) or res.json(user), your custom toJSON() method runs automatically.
*/
UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('UserModel', UserSchema);
