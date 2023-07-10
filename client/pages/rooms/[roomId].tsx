import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Snackbar,
  Box,
  Card,
  Alert,
  CardHeader,
  CardContent,
  Button,
  IconButton,
  Tab,
  Tabs,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  CircularProgress,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import TerrainIcon from '@mui/icons-material/Terrain';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import WaterIcon from '@mui/icons-material/Water';
import GroupIcon from '@mui/icons-material/Group';

import SliderBox from '@/components/SliderBox';
import { io } from 'socket.io-client';
import { ThemeProvider } from '@mui/material/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ChatBox from '@/components/ChatBox';
import Footer from '@/components/Footer';
import Swal from 'sweetalert2';

import { ColorArr, forceStartOK, SpeedOptions } from '@/lib/constants';
import {
  Room,
  Message,
  Player,
  MapDataProp,
  LeaderBoardData,
} from '@/lib/types';
import theme from '@/components/theme';
import Navbar from '@/components/Navbar';
import Game from '@/components/game/Game';

interface PlayerTableProps {
  myPlayerId: string;
  players: Player[];
  handleChangeHost: any;
  disabled_ui: boolean;
}

function PlayerTable(props: PlayerTableProps) {
  const { myPlayerId, players, handleChangeHost, disabled_ui } = props;
  return (
    <Box sx={{ display: 'flex' }}>
      {players.map((player) => (
        <Button
          variant='outlined'
          key={player.id}
          disabled={disabled_ui}
          onClick={() => {
            handleChangeHost(player.id, player.username);
          }}
          sx={{
            borderColor: ColorArr[player.color],
            backgroundColor:
              player.id === myPlayerId ? ColorArr[player.color] : 'transparent',
            textTransform: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
            height: '30px',
            borderRadius: '20px',
            boxShadow: 1,
            marginX: 1,
            mb: 1,
          }}
        >
          {player.isRoomHost && (
            <StarsRoundedIcon
              sx={{
                color:
                  player.id === myPlayerId ? '#fff' : ColorArr[player.color],
              }}
            />
          )}
          <Typography
            variant='body2'
            sx={{
              color: player.id === myPlayerId ? '#fff' : ColorArr[player.color],
              textDecoration: player.forceStart ? 'underline' : 'none',
            }}
          >
            {player.username}
          </Typography>
        </Button>
      ))}
    </Box>
  );
}

