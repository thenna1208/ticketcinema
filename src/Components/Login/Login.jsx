import React, { useState } from 'react';
import './Login.css';
import Header from '../Header/Header';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';

const loginSchema = Yup.object().shape({
  username: Yup.string('Invalid username type')
    .required('Username is required!')
    .min(3, 'Name cannot be less than 3 characters')
    .max(30, 'Name is too long!'),
  password: Yup.string()
    .required('Password is required!')
    .min(6, 'Password needs to be a minimum of 6 characters')
    .max(15, 'Password is too long!'),
});

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
  
    const [initialFormValues, setInitialFormValues] = useState({
      username: '',
      password: '',
    });
  
    const handleSubmit = async (values, { resetForm }) => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/user/login/', values);
          console.log(response.data);
      
          // Update user context with the obtained access token
          login(response.data);
      
          // Your logic for handling successful login
          alert('Login Successful');
          resetForm({ values: '' });
          setInitialFormValues({
            username: '',
            password: '',
          });
          navigate('/');
        } catch (error) {
          console.error('Login failed:', error);
          alert("Username or Password is not correct. Try Again!")
          // Handle error, show error message to the user, etc.
        }
      };
  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className='SignupImage'>
              <img src='https://img.freepik.com/premium-vector/task-list-illustration_251005-474.jpg?w=900' alt='SignUp'></img>
            </div>
          </div>
          <div className="col-md-6 ">
            <h3>Login</h3>
            <hr></hr>
            <Formik validationSchema={loginSchema} initialValues={initialFormValues} onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                <Form className="loginform">
                  <div className="mb-5">
                    <Field
                      name="username"
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Your Username"
                    ></Field>
                    {errors.username && touched.username ? <div className='error'> {errors.username} </div> : null}
                  </div>
                  <div className="mb-5">
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Your Password"
                    ></Field>
                    {errors.password && touched.password ? <div className='error'> {errors.password} </div> : null}
                  </div>
                  <button
                    type='submit'
                    className="btn btn-dark float-start "
                  >
                    Login
                  </button>
                  <a
                    href='/signup'
                    type='button'
                    className="btn btn-link float-end "
                  >
                    <span className='account'>Didn't have an account?</span> <span className='signuphere'>Signup here</span>
                  </a>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
