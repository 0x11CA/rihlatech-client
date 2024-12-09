import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import "../../styling/Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Easy",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("https://rihlatech-server.onrender.com/api/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = async () => {
    try {
      setLoading(true);
      await axios.post("https://rihlatech-server.onrender.com/api/questions", newQuestion);
      setShowAddModal(false);
      setNewQuestion({
        title: "",
        description: "",
        category: "",
        difficulty: "Easy",
      });
      fetchQuestions(); // Refresh questions list
    } catch (error) {
      console.error("Error adding question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeManagement = () => {
    navigate("/admin/challenges");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-brand">RihlaTech | رحلتك</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin/courses")}>Course Management</li>
          <li onClick={handleChallengeManagement}>Challenge Management</li>
          <li>Notifications</li>
          <li>Settings</li>
          <li>Help & Support</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Challenge Management</h2>
          <Button color="primary" onClick={() => setShowAddModal(true)}>
            Add Question
          </Button>
        </header>

        <Card className="course-card">
          <CardBody>
            {questions.length > 0 ? (
              <Table borderless>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td>{question.title}</td>
                      <td>{question.category}</td>
                      <td>{question.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>No questions available. Add some to get started!</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Add Question Modal */}
      <Modal isOpen={showAddModal} toggle={() => setShowAddModal(!showAddModal)}>
        <ModalHeader toggle={() => setShowAddModal(!showAddModal)}>
          Add New Question
        </ModalHeader>
        <ModalBody>
          <Label for="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={newQuestion.title}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, title: e.target.value })
            }
            placeholder="Enter question title"
          />
          <Label for="description" className="mt-3">
            Description
          </Label>
          <Input
            id="description"
            type="textarea"
            value={newQuestion.description}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, description: e.target.value })
            }
            placeholder="Enter question description"
          />
          <Label for="category" className="mt-3">
            Category
          </Label>
          <Input
            id="category"
            type="text"
            value={newQuestion.category}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, category: e.target.value })
            }
            placeholder="Enter question category"
          />
          <Label for="difficulty" className="mt-3">
            Difficulty
          </Label>
          <Input
            id="difficulty"
            type="select"
            value={newQuestion.difficulty}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, difficulty: e.target.value })
            }
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddQuestion} disabled={loading}>
            {loading ? "Adding..." : "Add Question"}
          </Button>
          <Button
            color="secondary"
            onClick={() => setShowAddModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Dashboard;
