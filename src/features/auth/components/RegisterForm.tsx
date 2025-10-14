import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const RegisterForm = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" textAlign="center">
          Register
        </Typography>

        <Stack spacing={2}>
          <Stack spacing={1}>
            <Typography component="label" htmlFor="register-invite-code" variant="body2" fontWeight={600}>
              Invite code
            </Typography>
            <TextField id="register-invite-code" name="inviteCode" fullWidth />
          </Stack>

          <Stack spacing={1}>
            <Typography component="label" htmlFor="register-first-name" variant="body2" fontWeight={600}>
              Name
            </Typography>
            <TextField id="register-first-name" name="firstName" fullWidth />
          </Stack>

          <Stack spacing={1}>
            <Typography component="label" htmlFor="register-last-name" variant="body2" fontWeight={600}>
              Surname
            </Typography>
            <TextField id="register-last-name" name="lastName" fullWidth />
          </Stack>

          <Stack spacing={1}>
            <Typography component="label" htmlFor="register-email" variant="body2" fontWeight={600}>
              Email:
            </Typography>
            <TextField
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              fullWidth
            />
          </Stack>

          <Stack spacing={1}>
            <Typography component="label" htmlFor="register-password" variant="body2" fontWeight={600}>
              Password
            </Typography>
            <TextField
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              fullWidth
            />
          </Stack>

          <Stack spacing={1}>
            <Typography component="label" htmlFor="register-confirm-password" variant="body2" fontWeight={600}>
              Confirm Password
            </Typography>
            <TextField
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              fullWidth
            />
          </Stack>
        </Stack>

        <Button variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </Stack>
    </Paper>
  )
}

export default RegisterForm
