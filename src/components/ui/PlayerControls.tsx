import {useCallback, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import {makeStyles} from "@material-ui/core";

const useStyles = props => makeStyles(theme => ({
  playerControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  moveCount: {
    fontWeight: 700,
  },
  moveButtons: {
  },
}));

export const PlayerControls: React.FC<{
  numMoves: number;
  currentMove: number;
  isPlaying: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}> = ({ isPlaying, numMoves, currentMove, onPlay, onPause, onNext, onPrev }) => {
  const classes = useStyles({})();

  const onPlayClicked = useCallback(() => {
    onPlay?.();
  }, [onPlay]);

  const onPauseClicked = useCallback(() => {
    onPause?.();
  }, [onPause]);

  return (
    <div className={classes.playerControls}>
      <div className={classes.moveButtons}>
        <IconButton edge="end" color="inherit" onClick={onPrev}>
          <SkipPreviousIcon />
        </IconButton>
        { !isPlaying && (
          <IconButton edge="end" color="inherit" onClick={onPlayClicked}>
            <PlayArrowIcon />
          </IconButton>
        )}

        { isPlaying && (
          <IconButton edge="end" color="inherit" onClick={onPauseClicked}>
            <PauseIcon />
          </IconButton>
        )}
        <IconButton edge="end" color="inherit" onClick={onNext}>
          <SkipNextIcon />
        </IconButton>
      </div>
    </div>
  )
};
