import { createFileRoute } from '@tanstack/react-router'
import { Box, Paper, Stack, Typography, TextField, Button } from '@mui/material'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Paper sx={{ width: '25%', padding: '1.3rem' }} elevation={3}>
        <Stack spacing={2}>
          <Typography variant="h6" align="center">
            Forgot Password
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary">
            Enter your email address and we’ll send you a link to reset your password.
          </Typography>

          <TextField fullWidth label="Email" type="email" size="small" />

          <Button variant="contained" fullWidth>
            Send Reset Link
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
