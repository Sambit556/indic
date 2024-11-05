const mongose = require("mongoose");
const { Schema, model } = mongose;

const UserSchema = new Schema(
     {
          emailID: {
               type: String,
               required: true,
               unique: true,
          },
          password: {
               type: String,
               required: true,
          },
          otp: {
               type: String,
          }
     },

     {
          timestamps: true
     }
)

const User = model("User", UserSchema)
module.exports = User;
