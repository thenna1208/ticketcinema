import React, { useState } from 'react'
import './Signup.css'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';


const SignupSchema = Yup.object().shape({
    name: Yup.string('Invalid name type')
        .required('name is required!')
        .min(3, 'Name cannot be less than 3 characters')
        .max(30, 'Name is too long!'),

    username: Yup.string('Invalid username type')
        .required('username is required!')
        .min(3, 'Name cannot be less than 3 characters')
        .max(30, 'Name is too long!'),

    email: Yup.string('Invalid email type')
        .email('Invalid email type!')
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address')
        .required('Email is required!'),

    password: Yup.string()
        .required('Password is required!')
        .min(6, 'Password needs to be a minimum of 6 characters')
        .max(15, 'Password is too long!'),
    cnfpassword: Yup.string()
        .required('Password is required!')
        .min(6, 'Password needs to be a minimum of 6 characters')
        .max(15, 'Password is too long!')
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.password === value;
        }),

})
function SignUp() {
    const navigate = useNavigate()
    const [initialFormValues, setInitialFormValues] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        cnfpassword: ''
    })

    const handlesubmit = async (values, { resetForm }) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/user/signup/', values);
            console.log(response.data);
      
            // Your logic for handling successful signup (e.g., redirect to login page)
            alert('Successfully Registered');
            resetForm({ values: '' });
            setInitialFormValues({
              firstname: '',
              lastname: '',
              email: '',
              password: '',
              cnfpassword: '',
            });
            navigate('/login');
          } catch (error) {
            console.error('Signup failed:', error);
            // Handle error, show error message to the user, etc.
          }
    }
    return (
        <div>
            <Header/>
            <div className="container">

                <div className="row">
                    <div className="col-md-6">
                        <div className='SignupImage'>
                            <img src='https://img.freepik.com/free-vector/forms-concept-illustration_114360-4917.jpg?w=826&t=st=1682364206~exp=1682364806~hmac=813192048a8c2202252f44e07a7b14b99673938bd89e45b7ee66eef1aa8c88fc' alt='SignUp'></img>

                        </div>
                    </div>
                    <div className="col-md-6">
                        <h3>Sign Up</h3>
                        <hr></hr>

                        <Formik validationSchema={SignupSchema} initialValues={initialFormValues} onSubmit={handlesubmit}>
                            {({ errors, touched }) => {
                                return (
                                    <Form className="signupform">
                                        <div className="row mb-4">
                                            <div className="form-group col-md-6">

                                                <Field name="name" type="text" className="form-control" id="name" placeholder="Name"></Field>
                                                {errors.name && touched.name ? <div className='error'> {errors.name} </div> : null}
                                            </div>
                                            <div className="form-group col-md-6">

                                                <Field name="username" type="text" className="form-control" id="username" placeholder="Username"></Field>
                                                {errors.username && touched.username ? <div className='error'> {errors.username} </div> : null}
                                            </div>
                                        </div>

                                        <div className="mb-4">

                                            <Field
                                                name="email"
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="Your email"

                                            ></Field>
                                            {errors.email && touched.email ? <div className='error'> {errors.email} </div> : null}
                                        </div>
                                        <div className="mb-4">

                                            <Field
                                                name="password"
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Your password"
                                            ></Field>
                                            {errors.password && touched.password ? <div className='error'> {errors.password} </div> : null}
                                        </div>
                                        <div className="mb-4">

                                            <Field
                                                name="cnfpassword"
                                                type="password"
                                                className="form-control"
                                                id="cnfpassword"
                                                placeholder="Confirm Password"
                                            ></Field>
                                            {errors.cnfpassword && touched.cnfpassword ? <div className='error'> {errors.cnfpassword} </div> : null}
                                        </div>

                                        <button
                                            
                                            type='submit'
                                            className="btn btn-dark float-start "
                                        >
                                            Sign Up
                                        </button>
                                        <a
                                            href='/login'
                                            type='button'
                                            className="btn btn-link float-end login-link "
                                        >
                                            Already a Member
                                        </a>
                                    </Form>
                                )
                            }}
                        </Formik>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
