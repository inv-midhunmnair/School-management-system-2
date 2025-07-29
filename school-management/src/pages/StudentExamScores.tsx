import { useEffect, useState } from "react";
import axiosInstance from "../api/axios.interceptor";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { API_ENDPOINTS } from "../api/api.constants";

interface Score {
  exam_id: number;
  exam_title: string;
  submitted_at: string;
  score: number;
  total: number;
}

const StudentExamScoresPage = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.VIEW_SCORES);
        setScores(response.data);
      } catch (error) {
        console.error("Failed to fetch student scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Your Exam Scores
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : scores.length === 0 ? (
        <Typography variant="body1" color="textSecondary" mt={2}>
          You have not submitted any exams yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {scores.map((score) => (
            <Grid item xs={12} sm={6} md={4} key={score.exam_id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {score.exam_title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Submitted: {new Date(score.submitted_at).toLocaleString()}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="body1" fontWeight={500}>
                    Score:&nbsp;
                    <Typography
                      component="span"
                      color="primary"
                      fontWeight={700}
                    >
                      {score.score}
                    </Typography>
                    &nbsp;/ {score.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StudentExamScoresPage;
