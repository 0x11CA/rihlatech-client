import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Alert,
} from "reactstrap";
import axios from "axios";
import "../../styling/Challenges.css";

const Challenges = () => {
  const [questions, setQuestions] = useState([]); // Holds fetched questions
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [modalOpen, setModalOpen] = useState(false); // Modal open/close state
  const [editQuestion, setEditQuestion] = useState(null); // Question being edited
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Easy",
    inputFormat: "",
    outputFormat: "",
    sampleInput: "",
    sampleOutput: "",
    tags: "",
    testCases: [{ input: "", output: "" }], // Initial empty test case
  });

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("https://rihlatech-server.onrender.com/api/questions", {
          params: { page: 1, limit: 10 },
        });
        setQuestions(response.data.questions || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Toggles the modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) resetForm(); // Reset form when closing the modal
  };

  // Resets the form fields
  const resetForm = () => {
    setNewQuestion({
      title: "",
      description: "",
      category: "",
      difficulty: "Easy",
      inputFormat: "",
      outputFormat: "",
      sampleInput: "",
      sampleOutput: "",
      tags: "",
      testCases: [{ input: "", output: "" }],
    });
    setEditQuestion(null);
  };

  // Handles form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  // Handles test case input changes
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = newQuestion.testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setNewQuestion((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  // Adds a new test case
  const handleAddTestCase = () => {
    setNewQuestion((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "" }],
    }));
  };

  // Removes a test case
  const handleRemoveTestCase = (index) => {
    setNewQuestion((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  // Adds a new question
  const handleAddQuestion = async () => {
    const { title, description, category, difficulty, inputFormat, outputFormat, sampleInput, sampleOutput } = newQuestion;

    if (!title || !description || !category || !difficulty || !inputFormat || !outputFormat || !sampleInput || !sampleOutput) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("https://rihlatech-server.onrender.com/api/questions", newQuestion);
      setQuestions((prev) => [...prev, response.data.question]);
      toggleModal();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add question.");
    }
  };

  // Fetches data for editing a specific question
  const handleEditClick = async (questionId) => {
    try {
      const response = await axios.get(`https://rihlatech-server.onrender.com/api/questions/${questionId}`);
      const question = response.data;

      setEditQuestion(question);
      setNewQuestion({
        title: question.title || "",
        description: question.description || "",
        category: question.category || "",
        difficulty: question.difficulty || "Easy",
        inputFormat: question.inputFormat || "",
        outputFormat: question.outputFormat || "",
        sampleInput: question.sampleInput || "",
        sampleOutput: question.sampleOutput || "",
        tags: question.tags?.join(", ") || "",
        testCases: question.testCases || [{ input: "", output: "" }],
      });

      setModalOpen(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch question details.");
    }
  };

  // Saves changes to an edited question
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `https://rihlatech-server.onrender.com/api/questions/${editQuestion._id}`,
        newQuestion
      );
      setQuestions((prev) =>
        prev.map((q) => (q._id === editQuestion._id ? response.data.question : q))
      );
      toggleModal();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update question.");
    }
  };

  // Deletes a question
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axios.delete(`https://rihlatech-server.onrender.com/api/questions/${id}`);
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete question.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Challenge Management</h1>
          <Button color="primary" onClick={toggleModal}>
            Add Question
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question._id || index}>
                  <td>{index + 1}</td>
                  <td>{question.title}</td>
                  <td>{question.category}</td>
                  <td>{question.difficulty}</td>
                  <td>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => handleEditClick(question._id)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(question._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editQuestion ? "Edit Question" : "Add Question"}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={newQuestion.title}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={newQuestion.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="category">Category</Label>
              <Input
                type="text"
                name="category"
                id="category"
                value={newQuestion.category}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="difficulty">Difficulty</Label>
              <Input
                type="select"
                name="difficulty"
                id="difficulty"
                value={newQuestion.difficulty}
                onChange={handleInputChange}
                required
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="inputFormat">Input Format</Label>
              <Input
                type="textarea"
                name="inputFormat"
                id="inputFormat"
                value={newQuestion.inputFormat}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="outputFormat">Output Format</Label>
              <Input
                type="textarea"
                name="outputFormat"
                id="outputFormat"
                value={newQuestion.outputFormat}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="sampleInput">Sample Input</Label>
              <Input
                type="textarea"
                name="sampleInput"
                id="sampleInput"
                value={newQuestion.sampleInput}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="sampleOutput">Sample Output</Label>
              <Input
                type="textarea"
                name="sampleOutput"
                id="sampleOutput"
                value={newQuestion.sampleOutput}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Test Cases</Label>
              {newQuestion.testCases.map((testCase, index) => (
                <div key={index} className="test-case">
                  <FormGroup>
                    <Label for={`testInput-${index}`}>Input</Label>
                    <Input
                      type="textarea"
                      id={`testInput-${index}`}
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for={`testOutput-${index}`}>Output</Label>
                    <Input
                      type="textarea"
                      id={`testOutput-${index}`}
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, "output", e.target.value)}
                    />
                  </FormGroup>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleRemoveTestCase(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button color="secondary" onClick={handleAddTestCase}>
                Add Test Case
              </Button>
            </FormGroup>
            <FormGroup>
              <Label for="tags">Tags</Label>
              <Input
                type="text"
                name="tags"
                id="tags"
                value={newQuestion.tags}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={editQuestion ? handleSaveChanges : handleAddQuestion}
          >
            {editQuestion ? "Save Changes" : "Add"}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Challenges;
