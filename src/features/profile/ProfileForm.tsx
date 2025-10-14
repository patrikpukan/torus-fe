import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Button from '@mui/material/Button'
import type { Profile } from './types'

export type ProfileFormProps = {
  value: Profile
  onChange?: (next: Profile) => void
  readOnly?: boolean
  onSubmit?: (profile: Profile) => void
  submitLabel?: string
}

const ProfileForm = ({ value, onChange, readOnly = true, onSubmit, submitLabel = 'Save' }: ProfileFormProps) => {
  const fields = useMemo(
    () => [
      { key: 'organization', label: 'Organization' },
      { key: 'email', label: 'Email' },
      { key: 'name', label: 'Name' },
      { key: 'surname', label: 'Surname' },
      { key: 'accountStatus', label: 'Account status' },
      { key: 'pairingStatus', label: 'Pairing status' },
    ] as const,
    []
  )

  const handleChange = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return
    onChange({ ...value, [key]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <Box component={onSubmit ? 'form' : 'div'} onSubmit={onSubmit ? handleSubmit : undefined}>
      <Typography variant="h3" fontWeight={600} textAlign="center" gutterBottom>
        Profile
      </Typography>
      <Avatar sx={{ bgcolor: 'grey.200', width: 96, height: 96, mx: 'auto', mb: 5 }}>
        <AccountCircleIcon sx={{ fontSize: 72, color: 'grey.600' }} />
      </Avatar>

      <Grid container spacing={3}>
        {fields.map(({ key, label }) => (
          <Grid key={key} size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={label}
              value={value[key]}
              onChange={handleChange(key)}
              InputProps={{ readOnly }}
            />
          </Grid>
        ))}
      </Grid>

      <Box mt={6}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Get to know me:
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="About me"
              multiline
              minRows={3}
              value={value.about}
              onChange={handleChange('about')}
              InputProps={{ readOnly }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Hobbies"
              value={value.hobbies}
              onChange={handleChange('hobbies')}
              InputProps={{ readOnly }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Preferred meeting activity"
              value={value.meetingActivity}
              onChange={handleChange('meetingActivity')}
              InputProps={{ readOnly }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Interests"
              value={value.interests}
              onChange={handleChange('interests')}
              InputProps={{ readOnly }}
            />
          </Grid>
        </Grid>
      </Box>

      {!readOnly && onSubmit && (
        <Paper sx={{ mt: 4, p: 2, textAlign: 'right' }} elevation={0}>
          <Button type="submit" variant="contained">
            {submitLabel}
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default ProfileForm
