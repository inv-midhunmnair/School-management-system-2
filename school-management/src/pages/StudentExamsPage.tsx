import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.interceptor";
import dayjs from "dayjs";

type Exam = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
 has_submitted: boolean;
};

const StudentExamsPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<"active" | "expired">("active");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, [viewType]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const endpoint =
        viewType === "active"
          ? "exams/student/exams/active/"
          : "exams/student/exams/expired/";
      const response = await axiosInstance.get(endpoint);
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Exams
      </Typography>

      <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={(e, val) => val && setViewType(val)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="active">Active Exams</ToggleButton>
        <ToggleButton value="expired">Expired Exams</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <CircularProgress />
      ) : (
        exams.map((exam) => {
          const now = dayjs();
          const start = dayjs(exam.start_time);
          const end = dayjs(exam.end_time);
          const withinTimeWindow = now.isAfter(start) && now.isBefore(end);

          return (
            <Card key={exam.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{exam.title}</Typography>
                <Typography variant="body2">{exam.description}</Typography>
                <Typography>
                  {start.format("HH:mm")} - {end.format("HH:mm")}
                </Typography>

                {viewType === "active" && (
                  <>
                    {exam.has_submitted ? (
                      <Typography color="success.main" sx={{ mt: 1 }}>
                        ✅ Already Submitted
                      </Typography>
                    ) : withinTimeWindow ? (
                      <Button
                        sx={{ mt: 1 }}
                        variant="contained"
                        onClick={() => navigate(`/student/view/${exam.id}`)}
                      >
                        Attempt Exam
                      </Button>
                    ) : (
                      <Typography color="warning.main" sx={{ mt: 1 }}>
                        ⏳ You're way too early
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
};

export default StudentExamsPage;
