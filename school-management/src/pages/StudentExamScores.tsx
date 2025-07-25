// src/pages/StudentScoresPage.tsx
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios.interceptor';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { API_ENDPOINTS } from '../api/api.constants';

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
        console.error('Failed to fetch student scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h5" gutterBottom>
        Your Exam Scores
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : scores.length === 0 ? (
        <Typography>No exam submissions yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {scores.map((score) => (
            <Grid item xs={12} md={6} lg={4} key={score.exam_id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{score.exam_title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Submitted at:{' '}
                    {new Date(score.submitted_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Score: {score.score} / {score.total}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default StudentExamScoresPage;
