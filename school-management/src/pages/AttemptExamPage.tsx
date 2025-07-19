// src/pages/AttemptExamPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.interceptor";

type Question = {
  id: number;
  text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
};

type Exam = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

const AttemptExamPage = () => {
  const { exam_id } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await axiosInstance.get(`/exams/student/view/${exam_id}/`);
        setExam(res.data);
      } catch (error) {
        console.error("Failed to fetch exam", error);
        alert("Unable to load exam.");
        navigate("/exams/student/exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [exam_id]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([question_id, selected_option]) => ({
        question_id: Number(question_id),
        selected_option,
      }));

      const payload = {
        exam: Number(exam_id), // ✅ required field
        answers: formattedAnswers,
      };

      await axiosInstance.post(`/exams/student/exams/${exam_id}/submit/`, payload);
      alert("Exam submitted successfully!");
      navigate("/exams/student/exams");
    } catch (error: any) {
      console.error("Submission failed", error.response?.data || error.message);
      alert("Submission failed.");
    }
  };

  if (loading) return <CircularProgress />;

  if (!exam) return null;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {exam.title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {exam.description}
      </Typography>

      {exam.questions.map((q) => (
        <Card key={q.id} sx={{ my: 2 }}>
          <CardContent>
            <Typography fontWeight="bold">{q.text}</Typography>
            <RadioGroup
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            >
              <FormControlLabel
                value="option_1"
                control={<Radio />}
                label={q.option_1}
              />
              <FormControlLabel
                value="option_2"
                control={<Radio />}
                label={q.option_2}
              />
              <FormControlLabel
                value="option_3"
                control={<Radio />}
                label={q.option_3}
              />
              <FormControlLabel
                value="option_4"
                control={<Radio />}
                label={q.option_4}
              />
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={
          Object.keys(answers).length !== exam.questions.length
        }
      >
        Submit Exam
      </Button>
    </Box>
  );
};

export default AttemptExamPage;
