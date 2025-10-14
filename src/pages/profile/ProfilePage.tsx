import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { type SyntheticEvent, useState } from "react";
import ProfileCalendar from "../../features/calendar/ProfileCalendar";
import ProfileView from "../../features/profile/ProfileView";

const ProfilePage = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box maxWidth={800} mx="auto">
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="Profile tabs"
				variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}
      >
        <Tab label="Profile" />
        <Tab label="Calendar" />
      </Tabs>

      {tab === 0 && <ProfileView />}

      {tab === 1 && <ProfileCalendar />}
    </Box>
  );
};

export default ProfilePage;
