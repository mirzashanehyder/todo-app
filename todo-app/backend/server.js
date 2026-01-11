// create server
import express from 'express';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import { userRoute } from './APIs/userAPI.js';
import cors from 'cors';
import { UserModel } from './models/userModel.js';
import { verifyToken } from './middleware/verifyToken.js';

const app = express();


//enable cors
app.use(cors({origin:["http://localhost:5173"],credentials:true}))

app.use(express.json());
app.use(cookieParser());

app.use('/user-api',userRoute);

//connect to db
async function connectDBAndStartServer() {
    try{

        await connect('mongodb+srv://shanehyder:<Pvpsit786>@cluster0.smevrw8.mongodb.net/?appName=Cluster0/pvptododb/pvptododb')
        console.log("DB connected")

        app.listen(8000,console.log("Server listening on port 8000"));

    } catch(err) {

        console.log("Err in connection with DB",err)

    }
}

connectDBAndStartServer();

//page refresh route
app.get('/refresh', verifyToken, async(req,res) => {
    console.log('user is',req.user)
    let userObj = await UserModel.findOne({email:req.user.email});
    res.status( 200 ).json( { message:"user", payload:userObj } );
})

