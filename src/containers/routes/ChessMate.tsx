import '../../cm-chessboard/assets/styles/cm-chessboard.css';
import React, {createRef, useCallback, useEffect, useRef, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import QueueIcon from '@material-ui/icons/Queue';
import FlipIcon from '@material-ui/icons/Cached';
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import MoodIcon from '@material-ui/icons/Mood';
import PhotoInput, {PhotoInputRef} from "../../components/main/photo/PhotoInput";
import Placeholder from "../../components/ui/Placeholder";
import {
  cleanUpNotationText,
  fixIncorrectMoves,
  GameInfo,
  parseNotationText,
  validateGame,
  validateMoves,
} from "../../utils/chessUtils";
import {PlayerControls} from "../../components/ui/PlayerControls";
import {getBoardConfig} from "../../services/ConfigService";
import useInterval from "../../hooks/useInterval";
import GameHistory from "../../components/main/chess/GameHistory";
import {Drawer} from "@material-ui/core";
import BottomBar from "../../components/ui/BottomBar";
import {useDialogs} from "../../contexts/DialogsContext";
import OpenGameList from "../../components/main/lists/OpenGameList";
import SaveGameList from "../../components/main/lists/SaveGameList";
import {useChessboard} from "../../contexts/ChessboardContext";
import clsx from "clsx";
import {AlertType, useToaster} from "../../contexts/ToasterContext";
import Linker from "../../components/ui/Linker";


const useStyles = props => makeStyles(theme => ({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    paddingTop: 55,
    background: theme.palette.background.default,
  },
  gameContainer: {
  },
  placeholder: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& > *': {
      marginBottom: 20,
    },
  },
  board: {
    width: '100%',
    display: props?.hasActiveBoard ? 'block' : 'none',
  },
  appBar: {
    top: 0,
    bottom: 'auto',
  },
  openGameDrawer: {
    '& > .MuiDrawer-paperAnchorLeft': {
      width: '80%',
    },
  },
  hidden: {
    display: 'none',
  },
  flexExpand: {
    flex: 1,
  },
}));

