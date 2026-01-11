import {useForm} from 'react-hook-form'
import '../App.css'
import   axios   from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { GrLogin } from "react-icons/gr";


function Register(){

    const navigate = useNavigate()
    const{register,handleSubmit,formState:{errors},}=useForm();
    let [registerErr,setRegisterErr] = useState("");

    async function onFormSubmit(newUser){
        newUser.todos = [];
        console.log(newUser);
        try {
            //Make HTTP POST req tio create new User in Backend
            let res = await axios.post("http://localhost:8000/user-api/user", newUser);
            console.log("res is ", res);
            //if resourse is created
            if (res.status === 201) {
                //naviagte to login component programatically
                navigate("/login");
            } else {
                //display error message
                console.log(res);
            }
        } catch (err) {
            console.log("err is ", err.response.data.message);
            setRegisterErr(err.response.data.message);
        }
    }
    return(
        <div className=' user-profile register-bg'>
            <h1 className='text-center text-info'>User Registration</h1>
            {/* Display Error message */}
            {registerErr.length !== 0 && <p className="fs-3 text-warning text-center">{registerErr}</p>}
            <form className='w-50 mx-auto mt-4 create-task-container' onSubmit={handleSubmit(onFormSubmit)}>
                {/*user name*/}
                <input type="text   " {...register("name",{required:true,minLength:4,maxLength:10})} className='form-control mb-3' placeholder=' Enter Username'></input>
                {errors?.name?.type == "required" && <p className="text-danger">Username required</p>}
                {errors?.name?.type == "minLength" && <p className="text-danger">Min length should be 5</p>}
                {errors?.name?.type == "maxLength" && <p className="text-danger">Max length should beless than 8</p>}
                {/*email*/}
                <input type="email" {...register("email", { required: true })}className="form-control mb-3" placeholder="Email"/>
                {errors?.email?.type == "required" && <p className="text-danger">Email required</p>}
                {/* password */}
                <input type="password" {...register("password", { required: true })} className="form-control mb-3" placeholder="Password"/>
                {errors?.password?.type == "required" && <p className="text-danger">Password required</p>}
                {/* submit button */}
                <button type="submit" className="btn btn-success sub-btn">Register <GrLogin /></button>
            </form>
        </div>
    );
}
export default Register;