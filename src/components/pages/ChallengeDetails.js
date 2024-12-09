import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "reactstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styling/ChallengeDetails.css";

const ChallengeDetails = () => {
  const { id } = useParams(); // Get the challenge ID from the URL
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`https://rihlatech-server.onrender.com/api/questions/${id}`);
        setChallenge(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch challenge details");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Container className="challenge-details-page">
      <Row>
        <Col>
          <h1>{challenge.title}</h1>
          <p><strong>Category:</strong> {challenge.category}</p>
          <p><strong>Difficulty:</strong> {challenge.difficulty}</p>
          <p><strong>Description:</strong></p>
          <p>{challenge.description}</p>
          <p><strong>Input Format:</strong></p>
          <p>{challenge.inputFormat}</p>
          <p><strong>Output Format:</strong></p>
          <p>{challenge.outputFormat}</p>
          <p><strong>Sample Input:</strong></p>
          <pre>{challenge.sampleInput}</pre>
          <p><strong>Sample Output:</strong></p>
          <pre>{challenge.sampleOutput}</pre>
        </Col>
      </Row>
    </Container>
  );
};

export default ChallengeDetails;
