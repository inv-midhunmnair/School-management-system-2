import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../api/axios.interceptor";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { API_ENDPOINTS } from "../api/api.constants";

type QuestionType = {
  text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_option: number;
};

type ExamForm = {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  assigned_students: number[];
  questions: QuestionType[];
};

const CreateExamPage = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExamForm>({
    defaultValues: {
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      assigned_students: [],
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [students, setStudents] = useState<{ id: number; full_name: string }[]>(
    []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(true);

  useEffect(() => {
    axiosInstance.get(API_ENDPOINTS.TEACHER_STUDENTS).then((res) => {
      setStudents(
        res.data.map((s: any) => ({
          id: s.id,
          full_name: `${s.first_name} ${s.last_name}`,
        }))
      );
    });
  }, []);

  const showDialog = (message: string, success: boolean) => {
    setDialogMsg(message);
    setDialogSuccess(success);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (data: ExamForm) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.CREATE_EXAM, data);
      showDialog("✅ Exam created successfully!", true);
      reset();
    } catch (err: any) {
      const res = err?.response?.data;
      const errorMessage =
        typeof res === "string"
          ? res
          : typeof res === "object"
          ? Object.entries(res)
              .map(([field, messages]) => `${field}: ${messages}`)
              .join("\n")
          : "Something went wrong!";
      showDialog(`❌ Failed to create exam:\n${errorMessage}`, false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Create New Exam
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            {...register("description", { required: "Description is required" })}
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Start Time"
            {...register("start_time", { required: "Start time is required" })}
            error={!!errors.start_time}
            helperText={errors.start_time?.message}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="End Time"
            {...register("end_time", { required: "End time is required" })}
            error={!!errors.end_time}
            helperText={errors.end_time?.message}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Assign to Students</InputLabel>
            <Controller
              name="assigned_students"
              control={control}
              rules={{ required: "At least one student must be assigned" }}
              render={({ field }) => (
                <Select
                  label="Assign to Students"
                  multiple
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.assigned_students}
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.full_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.assigned_students && (
              <Typography color="error" variant="caption">
                {errors.assigned_students.message as string}
              </Typography>
            )}
          </FormControl>
        </Paper>

        <Typography variant="h6">Questions</Typography>
        {fields.map((item, index) => (
          <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
              label={`Question ${index + 1}`}
              {...register(`questions.${index}.text` as const, {
                required: "Question text is required",
              })}
              error={!!errors.questions?.[index]?.text}
              helperText={errors.questions?.[index]?.text?.message}
              margin="normal"
            />
            {[1, 2, 3, 4].map((opt) => (
              <TextField
                key={opt}
                fullWidth
                label={`Option ${opt}`}
                {...register(`questions.${index}.option_${opt}` as const, {
                  required: `Option ${opt} is required`,
                })}
                error={!!errors.questions?.[index]?.[`option_${opt}`]}
                helperText={
                  errors.questions?.[index]?.[`option_${opt}`]?.message
                }
                margin="normal"
              />
            ))}
            <TextField
              select
              fullWidth
              label="Correct Option (1-4)"
              {...register(`questions.${index}.correct_option` as const, {
                required: "Correct option is required",
              })}
              error={!!errors.questions?.[index]?.correct_option}
              helperText={errors.questions?.[index]?.correct_option?.message}
              margin="normal"
            >
              {[1, 2, 3, 4].map((val) => (
                <MenuItem key={val} value={val}>
                  Option {val}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              color="error"
              onClick={() => remove(index)}
            >
              Remove Question
            </Button>
          </Paper>
        ))}
        <Box textAlign="center">
          <IconButton
            color="primary"
            onClick={() =>
              append({
                text: "",
                option_1: "",
                option_2: "",
                option_3: "",
                option_4: "",
                correct_option: 1,
              })
            }
          >
            <AddIcon />
          </IconButton>
        </Box>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Create Exam
        </Button>
      </form>

      {/* ✅ Dialog for success/failure messages */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{dialogSuccess ? "Success" : "Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogSuccess ? (
              <Alert severity="success">{dialogMsg}</Alert>
            ) : (
              <Alert severity="error" sx={{ whiteSpace: "pre-wrap" }}>
                {dialogMsg}
              </Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateExamPage;
