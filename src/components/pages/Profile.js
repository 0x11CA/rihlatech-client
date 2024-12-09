import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";
import "../../styling/Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const response = await axios.get("https://rihlatech-server.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name, email, profileImage } = response.data;

        setProfileData(response.data);
        setUpdatedName(name);
        setUpdatedEmail(email);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validatePassword = (password) => {
    const specialChars = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password),
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (file) formData.append("profileImage", file);
    formData.append("name", updatedName);
    formData.append("email", updatedEmail);

    try {
      const response = await axios.post(
        "https://rihlatech-server.onrender.com/api/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      setProfileData({
        ...profileData,
        name: updatedName,
        email: updatedEmail,
        profileImage: response.data.profileImage || profileData.profileImage,
      });
      setFile(null); // Reset file input after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://rihlatech-server.onrender.com/api/auth/reset-password-profile",
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setShowPasswordFields(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert(error.response?.data?.message || "Failed to reset password.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Alert color="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <Card>
            <CardBody>
              <h2 className="mb-4 text-center">Profile Information</h2>
              <Form onSubmit={handleUpdateProfile}>
                {/* Profile Image */}
                <div className="text-center">
                  <img
                    src={profileData.profileImage || "default-profile.png"} // Default image if no profile image exists
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                </div>
                <FormGroup>
                  <Label for="profileImage">Profile Image</Label>
                  <Input type="file" id="profileImage" onChange={handleFileChange} accept="image/*" />
                </FormGroup>

                {/* Name */}
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </FormGroup>

                {/* Email */}
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormGroup>

                <Button
  className="btn-action"
  type="submit"
  color="primary"
  block
>
  Update Profile
</Button>
              </Form>
              <hr />
              <Button
  className="btn-action"
  color="danger"
  block
  onClick={() => setShowPasswordFields(!showPasswordFields)}
>
  Reset Password
</Button>

              {showPasswordFields && (
                <Form onSubmit={handleResetPassword} className="mt-3">
                  {/* Old Password */}
                  <FormGroup>
                    <Label for="oldPassword">Old Password</Label>
                    <Input
                      type="password"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your old password"
                      required
                    />
                  </FormGroup>

                  {/* New Password */}
                  <FormGroup>
                    <Label for="newPassword">New Password</Label>
                    <Input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        validatePassword(e.target.value);
                      }}
                      placeholder="Enter your new password"
                      required
                    />
                    <div className="password-requirements mt-2">
                      <p className={passwordChecks.length ? "text-success" : ""}>
                        At least 8 characters
                      </p>
                      <p className={passwordChecks.uppercase ? "text-success" : ""}>
                        At least one uppercase letter
                      </p>
                      <p className={passwordChecks.lowercase ? "text-success" : ""}>
                        At least one lowercase letter
                      </p>
                      <p className={passwordChecks.number ? "text-success" : ""}>
                        At least one number
                      </p>
                      <p className={passwordChecks.special ? "text-success" : ""}>
                        At least one special character
                      </p>
                    </div>
                  </FormGroup>

                  <Button
                    type="submit"
                    color="success"
                    block
                    disabled={
                      !passwordChecks.length ||
                      !passwordChecks.uppercase ||
                      !passwordChecks.lowercase ||
                      !passwordChecks.number ||
                      !passwordChecks.special
                    }
                  >
                    Update Password
                  </Button>
                </Form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
