import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Alert, Button } from "reactstrap";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import "../../styling/UserCQ.css";

const UserCQ = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://rihlatech-server.onrender.com/api/questions?page=${currentPage}&limit=10`
        );
        if (response.data) {
          setQuestions(response.data.questions || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError("Invalid response structure from server.");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Container className="user-questions-page">
      <Row>
        <Col className="text-center">
          <h1 className="mt-3">Coding Questions</h1>
          <p>Explore our collection of coding challenges.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped className="questions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question._id}>
                  <th scope="row">{(currentPage - 1) * 10 + index + 1}</th>
                  <td>
                    <Link
                      to={`/my-learning/questions/${question._id}`} // Navigate to the details page
                      className="question-link"
                    >
                      {question.title}
                    </Link>
                  </td>
                  <td>{question.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        question.difficulty === "Easy"
                          ? "badge-success"
                          : question.difficulty === "Medium"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <div className="pagination-controls">
            <Button
              color="secondary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              color="secondary"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCQ;
