import { Schema, model } from 'mongoose';

//create userschema
const userSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:[true,"Email Already Exists"],
    },
    password:{
        type:String,
        required: true
    },
    todos:[
        {
            taskName: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            status :{
                type:String,
                default:"pending",
            }
        }
    ]

}, {
    versionKey:false,
    strict:true,
    timestamps:true,
    }
)

export const UserModel = model("user",userSchema);