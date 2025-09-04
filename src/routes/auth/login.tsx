import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Alert,
  FormControl,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useLogin } from "@/hooks/useRegister";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials, {
      onSuccess: () => navigate({ to: "/app/home" }),
      onError: (err) => console.error("Login failed:", err.message),
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper sx={{ width: "25%", padding: "1.3rem" }} elevation={3}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h6" align="center">
              Sign in
            </Typography>

            {loginMutation.isError && (
              <Alert severity="error">{loginMutation.error?.message}</Alert>
            )}

            <FormControl fullWidth>
              <TextField
                label="Email"
                name="email"
                type="email"
                size="small"
                value={credentials.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                size="small"
                value={credentials.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <Box component="div" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <Typography>
                New User ?{" "}
                <Link style={{ color: "blue" }} to="/auth/register">
                  Register
                </Link>
              </Typography>
                <Link style={{ color: "blue" }} to="/auth/register">
                Forget Password ?
                </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