function GamingRoom() {
  // todo 考虑合并所有状态到 roomInfo 并使用 useReducer 更新
  const [value, setValue] = useState(0);
  const [roomName, setRoomName] = useState<string>('');
  const [isNameFocused, setIsNamedFocused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [maxPlayerNum, setMaxPlayerNum] = useState(2);
  const [mapWidth, setMapWidth] = useState(0.5);
  const [mapHeight, setMapHeight] = useState(0.5);
  const [mountain, setMountain] = useState(0.5);
  const [city, setCity] = useState(0.5);
  const [swamp, setSwamp] = useState(0.5);
  const [forceStartNum, setForceStartNum] = useState(0);
  const [forceStart, setForceStart] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [fogOfWar, setFogOfWar] = useState<boolean>(true);
  const [mapData, setMapData] = useState<MapDataProp>([]);
  const [turnsCount, setTurnsCount] = useState<number>(0);
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardData>([]);
  const [loading, setLoading] = useState(true);
  const [openOverDialog, setOpenOverDialog] = useState<boolean>(false);
  const [dialogContent, setDialogContent] = useState<[Player | null, string]>([
    null,
    '',
  ]);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackTitle, setSnackTitle] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const socketRef = useRef<any>();

  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { t } = useTranslation();

  console.log(`Init player_id: ${myPlayerId}`);

  const disabled_ui = useMemo(() => {
    if (myPlayerId && players) {
      for (let i = 0; i < players.length; ++i) {
        if (players[i].id === myPlayerId) {
          return !players[i].isRoomHost;
        }
      }
    }
    return true;
  }, [myPlayerId, players]);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || t('anonymous'));
    // setMyPlayerId(localStorage.getItem('playerId'));
    console.log(`use effect get playerId: ${myPlayerId}`);
  }, []);

  useEffect(() => {
    setShareLink(window.location.href);
  }, []);

  const handleSnackMessage = (title: string, message: string) => {
    setSnackTitle(title);
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleRoomNameBlur = (event: any) => {
    setIsNamedFocused(false);
    socketRef.current.emit('change_room_name', roomName);
  };

  const navToHome = () => {
    router.push(`/`);
  };

  const handleLeaveRoom = () => {
    console.log('Leave Room');
    socketRef.current.disconnect();
    navToHome();
  };

  const handleChangeHost = (playerId: string, username: string) => {
    console.log(`change host to ${username}, id ${playerId}`);
    socketRef.current.emit('change_host', playerId);
  };

  const handleSurrender = () => {
    socketRef.current.emit('surrender', myPlayerId);
  };

  const handleFogOfWarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFogOfWar(event.target.checked);
    socketRef.current.emit('change_fog_of_war', event.target.checked);
  };

  const handleClickForceStart = () => {
    setForceStart(!forceStart);
    socketRef.current.emit('force_start');
  };

  const handleSettingChange =
    (setter: (value: number) => void, emit_name: string) =>
    (event: Event, newValue: number) => {
      setter(newValue);
      console.log(`socket emit name: ${emit_name}, ${newValue}`);
      socketRef.current.emit(emit_name, newValue);
    };

  const updateRoomInfo = (room: Room) => {
    console.log('update_room_info');
    console.log(`myPlayerId: ${myPlayerId}`);
    console.log(room);
    setRoomName(room.roomName);
    setGameStarted(room.gameStarted);
    setForceStartNum(room.forceStartNum);
    setMaxPlayerNum(room.maxPlayers);
    setGameSpeed(room.gameSpeed);
    setMapWidth(room.mapWidth);
    setMapHeight(room.mapHeight);
    setMountain(room.mountain);
    setCity(room.city);
    setSwamp(room.swamp);
    setFogOfWar(room.fogOfWar);

    setPlayers(room.players);
  };

  useEffect(() => {
    if (!roomId) return;
    if (!username) return;
    // myPlayerId could be null for first connect
    socketRef.current = io('localhost:3001', {
      query: { roomId: roomId, username: username, myPlayerId: myPlayerId },
    });
    let socket = socketRef.current;
    socket.emit('get_room_info');

    // set up socket event listeners
    socket.on('connect', () => {
      console.log(`socket client connect to server: ${socket.id}`);
    });
    // get player id when first connect
    socket.on('set_player_id', (playerId: string) => {
      console.log(`set_player_id: ${playerId}`);
      setMyPlayerId(playerId);
      // localStorage.setItem('playerId', playerId);
    });
    socket.on('room_info_update', updateRoomInfo);

    socket.on('error', (title: string, message: string) => {
      handleSnackMessage(title, message);
    });

    socket.on('room_message', (player: Player, content: string) => {
      console.log(`room_message: ${content}`);
      setMessages((messages) => [...messages, new Message(player, content)]);
    });
    socket.on('game_over', (capturedBy: Player) => {
      console.log(`game_over: ${capturedBy.username}`);
      setOpenOverDialog(true);
      setDialogContent([capturedBy, 'game_over']);
    });
    socket.on('game_ended', (winner: Player) => {
      console.log(`game_ended: ${winner.username}`);
      setDialogContent([winner, 'game_ended']);
      setOpenOverDialog(true);
    });

    socket.on(
      'game_update',
      (
        mapData: MapDataProp,
        turnsCount: number,
        leaderBoardData: LeaderBoardData
      ) => {
        // setGameMap(JSON.parse(gameMap)); // todo
        setLoading(false);
        setMapData(mapData);
        setTurnsCount(turnsCount);
        setLeaderBoardData(leaderBoardData);
      }
    );

    socket.on('reject_join', (message: string) => {
      Swal.fire({
        title: t('reject-join'),
        text: message,
        icon: 'error',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        navToHome();
      });
    });

    socket.on('connect_error', (error: Error) => {
      console.log('\nConnection Failed: ' + error);
      socket.disconnect();
      Swal.fire({
        title: "Can't connect to the server",
        text: 'Please reflush the App.',
        icon: 'error',
        showDenyButton: false,
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        navToHome();
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      handleSnackMessage('Reconnecting...', 'Disconnected from the server');
      // Swal.fire({
      //   title: 'Disconnected from the server',
      //   html: 'Please reflush the App.',
      //   icon: 'error',
      //   showDenyButton: false,
      //   showCancelButton: false,
      //   allowOutsideClick: false,
      //   confirmButtonText: 'Quit',
      // }).then((result) => {
      //   /* Read more about isConfirmed, isDenied below */
      //   navToHome();
      // });
    });

    socket.on('reconnect', () => {
      console.log('Reconnected to server.');
      if (gameStarted && myPlayerId) {
        socket.emit('reconnect', myPlayerId);
      } else {
        socket.emit('get_room_info');
      }
    });

    return () => {
      console.log('use effect leave room');
      socketRef.current.disconnect();
    };
  }, [roomId, username]);

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      {!gameStarted && (
        <Box
          sx={{
            width: {
              xs: '90vw',
              md: '55vw',
              lg: '45vw',
            },
          }}
        >
          <Alert
            icon={false}
            sx={{ backgroundColor: 'transparent', padding: 0 }}
            action={
              <IconButton
                color='primary'
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  handleSnackMessage('', t('copied'));
                }}
              >
                <ShareIcon />
              </IconButton>
            }
          >
            {!isNameFocused ? (
              <Typography
                sx={{ fontSize: '30px' }}
                onClick={() => {
                  setIsNamedFocused(true);
                }}
              >
                {roomName}
              </Typography>
            ) : (
              <TextField
                autoFocus
                variant='standard'
                inputProps={{ style: { fontSize: '30px' } }}
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                onBlur={handleRoomNameBlur}
                disabled={disabled_ui}
              />
            )}
          </Alert>
          <Snackbar
            open={snackOpen}
            autoHideDuration={1000}
            onClose={() => {
              setSnackOpen(!snackOpen);
            }}
            title={snackTitle}
            message={snackMessage}
          />
          <Box
            className='menu-container'
            sx={{
              mb: 2,
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant='fullWidth'
              indicatorColor='primary'
              textColor='inherit'
              aria-label='game settings tabs'
            >
              <Tab label={t('game')} />
              <Tab label={t('map')} />
              <Tab label={t('terrain')} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5 }}>
                  <Typography sx={{ mr: 2, whiteSpace: 'nowrap' }}>
                    {t('game-speed')}
                  </Typography>

                  <RadioGroup
                    aria-label='game-speed'
                    name='game-speed'
                    value={gameSpeed}
                    row
                    // @ts-ignore
                    onChange={handleSettingChange(
                      setGameSpeed,
                      'change_game_speed'
                    )}
                  >
                    {SpeedOptions.map((value) => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio />}
                        label={`${value}x`}
                        disabled={disabled_ui}
                      />
                    ))}
                  </RadioGroup>
                </Box>
                <SliderBox
                  label={t('max-player-num')}
                  value={maxPlayerNum}
                  valueLabelDisplay='auto'
                  disabled={disabled_ui}
                  min={2}
                  max={12}
                  step={1}
                  marks={Array.from({ length: 11 }, (_, i) => ({
                    value: i + 2,
                    label: `${i + 2}`,
                  }))}
                  handleChange={handleSettingChange(
                    setMaxPlayerNum,
                    'change_max_player_num'
                  )}
                />
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={fogOfWar}
                        onChange={handleFogOfWarChange}
                        disabled={disabled_ui}
                      />
                    }
                    label={t('fog-of-war')}
                  />
                </FormGroup>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <SliderBox
                  label={t('width')}
                  value={mapWidth}
                  disabled={disabled_ui}
                  handleChange={handleSettingChange(
                    setMapWidth,
                    'change_map_width'
                  )}
                />
                <SliderBox
                  label={t('height')}
                  value={mapHeight}
                  disabled={disabled_ui}
                  handleChange={handleSettingChange(
                    setMapHeight,
                    'change_map_height'
                  )}
                />
              </Box>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <SliderBox
                  label={t('mountain')}
                  value={mountain}
                  disabled={disabled_ui}
                  handleChange={handleSettingChange(
                    setMountain,
                    'change_mountain'
                  )}
                  icon={<TerrainIcon />}
                />
                <SliderBox
                  label={t('city')}
                  value={city}
                  disabled={disabled_ui}
                  handleChange={handleSettingChange(setCity, 'change_city')}
                  icon={<LocationCityIcon />}
                />
                <SliderBox
                  label={t('swamp')}
                  value={swamp}
                  disabled={disabled_ui}
                  handleChange={handleSettingChange(setSwamp, 'change_swamp')}
                  icon={<WaterIcon />}
                />
              </Box>
            </TabPanel>
          </Box>
          <Card className='menu-container' sx={{ mb: 2 }}>
            <CardHeader
              avatar={<GroupIcon color='primary' />}
              title={
                <Typography sx={{ color: 'white' }}>{t('players')}</Typography>
              }
              sx={{ padding: 'sm' }}
            />
            <CardContent sx={{ padding: 'sm' }}>
              <PlayerTable
                myPlayerId={myPlayerId}
                players={players}
                handleChangeHost={handleChangeHost}
                disabled_ui={disabled_ui}
              />
            </CardContent>
          </Card>
          <Button
            variant='contained'
            color={forceStart ? 'primary' : 'secondary'}
            size='large'
            sx={{ width: '100%', height: '60px', fontSize: '20px' }}
            onClick={handleClickForceStart}
          >
            {t('force-start')}({forceStartNum}/{forceStartOK[maxPlayerNum]})
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant='contained'
              size='large'
              sx={{ mt: 2, height: '60px', fontSize: '20px' }}
              onClick={handleLeaveRoom}
            >
              {t('leave-room')}
            </Button>
          </Box>
        </Box>
      )}
      {gameStarted && loading && (
        <Box
          className='menu-container'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h3'>{t('game-starting')}</Typography>
          <CircularProgress />
        </Box>
      )}
      {gameStarted && !loading && (
        <Game
          roomId={roomId}
          myPlayerId={myPlayerId}
          turnsCount={turnsCount}
          mapData={mapData}
          players={players}
          leaderBoardData={leaderBoardData}
          dialogContent={dialogContent}
          openOverDialog={openOverDialog}
          setOpenOverDialog={setOpenOverDialog}
          handleSurrender={handleSurrender}
        />
      )}
      <ChatBox
        socket={socketRef.current}
        messages={messages}
        setMessages={setMessages}
      />
      <Footer />
    </ThemeProvider>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default GamingRoom;

export async function getServerSideProps(context: any) {
  // extract the locale identifier from the URL
  const { locale } = context;

  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}
