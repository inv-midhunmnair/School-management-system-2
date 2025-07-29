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
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.interceptor";
import dayjs from "dayjs";
import { CheckCircle, HourglassEmpty, PlayArrow } from "@mui/icons-material";

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
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📚 My Exams
      </Typography>

      <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={(e, val) => val && setViewType(val)}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="active">Active Exams</ToggleButton>
        <ToggleButton value="expired">Expired Exams</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : exams.length === 0 ? (
        <Typography>No {viewType} exams found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {exams.map((exam) => {
            const now = dayjs();
            const start = dayjs(exam.start_time);
            const end = dayjs(exam.end_time);
            const withinTimeWindow = now.isAfter(start) && now.isBefore(end);

            return (
              <Grid item xs={12} md={6} key={exam.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="h6">{exam.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exam.description}
                      </Typography>

                      <Divider />

                      <Typography variant="body2">
                        🕒 {start.format("HH:mm")} – {end.format("HH:mm")}
                      </Typography>

                      {viewType === "active" && (
                        <>
                          {exam.has_submitted ? (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <CheckCircle color="success" />
                              <Typography color="success.main">
                                Already Submitted
                              </Typography>
                            </Stack>
                          ) : withinTimeWindow ? (
                            <Button
                              variant="contained"
                              startIcon={<PlayArrow />}
                              onClick={() =>
                                navigate(`/student/view/${exam.id}`)
                              }
                            >
                              Attempt Exam
                            </Button>
                          ) : (
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <HourglassEmpty color="warning" />
                              <Typography color="warning.main">
                                You're too early to start this exam
                              </Typography>
                            </Stack>
                          )}
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StudentExamsPage;
