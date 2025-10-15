import Box from "@mui/material/Box";
import ProfileForm from "./ProfileForm";
import type { UserProfile } from "../../types/User";

const mockProfile: UserProfile = {
  organization: "Dezider Design Solutions a.s.",
  email: "email@email.com",
  name: "Jozef",
  surname: "Testerovic",
  accountStatus: "Active",
  pairingStatus: "Active",
  about:
    'I like aligning shoes in other people\'s hallways, vacuuming carpets into a chessboard pattern, clicking "Accept Cookies" just for fun.',
  hobbies: ["Stalking", "Running", "Crossdressing"],
  meetingActivity: "Coffee, Walk",
  interests: "Metalica, Marvel movies",
};

const ProfileView = () => (
  <Box>
    <ProfileForm value={mockProfile} readOnly />
  </Box>
);

export default ProfileView;
