import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import '../../styling/ForgotPassword.css';
import { FaKey } from 'react-icons/fa';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step tracker
  const [email, setEmail] = useState(''); // Store email for reset flow
  const [otpError, setOtpError] = useState(null); // OTP error messages
  const [otpSuccess, setOtpSuccess] = useState(null); // OTP success messages
  const [resetError, setResetError] = useState(null); // Reset password error messages
  const [passwordFocus, setPasswordFocus] = useState(false); // Track focus state for password field
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const specialChars = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

  const validatePassword = (password) => {
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password),
    });
  };

  // Step 1: Email submission
  const formikEmail = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://rihlatech-server.onrender.com/api/auth/send-reset-otp', {
          email: values.email,
        });
        setEmail(values.email); // Store email for OTP verification
        setOtpSuccess(response.data.message); // Show success message
        setOtpError(null); // Clear previous errors
        setStep(2); // Move to OTP verification step
      } catch (error) {
        setOtpError(error.response?.data?.message || 'Error sending OTP. Please try again.');
        setOtpSuccess(null); // Clear any previous success message
      }
    },
  });

  // Step 2: OTP verification
  const formikOtp = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://rihlatech-server.onrender.com/api/auth/verify-reset-otp', {
          email,
          otp: values.otp,
        });
        setOtpSuccess(response.data.message); // Show success message
        setOtpError(null); // Clear previous errors
        setStep(3); // Move to password reset
      } catch (error) {
        setOtpError(error.response?.data?.message || 'Invalid or expired OTP.');
      }
    },
  });

  // Step 3: Password reset
  const formikPassword = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('https://rihlatech-server.onrender.com/api/auth/reset-password', {
          email,
          password: values.password,
        });
        alert(response.data.message); // Show success message
        setResetError(null); // Clear errors
        setStep(1); // Reset to initial step
      } catch (error) {
        setResetError(error.response?.data?.message || 'Error resetting password. Please try again.');
      }
    },
  });

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 className="text-center">
          <FaKey /> Forgot Password
        </h2>

        {/* Step 1: Email Submission */}
        {step === 1 && (
          <Form onSubmit={formikEmail.handleSubmit}>
            <p className="text-center">Enter your registered email address to receive an OTP.</p>
            <FormGroup>
              <Label for="email"></Label>
              <Input
                type="email"
                id="email"
                {...formikEmail.getFieldProps('email')}
                placeholder="Enter your email"
              />
              {formikEmail.touched.email && formikEmail.errors.email && (
                <Alert color="danger" className="mt-2">
                  {formikEmail.errors.email}
                </Alert>
              )}
            </FormGroup>
            <Button color="warning" block type="submit">
              Send OTP
            </Button>
          </Form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <Form onSubmit={formikOtp.handleSubmit}>
            <p className="text-center">Enter the OTP sent to your email.</p>
            {otpError && <Alert color="danger">{otpError}</Alert>}
            {otpSuccess && <Alert color="success">{otpSuccess}</Alert>}
            <FormGroup>
              <Label for="otp">OTP</Label>
              <Input
                type="text"
                id="otp"
                {...formikOtp.getFieldProps('otp')}
                placeholder="Enter OTP"
              />
              {formikOtp.touched.otp && formikOtp.errors.otp && (
                <Alert color="danger" className="mt-2">
                  {formikOtp.errors.otp}
                </Alert>
              )}
            </FormGroup>
            <Button color="warning" block type="submit">
              Verify OTP
            </Button>
          </Form>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <Form onSubmit={formikPassword.handleSubmit}>
            <p className="text-center">Enter your new password below.</p>
            {resetError && <Alert color="danger">{resetError}</Alert>}
            <FormGroup>
              <Label for="password">New Password</Label>
              <Input
                type="password"
                id="password"
                {...formikPassword.getFieldProps('password')}
                placeholder="Enter new password"
                onFocus={() => setPasswordFocus(true)} // Show requirements on focus
                onBlur={() => setPasswordFocus(false)} // Hide requirements on blur
                onChange={(e) => {
                  formikPassword.handleChange(e);
                  validatePassword(e.target.value); // Dynamically validate password
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
              {formikPassword.touched.password && formikPassword.errors.password && (
                <Alert color="danger" className="mt-2">
                  {formikPassword.errors.password}
                </Alert>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                {...formikPassword.getFieldProps('confirmPassword')}
                placeholder="Confirm new password"
              />
              {formikPassword.touched.confirmPassword &&
                formikPassword.errors.confirmPassword && (
                  <Alert color="danger" className="mt-2">
                    {formikPassword.errors.confirmPassword}
                  </Alert>
                )}
            </FormGroup>
            <Button color="warning" block type="submit">
              Reset Password
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
