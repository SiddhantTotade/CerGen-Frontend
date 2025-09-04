import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { useRegister } from "@/hooks/useRegister";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });

    // live validation
    let errorMsg = "";
    if (field === "firstName" && !value.trim()) {
      errorMsg = "First name is required";
    }
    if (field === "lastName" && !value.trim()) {
      errorMsg = "Last name is required";
    }
    if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
      errorMsg = "Invalid email address";
    }
    if (field === "password" && value.length < 6) {
      errorMsg = "Password must be at least 6 characters";
    }
    if (field === "password2" && value !== form.password) {
      errorMsg = "Passwords do not match";
    }

    setErrors({ ...errors, [field]: errorMsg });
  };

  const handleSubmit = () => {
    let newErrors = {
      firstName: form.firstName ? "" : "First name is required",
      lastName: form.lastName ? "" : "Last name is required",
      email: /\S+@\S+\.\S+/.test(form.email) ? "" : "Invalid email address",
      password:
        form.password.length >= 6
          ? ""
          : "Password must be at least 6 characters",
      password2:
        form.password2 === form.password ? "" : "Passwords do not match",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((e) => e === "")) {
      registerMutation.mutate(
        {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          password: form.password,
          password2: form.password2,
        },
        {
          onSuccess: () => navigate({ to: "/app/home" }),
          onError: (err) => console.error("Login failed:", err.message),
        }
      );
      alert("Form submitted successfully!");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper
        style={{ width: "25%", padding: "1.3rem", gap: "10px" }}
        elevation={3}
      >
        <Typography align="center" variant="h6">
          Sign up
        </Typography>
        <Stack marginTop={2} spacing={2}>
          <TextField
            fullWidth
            label="First Name"
            size="small"
            value={form.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            fullWidth
            label="Last Name"
            size="small"
            value={form.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            size="small"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            size="small"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            size="small"
            value={form.password2}
            onChange={(e) => handleChange("password2", e.target.value)}
            error={!!errors.password2}
            helperText={errors.password2}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
