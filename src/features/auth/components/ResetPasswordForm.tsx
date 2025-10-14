import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const ResetPasswordForm = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" textAlign="center">
          Reset your password
        </Typography>

        <Stack spacing={1}>
          <Typography component="label" htmlFor="reset-password-email" variant="body2" fontWeight={600}>
            Email:
          </Typography>
          <TextField
            id="reset-password-email"
            name="email"
            type="email"
            autoComplete="email"
            fullWidth
          />
        </Stack>

        <Button variant="contained" color="primary" fullWidth>
          Send reset password email
        </Button>
      </Stack>
    </Paper>
  )
}

export default ResetPasswordForm
