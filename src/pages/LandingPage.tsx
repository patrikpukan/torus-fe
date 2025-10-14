import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const LandingPage = () => {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Welcome to Torus</Typography>
      <Typography variant="body1">
        This is the starting point of the application. Use the navigation above
        to explore the rest of the pages.
      </Typography>
    </Stack>
  )
}

export default LandingPage
