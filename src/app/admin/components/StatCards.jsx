// components/StatsCards.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faCloudDownloadAlt, faComments } from '@fortawesome/free-solid-svg-icons';
import { Box, Card, CardContent, Typography } from '@mui/material';

const StatsCards = () => {
  const items = [
    { icon: faUser, color: 'orange', value: '2500', label: 'Welcome' },
    { icon: faClock, color: 'blue', value: '123.50', label: 'Average Time' },
    { icon: faCloudDownloadAlt, color: 'teal', value: '1,805', label: 'Collections' },
    { icon: faComments, color: 'pink', value: '54', label: 'Comments' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 4 }}>
      {items.map((item, idx) => (
        <Card
          key={idx}
          sx={{
            flex: 1,
            boxShadow: 3,
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            p: 2,
          }}
        >
          <FontAwesomeIcon
            icon={item.icon}
            style={{
              color: (theme) => theme.palette[item.color]?.[500] || item.color,
              fontSize: 30,
            }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5" sx={{ color: 'text.primary' }}>
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default StatsCards;