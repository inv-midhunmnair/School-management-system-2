import axiosInstance from "./axios.interceptor";
import { API_ENDPOINTS } from "./api.constants";

export const loginUser = async (username: string, password: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
    username,
    password,
  });
  return response.data;
};

export const registerTeacher = async (teacherData: any) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_TEACHER, teacherData);
  return response.data;
};

export const registerStudent = async (studentData: any) => {
  const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_STUDENT, studentData);
  return response.data;
};