const ChessMate: React.FC = () => {
  const containerRef = createRef<HTMLDivElement>();
  const boardRef = createRef<HTMLDivElement>();
  // This photo input is for the landing screen
  const mainPhotoInputRef = useRef<PhotoInputRef>(null);
  // This photo input is for the bottom bar
  const bottomBarPhotoInputRef = useRef<PhotoInputRef>(null);
  const [currentMove, setCurrentMove] = useState<number>(-1);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isCurrentPlaybackOn, setCurrentPlaybackOn] = useState<boolean>(false);
  const [isSaveDrawerOpen, setSaveDrawerOpen] = useState<boolean>(false);
  const [isOpenGameDrawerOpen, setOpenGameDrawerOpen] = useState<boolean>(false);
  const [gameInfoBoxHeight, setGameInfoBoxHeight] = useState<number>(0);

  const classes = useStyles({ hasActiveBoard: true })();
  const {
    photoCropDialog,
    fixNotationDialog,
    ocrDialog,
    googleOcrDialog,
    notationExplainerDialog,
  } = useDialogs();
  const chessboard2 = useChessboard();

  useEffect(() => {
    if (!boardRef.current || !containerRef.current) return;
    const boxHeight = containerRef.current.clientHeight - boardRef.current.clientHeight - 130;
    setGameInfoBoxHeight(boxHeight);
  }, [chessboard2.isActive]);

  const setMoves = useCallback((moves: string[][]): boolean => {
    const currentMoves = gameInfo?.moves.map(({ whiteMove, blackMove }) => blackMove ? [whiteMove, blackMove] : [whiteMove]);
    const allMoves = !!currentMoves ? [...currentMoves, ...moves] : moves;

    let [invalidMoves, newGameInfo] = validateGame(allMoves);
    console.log(newGameInfo);
    if (!!invalidMoves) {
      fixNotationDialog.open({
        notationErrors: [invalidMoves],
        onComplete: (results: string) => processPhotoText(results),
      });
      return false;
    } else if (!!newGameInfo) {
      setGameInfo(newGameInfo);
      return true;
    } else {
      return false;
    }
  }, [gameInfo]);

  const processPhotoText = useCallback((text: string) => {
    const cleanText = cleanUpNotationText(text);

    try {
      let parsedMoves = parseNotationText(cleanText);
      parsedMoves = fixIncorrectMoves(parsedMoves);
      let invalidMoves = validateMoves(parsedMoves);

      if (!!invalidMoves.length || !parsedMoves.length) {
        fixNotationDialog.open({
          notation: cleanText,
          notationErrors: invalidMoves,
          onComplete: (result: string) => processPhotoText(result),
        });
      } else {
        const result = setMoves(parsedMoves);

        if (result && !gameInfo) {
          chessboard2.render(boardRef.current);
        }
      }
    } catch (e) {
      fixNotationDialog.open({
        notation: cleanText,
        onComplete: (result: string) => processPhotoText(result),
      });
    }
  }, [setMoves, gameInfo, boardRef]);

  const onLoadPhoto = (data) => {
    photoCropDialog.open({
      photo: data,
      onComplete: (results: string) => {
        onCroppedPhoto(results);
        photoCropDialog.close();
      },
    });
  };

  const onCroppedPhoto = (snippets) => {
    googleOcrDialog.open({
      queue: snippets,
      onComplete: (results: string) => {
        processPhotoText(results);
        googleOcrDialog.close();
      }
    });
  };

  const onNextMove = useCallback(() => {
    if (chessboard2.isAnimating) return;

    if (currentMove < gameInfo!.moves.length - 1) {
      setCurrentMove(currentMove + 1);
      chessboard2.move(gameInfo!.moves[currentMove + 1]);
    } else {
      setCurrentPlaybackOn(false);
    }
  }, [gameInfo, currentMove, chessboard2]);

  const onPreviousMove = useCallback(() => {
    if (currentMove === -1 || chessboard2.isAnimating) return;

    if (currentMove <= 1) {
      chessboard2.reset();
      setCurrentMove(0);
      setTimeout(() => {
        chessboard2.move(gameInfo!.moves[0]);
      }, getBoardConfig().moveTimeDuration);
    } else if (currentMove > 1) {
      // reset the board to before the previous move
      chessboard2.reset(gameInfo!.moves[currentMove - 2]);
      setCurrentMove(currentMove - 1);
      // re-play the previous move, after the board has reset
      setTimeout(() => {
        chessboard2.move(gameInfo!.moves[currentMove - 1]);
      }, getBoardConfig().moveTimeDuration);
    }
  }, [gameInfo, currentMove, chessboard2]);

  const onPausePlayback = useCallback(() => {
    setCurrentPlaybackOn(false);
  },[]);

  const onStartPlayback = useCallback(() => {
    if (chessboard2.isAnimating) return;

    onNextMove();
    setCurrentPlaybackOn(true);
  }, [onNextMove, chessboard2]);

  const onReplayMove = useCallback((replayMove: number) => {
    if (chessboard2.isAnimating) return;

    const isAfterCurrentMove = replayMove - currentMove === 1;
    if (!isAfterCurrentMove) {
      chessboard2.reset(gameInfo!.moves[replayMove - 1]);
    }
    setCurrentMove(replayMove);
    setTimeout(() => {
      chessboard2.move(gameInfo!.moves[replayMove]);
    }, !isAfterCurrentMove ? getBoardConfig().moveTimeDuration : 0);
  }, [gameInfo, currentMove, chessboard2]);

  const onClearBoard = useCallback(() => {
    chessboard2.destroy();
    setCurrentMove(-1);
    setGameInfo(null);
  }, [chessboard2]);

  const openGame = useCallback((game: GameInfo) => {
    onClearBoard();
    setGameInfo(game);
    console.log(game);
    chessboard2.render(boardRef.current, true);
    setOpenGameDrawerOpen(false);
  }, [onClearBoard, chessboard2, boardRef]);

  useInterval(onNextMove, isCurrentPlaybackOn ? 2800 : null);

  const test = useCallback(() => {
    const a = [["e4", "c5"], ["d4", "cxd4"], ["c3", "dxc3"], ["bxc3", "e6"]];
    setMoves(a);
    chessboard2.render(boardRef.current, true);

    const t1 = "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O O-O 9.Qe2 Bg6 10.Ne5 Nbd7 11.Nxg6 hxg6 12.Rd1 Qa5 13.e4 e5 14.d5 Nb6 15.dxc6 bxc6 16.Na2 Nxc4 17.Qxc4 Rab8 18.Nxb4 Qxb4 19.Qxb4 Rxb4 20.f3 c5 21.Be3 Rxb2 22.Bxc5 Rc8 23.Bxa7 Rcc2 24.Kh1 Rxg2 25.Bg1";
    //const c = processPhotoText(t1);
    //const b = new Chess();
    //setChessGame(b);
  }, [setMoves, boardRef, chessboard2]);

  return (
    <div className={classes.container} ref={containerRef}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={() => setOpenGameDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>

          <IconButton color="inherit" aria-label="open drawer" onClick={() => test()}>
            <MenuIcon />
          </IconButton>
          {!!gameInfo && (
            <PlayerControls
              numMoves={gameInfo.moves.length}
              currentMove={currentMove + 1}
              isPlaying={isCurrentPlaybackOn}
              onPlay={onStartPlayback}
              onPause={onPausePlayback}
              onPrev={onPreviousMove}
              onNext={onNextMove}
            />
          )}
        </Toolbar>
      </AppBar>

      <div className={clsx(classes.gameContainer, !chessboard2.isActive && classes.hidden)}>
        <div id="mainBoard" className={classes.board} ref={boardRef} />
        {!!gameInfo && (
          <GameHistory
            height={gameInfoBoxHeight}
            gameInfo={gameInfo}
            currentMove={currentMove}
            onPlayMove={onReplayMove} />
        )}
        <BottomBar items={[
          {
            text: 'Add',
            icon: <QueueIcon/>,
            onAction: () => bottomBarPhotoInputRef.current?.open(),
          },
          {
            text: 'New',
            icon: <AddCircleIcon/>,
            onAction: onClearBoard,
          },
          {
            text: 'Save',
            icon: <BookmarksIcon/>,
            onAction: () => setSaveDrawerOpen(true),
          },
          {
            text: 'Flip',
            icon: <FlipIcon />,
            onAction: () => chessboard2.flip(),
          },
        ]} />
      </div>
      <PhotoInput ref={bottomBarPhotoInputRef} onChange={onLoadPhoto} />
      {!chessboard2.isActive && (
        <div className={classes.placeholder}>
          <Placeholder
            message={'Take a photo of chess notation to import it onto a real chessboard!'}
            icon={<MoodIcon />}
          />
          <Linker text={'What is chess notation?'} onClick={() => notationExplainerDialog.open()} />
          <PhotoInput ref={mainPhotoInputRef} onChange={onLoadPhoto} text="Take a Photo!" />
        </div>
      )}

      <Drawer open={isOpenGameDrawerOpen} className={classes.openGameDrawer}>
        <OpenGameList
          canDelete
          isOpen={isOpenGameDrawerOpen}
          onClose={() => setOpenGameDrawerOpen(false)}
          onOpenGame={openGame} />
      </Drawer>

      {!!gameInfo && (
        <Drawer open={isSaveDrawerOpen} anchor="bottom">
          <SaveGameList onClose={() => setSaveDrawerOpen(false)} game={gameInfo} />
        </Drawer>
      )}
    </div>
  );
};

export default ChessMate;
