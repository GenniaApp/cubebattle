import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Room, RoomPool } from '@/lib/types';
import { useTranslation } from 'next-i18next';

function Lobby() {
  const [rooms, setRooms] = useState<RoomPool>({});
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const router = useRouter();

  const { t } = useTranslation();

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch('http://127.0.0.1:3001/get_rooms');
      const rooms = await res.json();
      setRooms(rooms);
      setLoading(false);
    };
    fetchRooms();
    let fetchInterval = setInterval(fetchRooms, 2000);
    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  const handleRoomClick = (roomName: string) => {
    router.push(`/rooms/${roomName}`);
  };

  const handleCreateRoomClick = async () => {
    const res = await fetch('http://127.0.0.1:3001/create_room');
    let data = await res.json();
    if (res.status === 200) {
      router.push(`/rooms/${data.roomId}`);
    } else {
      // alert('Failed to create room. Please try again later.');
      setSnackOpen(true);
      setSnackMessage(data.message);
    }
  };

  return (
    <Box
      className='bg-container'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={{
        width: {
          xs: '90vw',
          md: '50vw',
        },
      }}
    >
      <Snackbar
        open={snackOpen}
        autoHideDuration={1000}
        onClose={() => {
          setSnackOpen(!snackOpen);
        }}
      >
        <Alert severity='error' sx={{ width: '100%' }}>
          {snackMessage}
        </Alert>
      </Snackbar>
      <Typography
        variant='h4'
        component='h1'
        sx={{ color: 'white' }}
        gutterBottom
      >
        {t('lobby')}
      </Typography>
      <TableContainer className='menu-container' component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>{t('room-id')}</TableCell>
              <TableCell>{t('room-name')}</TableCell>
              <TableCell>{t('game-speed')}</TableCell>
              <TableCell>{t('players')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : Object.keys(rooms).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  No rooms available
                </TableCell>
              </TableRow>
            ) : (
              Object.values(rooms).map((room: Room) => (
                <TableRow key={room.id}>
                  <TableCell
                    component='th'
                    scope='row'
                    onClick={() => handleRoomClick(room.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {room.id}
                  </TableCell>
                  <TableCell>{room.roomName}</TableCell>
                  <TableCell>{room.gameSpeed}</TableCell>
                  <TableCell>{`${room.players.length}/${room.maxPlayers}`}</TableCell>
                  <TableCell>
                    <Typography
                      variant='body2'
                      color={room.gameStarted ? 'error' : 'success'}
                    >
                      {room.gameStarted ? 'Started' : 'Waiting'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleRoomClick(room.id)}
                    >
                      {t('join')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box marginTop={2} sx={{ width: '100%' }}>
        <Button
          variant='contained'
          color='primary'
          sx={{ width: '100%', height: '60px', fontSize: '20px' }}
          onClick={handleCreateRoomClick}
        >
          {t('create-room')}
        </Button>
      </Box>
    </Box>
  );
}

export default Lobby;
