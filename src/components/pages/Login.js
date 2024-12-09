import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import '../../styling/Login.css';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpModal, setOtpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [otpError, setOtpError] = useState(null);

  const toggleOtpModal = () => setOtpModal(!otpModal);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.post('https://rihlatech-server.onrender.com/api/auth/login', values);

        // If user is not verified, show OTP modal
        if (!data.isVerified) {
          setEmail(values.email);
          toggleOtpModal();
        } else {
          // Save token and role in localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);

          // Navigate based on role
          if (data.role === 'admin') {
            navigate('/adminmain');
          } else {
            navigate('/home');
          }
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const formikOtp = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setOtpError(null);

      try {
        const { data } = await axios.post('https://rihlatech-server.onrender.com/api/auth/verify-otp', {
          email,
          otp: values.otp,
        });

        alert(data.message);
        toggleOtpModal(); // Close OTP modal

        // Save token and role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        // Navigate based on role
        if (data.role === 'admin') {
          navigate('/adminmain');
        } else {
          navigate('/home');
        }
      } catch (error) {
        setOtpError(error.response?.data?.message || 'Invalid or expired OTP.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-left">
          <div className="auth-left-content">
            <h1>Welcome Back to Your Coding Journey</h1>
            <p>
              Continue sharpening your problem-solving skills and conquer the world of competitive
              programming!
            </p>
          </div>
        </div>

        <div className="auth-right">
          <h2 className="mb-4">
            <FaLock /> Login
          </h2>

          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="email">
                <FaEnvelope /> Email
              </Label>
              <Input
                type="email"
                id="email"
                {...formik.getFieldProps('email')}
                placeholder="Enter your email"
                invalid={formik.touched.email && !!formik.errors.email}
              />
              {formik.touched.email && formik.errors.email && (
                <Alert color="danger" className="mt-1">
                  {formik.errors.email}
                </Alert>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="password">
                <FaLock /> Password
              </Label>
              <Input
                type="password"
                id="password"
                {...formik.getFieldProps('password')}
                placeholder="Enter your password"
                invalid={formik.touched.password && !!formik.errors.password}
              />
              {formik.touched.password && formik.errors.password && (
                <Alert color="danger" className="mt-1">
                  {formik.errors.password}
                </Alert>
              )}
            </FormGroup>

            <Button color="warning" block className="mt-3" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : <><FaSignInAlt /> Login</>}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-muted">
              Forgot Password?
            </Link>
            <p className="mt-2">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={otpModal} toggle={toggleOtpModal}>
        <ModalHeader toggle={toggleOtpModal}>Verify Your Account</ModalHeader>
        <ModalBody>
          <Form onSubmit={formikOtp.handleSubmit}>
            <FormGroup>
              <Label for="otp">Enter OTP</Label>
              <Input
                type="text"
                id="otp"
                {...formikOtp.getFieldProps('otp')}
                placeholder="Enter the OTP sent to your email"
                invalid={formikOtp.touched.otp && !!formikOtp.errors.otp}
              />
              {formikOtp.touched.otp && formikOtp.errors.otp && (
                <Alert color="danger">{formikOtp.errors.otp}</Alert>
              )}
            </FormGroup>

            {otpError && <Alert color="danger">{otpError}</Alert>}

            <Button color="primary" block className="mt-3" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Verify OTP'}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Login;
