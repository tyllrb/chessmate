import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import {GameSnapshot, Piece, Player} from "../../../utils/transforms";
import {Typography} from "@material-ui/core";
import {GameInfo, getAsciiPiece, getPieceCode} from "../../../utils/chessUtils";

const useStyles = props => makeStyles(theme => ({
  container: {
    height: props.containerHeight,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    '& > :first-child': {
      width: 'calc(50% - 30px)',
    },
    '& > :nth-child(2)': {
      width: 'calc(50% - 30px)',
    }
  },
  moves: {
    paddingLeft: 14,
    paddingRight: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.grey[700]}`,
    overflow: 'scroll',
    '& > :not(:last-child)': {
      marginBottom: 10,
    },
  },
  move: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveNumber: {
    color: theme.palette.grey[500],
    margin: 0,
    marginBottom: 0,
    marginRight: 5,
  },
  moveValue: {
    background: theme.palette.grey[600],
    borderRadius: 15,
    padding: 5,
    fontSize: 13,
    minWidth: 40,
    fontWeight: 700,
    textAlign: 'center',
  },
  currentMove: {
    '& :first-child': {
      color: theme.palette.common.white,
    },
    '& :nth-child(2)': {
      background: theme.palette.common.white,
    },
  },
  captured: {
    paddingLeft: theme.spacing(2),
    paddingRight: 14,
  },
  playerStatus: {
    fontSize: 14,
    color: theme.palette.grey[400],
    marginBottom: 10,
  },
  pieces: {
    color: theme.palette.common.white,
    '& > *': {
      width: 28,
    },
  },
}));

const GameHistory: React.FC<{
  height?: number;
  className?: string;
  gameInfo: GameInfo;
  currentMove: number;
  onPlayMove?: (moveIndex: number) => void;
}> = ({ className, height, gameInfo, currentMove, onPlayMove }) => {
  const classes = useStyles({ containerHeight: height || '100%' })();
  const movesContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.getElementById(`move-${currentMove}`);

    if (!element || !movesContainer.current) return;

    const move = element?.getBoundingClientRect();
    const container = movesContainer.current?.getBoundingClientRect();

    if (move.bottom > container.bottom) {
      element.scrollIntoView();
    }
  }, [gameInfo, currentMove]);

  const getCapturedPieces = useCallback((player: Player) => {
    if (currentMove < 0) return null;

    const capturedPieces = gameInfo?.moves[currentMove][player === Player.WHITE ? 'whiteCaptured' : 'blackCaptured'];

    if (!capturedPieces?.length) return null;

    return capturedPieces.map(piece =>
      getPieceCode(piece, player === Player.WHITE ? Player.BLACK : Player.WHITE)
    );
  }, [gameInfo, currentMove]);

  return (
    <div className={clsx(classes.container, className)}>
      <div className={classes.moves} ref={movesContainer}>
        {gameInfo?.moves.map((move, index) => (
          <div className={clsx(classes.move, (index === currentMove) && classes.currentMove)} key={`move-${index}`} id={`move-${index}`}>
            <p className={classes.moveNumber}>{index + 1}.</p>
            <span className={classes.moveValue} key={move.whiteMove} onClick={() => onPlayMove?.(index)}>
              { move.blackMove ? `${move.whiteMove} - ${move.blackMove}` : move.whiteMove }
            </span>
          </div>
        ))}
      </div>

      <div className={classes.captured}>
        <div className={classes.playerStatus}>
          <b>White</b>
          <div className={classes.pieces}>
            {getCapturedPieces(Player.WHITE)?.map((piece, index) =>
              <img key={`${piece}-${index}`} src={`chess-pieces/${piece}.svg`} />) || '--'}
          </div>
        </div>

        <div className={classes.playerStatus}>
          <b>Black</b>
          <div className={classes.pieces}>
            {getCapturedPieces(Player.BLACK)?.map((piece, index) =>
              <img key={`${piece}-${index}`} src={`chess-pieces/${piece}.svg`} />) || '--'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
