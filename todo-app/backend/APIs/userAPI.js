import express from 'express';
import { UserModel } from '../models/userModel.js';
import {compare, hash} from 'bcryptjs'
import jwt from 'jsonwebtoken';

const { sign } = jwt;
export const userRoute = express.Router()

// Define API routes

//Route for User ServiceWorkerRegistration
userRoute.post('/user', async(req,res) => {

    try {

        let userData = req.body;
        //hash password
        let hashPassword = await hash(userData.password,12);
        // assign hashed password
        userData.password = hashPassword;
        //create new user doc
        let newUserDoc = new UserModel(userData);
        //save in DB
        await newUserDoc.save();
        //send res
        res.status(201).json({message:"User Created"})
        
    } catch(err) {
        res.status(400).json({message:err.message,reason:err.message});
    }

})

//route for User authentication (Login)

userRoute.post('/login', async (req, res) => {
    try {
        // get user cred obj
        let credObj = req.body;
        //check email
        let userInDB = await UserModel.findOne({ email: credObj.email });
        //if user not exists
        if (userInDB === null) {
            res.status(404).json({ message: "User Does't Exists" });
        } else {
            //compare passwords
            let isEqual = await compare(credObj.password, userInDB.password)
            if (isEqual === false) {
                res.status(404).json({  message: "Invalid Password" });
            } else {
                // generate token
                let encodedToken = sign({ email: credObj.email },
                    'abcdef',
                    { expiresIn: "1hr" }
                );

                res.cookie("token", encodedToken, {

                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                }
                )
            }
            res.status(200).json({ message: "token created",payload: userInDB })
        }
    } catch (err) {
        res.status(400).json({ message: "Error occurred" })
    }
})

userRoute.put('/todo/:userid', async (req,res) => {
    //get data to insert
    let newTask = req.body;
    //get user id
    let uid = req.params.userid;
    //put task in todos array
    let updatedData = await UserModel.findOneAndUpdate({_id:uid},{$push:{todos:newTask}},{new : true});
    // send res
    res.status(200).json({message:"todo added",payload:updatedData});
})

userRoute.put(
    "/edit-todo/userid/:userid/taskid/:taskid",
    async (req, res) => {
      try {
        const { userid, taskid } = req.params;
        const modifiedData = req.body;
  
        // update task and return updated user
        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: userid, "todos._id": taskid },
          {
            $set: {
              "todos.$.taskName": modifiedData.taskName,
              "todos.$.description": modifiedData.description,
              "todos.$.status": modifiedData.status || "pending"
            }
          },
          { new: true } 
        );
  
        
        res.status(200).json({
          message: "Task updated",
          payload: updatedUser
        });
  
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
      }
    }
  );
  
//set task as complete
userRoute.put('/edit-status/userid/:userid/taskid/:taskid', async (req,res)=> {
    try {
        let { userid , taskid} = req.params;
        // get modified data
        let modifiedData = req.body;
        //update task
        let userWithModifiedTask = await UserModel.findOneAndUpdate({ _id: userid, "todos._id": taskid }, { $set:{
            "todos.$.status":"completed"
        }} , { new: true })

        res.status(200).json({message:"Task Completed",payload:userWithModifiedTask})
    } catch(err) {

    }
})

//delete a task
//delete a task
userRoute.put('/delete-todo/userid/:userid/taskid/:taskid', async (req,res)=> {
    try {
        let { userid , taskid} = req.params;
        let userWithModifiedTask = await UserModel.findOneAndUpdate(
            { _id: userid },
            { $pull : { todos: { _id : taskid } } },
            { new : true }
        )

        res.status(200).json({
            message:"Task deleted",
            payload: userWithModifiedTask   
        })
    } catch(err) {
        res.status(404).json({message:"Error Occurred"});
    }
})

//logout user
userRoute.get('/logout',(req,res) => {
    res.clearCookie("token",{
        httpOnly:true,
        sameSite : "none",
        secure:true
    });
    
    res.status(200).json({message:"logout success"});
})