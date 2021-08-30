import React, {createContext, useState, useCallback, useContext, useMemo, createRef, Ref} from 'react';
import {GameMove, isCastlingMove, isLongCastlingMove} from "../utils/chessUtils";
import {Chessboard as CMChessboard, COLOR, PIECE, FEN_START_POSITION, INPUT_EVENT_TYPE, MARKER_TYPE} from "cm-chessboard/src/cm-chessboard/Chessboard";
import {getBlackMarkerConfig, getBoardConfig, getWhiteMarkerConfig} from "../services/ConfigService";
import {transformSquareFromMove} from "../utils/transforms";

const Chess = require('chess.js/chess');

export interface ChessboardContextInterface {
  render: (ref, editable?: boolean) => void;
  move: (move: GameMove) => void;
  reset: (move?: GameMove) => void;
  destroy: () => void;
  flip: () => void;
  isActive: boolean;
  getBoardHeight: () => number;
  isAnimating: boolean;
}

export const ChessboardContext = createContext<ChessboardContextInterface | undefined>(undefined);

export const ChessboardProvider: React.FC = ({ children }) => {
  // The current reference to the svg board
  const [currentBoard, setCurrentBoard] = useState<any>();
  // The current reference to the Chess.js instance
  const [currentGame, setCurrentGame] = useState<any>();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleMoveInput = (event, board, game) => {
    switch (event.type) {
      case INPUT_EVENT_TYPE.moveStart:
        board.removeMarkers(undefined, MARKER_TYPE.dot);
        const moves = game.moves({ square: event.square, verbose: true });
        moves.forEach(move => {
          board.addMarker(move.to, MARKER_TYPE.dot);
        });
        return true;
      case INPUT_EVENT_TYPE.moveDone:
        const validMove = game.move({ from: event.squareFrom, to: event.squareTo });
        if (validMove) {
          board.removeMarkers(undefined, MARKER_TYPE.dot);
          board.setPosition(game.fen());
        }
        return !!validMove;
      case INPUT_EVENT_TYPE.moveCanceled:
        board.removeMarkers(undefined, MARKER_TYPE.dot);
    }
  };

  const render = useCallback((ref: Ref<HTMLDivElement>, editable?: boolean) => {
    if (ref) {
      const newGame = new Chess();
      const newBoard = new CMChessboard(ref, getBoardConfig());
      setCurrentGame(newGame);
      setCurrentBoard(
        newBoard
      );

      if (editable) {
        newBoard.enableMoveInput(event => handleMoveInput(event, newBoard, newGame));
      }
    }
  }, [handleMoveInput]);

  const performMove = useCallback((color: COLOR, move: string, from: string, fen: string, onDone?: () => void) => {
    const markerConfig = color === COLOR.white ? getWhiteMarkerConfig() : getBlackMarkerConfig();

    currentGame.load(fen);

    if (isCastlingMove(move)) {
      currentBoard.addMarker(color === COLOR.white ? 'e1' : 'e8', markerConfig);
    } else if (isLongCastlingMove(move)) {
      currentBoard.addMarker(color === COLOR.white ? 'e1' : 'e8', markerConfig);
    } else {
      currentBoard.addMarker(from, markerConfig);
    }
    currentBoard.setPosition(fen).then(() => {
      if (isCastlingMove(move)) {
        currentBoard.addMarker(color === COLOR.white ? 'g1' : 'g8', markerConfig);
      } else if (isLongCastlingMove(move)) {
        currentBoard.addMarker(color === COLOR.white ? 'c1' : 'c8', markerConfig);
      } else {
        currentBoard.addMarker(transformSquareFromMove(move), markerConfig);
      }

      onDone?.();
    });
  }, [currentBoard, currentGame]);

  const move = useCallback((move: GameMove) => {
    currentBoard.removeMarkers();
    performMove(COLOR.white, move.whiteMove, move.whiteMoveFrom, move.whiteFenPosition);
    setIsAnimating(true);

    if (!!move.blackMove && !!move.blackMoveFrom && !!move.blackFenPosition) {
      setTimeout(() =>
        performMove(
          COLOR.black,
          move.blackMove!,
          move.blackMoveFrom!,
          move.blackFenPosition!,
          () => setIsAnimating(false)
        ), 1700
      );
    } else {
      setIsAnimating(false);
    }
  }, [currentBoard, performMove]);

  const reset = useCallback((move?: GameMove) => {
    // reset the board to before the previous move
    currentBoard.removeMarkers();
    currentBoard.setPosition(move?.blackFenPosition || FEN_START_POSITION, false);
  }, [currentBoard]);

  const destroy = useCallback(() => {
    if (!currentBoard) return;

    currentBoard.destroy();
    setCurrentBoard(undefined);
    setCurrentGame(undefined);
  }, [currentBoard, currentGame]);

  const flip = useCallback(() => {
    if (!currentBoard) return;

    const currentOrientation = currentBoard.getOrientation();
    currentBoard.setOrientation(currentOrientation === COLOR.white ? COLOR.black : COLOR.white);
  }, [currentBoard]);

  const getBoardHeight = useCallback((): number => {
    return currentBoard?.view?.height
  }, [currentBoard]);

  return (
    <ChessboardContext.Provider
      value={{
        render,
        move,
        reset,
        destroy,
        flip,
        getBoardHeight,
        isAnimating: isAnimating,
        isActive: !!currentBoard?.view,
      }}>
      {children}
    </ChessboardContext.Provider>
  );
};

export function useChessboard() {
  const context = useContext(ChessboardContext);
  if (context === undefined) {
    throw new Error('useChessboard must be used within a Provider');
  }
  return context;
};
