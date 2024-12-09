import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, FormGroup, Input, Alert, Spinner, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../../styling/SignUp.css';
import axios from 'axios';
import supImage from '../../assets/ssd.jpg';

const SignUp = () => {
  const [otpModal, setOtpModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const toggleOtpModal = () => setOtpModal(!otpModal);

  const schar = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

  const validatePassword = (password) => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: new RegExp(`[${schar.replace(/[-[\]{}()*+?.,\\^$&]/g, '\\$&')}]`).test(password),
    });
  };


  

  const formikDetails = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
        .matches(/[a-z]/, 'Password must have at least one lowercase letter')
        .matches(/[0-9]/, 'Password must have at least one number')
        .matches(
          new RegExp(`[${schar.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`),
          'Password must have at least one special character'
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.post('https://rihlatech-server.onrender.com/api/auth/send-otp', values);
        setEmail(values.email);
        toggleOtpModal();
        alert(data.message);
      } catch (error) {
        setError(error.response?.data?.message || 'Server error');
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
          email, // Email from the state
          otp: values.otp, // OTP from form
          name: formikDetails.values.name, // Name from the form
          password: formikDetails.values.password, // Password from the form
        });
        alert(data.message);
        toggleOtpModal();
      } catch (error) {
        setOtpError(error.response?.data?.message || 'Invalid OTP');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Left Column */}
        <div className="signup-left" style={{ backgroundImage: `url(${supImage})` }}>
          <div className="signup-left-content">
            <h1>Take a Step Closer to Your Coding Dreams</h1>
            <p>Join a free learning platform designed to empower you on your journey to becoming a competitive programming expert.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="signup-right">
          <h2>Register</h2>
          <p>Prepare yourself for a future of opportunities in the world of competitive programming.</p>

          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={formikDetails.handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                id="name"
                {...formikDetails.getFieldProps('name')}
                placeholder="Name"
              />
              {formikDetails.touched.name && formikDetails.errors.name && (
                <div className="error">{formikDetails.errors.name}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Input
                type="email"
                id="email"
                {...formikDetails.getFieldProps('email')}
                placeholder="Email"
              />
              {formikDetails.touched.email && formikDetails.errors.email && (
                <div className="error">{formikDetails.errors.email}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Input
                type="password"
                id="password"
                {...formikDetails.getFieldProps('password')}
                placeholder="Password"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                onChange={(e) => {
                  formikDetails.handleChange(e);
                  validatePassword(e.target.value);
                }}
              />
              {passwordFocus && (
                <div className="password-requirements">
                  <p className={passwordChecks.length ? 'valid' : 'invalid'}>At least 8 characters</p>
                  <p className={passwordChecks.uppercase ? 'valid' : 'invalid'}>At least one uppercase letter</p>
                  <p className={passwordChecks.lowercase ? 'valid' : 'invalid'}>At least one lowercase letter</p>
                  <p className={passwordChecks.number ? 'valid' : 'invalid'}>At least one number</p>
                  <p className={passwordChecks.special ? 'valid' : 'invalid'}>At least one special character</p>
                </div>
              )}
            </FormGroup>

            <Button type="submit" color="warning" block disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Register'}
            </Button>
          </Form>

          <p className="footer-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal isOpen={otpModal} toggle={toggleOtpModal}>
        <ModalHeader toggle={toggleOtpModal}>Verify Your Account</ModalHeader>
        <ModalBody>
          <Form onSubmit={formikOtp.handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                id="otp"
                {...formikOtp.getFieldProps('otp')}
                placeholder="Enter OTP"
              />
              {formikOtp.touched.otp && formikOtp.errors.otp && (
                <Alert color="danger" className="mt-1">{formikOtp.errors.otp}</Alert>
              )}
            </FormGroup>

            {otpError && <Alert color="danger">{otpError}</Alert>}

            <Button type="submit" color="primary" block disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Verify OTP'}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SignUp;
