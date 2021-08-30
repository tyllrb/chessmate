import {Piece, Player, transformCharToPiece} from "./transforms";

const Chess = require("chess.js/chess");

export const cleanUpNotationText = (text: string) => {
  let parsedText = text
    .trim()
    .replaceAll('€', 'e')
    .replaceAll('£', 'f')
    .replaceAll('!', '')
    .replaceAll('?', '')
    .replaceAll('\n', ' ')
    .replaceAll('0-0', 'O-O')
    .replaceAll('o-o', 'O-O')
    .replaceAll('0-O', 'O-O')
    .replaceAll('O-0', 'O-O')
    .replaceAll('0-0-0', 'O-O-O');

  // If text begins with 'l' it may be a misread '1'
  if (parsedText.charAt(0) === 'l') {
    parsedText = '1' + parsedText.slice(1);
  }

  return parsedText;
};

export const parseNotationText = (text: string) => {
  try {
    const moves: string[][] = [];
    // replace 0-0 with CASTLE constant
    let parsedText = text
      .replaceAll('O-O', 'CASTLE')
      .replaceAll('O-O-O', 'CASTLE2');

    const parseMoveSet = (move: string) =>
      move
        .split(' ')
        .filter(i => !!i.length)
        .map(i => i.replaceAll('.', ''));

    // If the notation starts with a number, then moves are denoted by a numbered list
    if (!isNaN(Number(parsedText.charAt(0)))) {
      const remainingMoves =
        (' ' + parsedText)
          .split(/(\s[0-9]+\.)/)
          .filter((i, index) => !!i.length && !(index % 2))
          .map(i => i
            .replaceAll('CASTLE', 'O-O')
            .replaceAll('CASTLE2', 'O-O-O')
          );

      remainingMoves.forEach(move => moves.push(parseMoveSet(move)));
    } else {
      const remainingMoves = parsedText.split(' ');
    }

    return moves;
  } catch (e) {
    throw 'Could not parse';
  }
};

export const validateMoves = (moves: string[][]): string[] => {
  const invalidMoves: string[] = [];

  const validate = move => isNaN(Number(move.charAt(0))) && /^([NBRQK])?([a-h])?([1-8])?(x)?([a-h][1-8])(=[NBRQK])?(\+|#)?$|^O-O(-O)?$/.test(move);

  moves.forEach(move => {
    const [whiteMove, blackMove] = move;

    if (!validate(whiteMove))
      invalidMoves.push(whiteMove);

    if (blackMove && !validate(blackMove))
      invalidMoves.push(blackMove);
  });
  return invalidMoves;
};

/**
 * Validate that a series of moves are actually legal. If there is a move that is invalid, it will return said
 * move, otherwise if there are no illegal moves, method will return nothing.
 */
export interface GameMove {
  whiteMove: string;
  blackMove?: string;
  whiteMoveFrom: string;
  blackMoveFrom?: string;
  whiteFenPosition: string;
  blackFenPosition?: string;
  whiteCaptured: Piece[],
  blackCaptured: Piece[],
}

export interface GameInfo {
  moves: GameMove[],
  totalMoves: number,
  winner?: string;
}

export const validateGame = (moves: string[][]): [string | undefined, GameInfo | undefined] => {
  let invalidMove;
  const chessGame = new Chess();
  const allWhiteCaptures: Piece[] = [];
  const allBlackCaptures: Piece[] = [];

  const gameInfo: GameInfo = {
    moves: [],
    totalMoves: 0,
  };

  const validate = (move: string):Record<'from' | 'to' | 'fen', string> | null => {
    const moveResult = chessGame.move(move);
    if (!!moveResult) {
      const fen = chessGame.fen();
      return ({
        from: moveResult.from,
        to: moveResult.to,
        fen
      });
    }

    return null;
  };

  const recordCaptured = () => {
    const history = chessGame.history({ verbose: true });
    const lastRecord = history[history.length - 1];
    if (!!lastRecord.captured) {
      const piece = transformCharToPiece(lastRecord.captured)!;
      lastRecord.color === 'w' ? allWhiteCaptures.push(piece) : allBlackCaptures.push(piece);
    }
  };

  for (let i = 0; i < moves.length; i++) {
    const [whiteMove, blackMove] = moves[i];

    const whiteMoveInfo = validate(whiteMove);

    if (whiteMoveInfo === null) {
      invalidMove = whiteMove;
      break;
    } else {
      recordCaptured();
    }

    const blackMoveInfo = blackMove ? validate(blackMove) : undefined;

    if (blackMoveInfo === null) {
      invalidMove = blackMove;
      break;
    } else {
      recordCaptured();
    }

    gameInfo.totalMoves += 1;
    gameInfo.moves.push({
      whiteMove,
      blackMove,
      whiteMoveFrom: whiteMoveInfo.from,
      blackMoveFrom: blackMoveInfo?.from,
      whiteFenPosition: whiteMoveInfo.fen,
      blackFenPosition: blackMoveInfo?.fen,
      whiteCaptured: [...allWhiteCaptures],
      blackCaptured: [...allBlackCaptures],
    } as GameMove);
  }

  return [invalidMove, !!invalidMove ? undefined : gameInfo];
};

/**
 * Fix notations with 'l' -> '1' and 's' -> '5'
 */
export const fixIncorrectMoves = (moves: string[][]): string[][] => {

  const fix = (move: string): string => {
    const squareNumber = move.toLowerCase().charAt(move.length - 1);

    if (squareNumber === 'l') {
      return move.slice(0, move.length - 1) + '1';
    } else if (squareNumber === 's') {
      return move.slice(0, move.length - 1) + '5';
    } else if (squareNumber === 'd') {
      return move.slice(0, move.length - 1) + '4';
    } else {
      return move;
    }
  };

  return moves.map((move) => {
    const [whiteMove, blackMove] = move;
    return !!blackMove ? [fix(whiteMove), fix(blackMove)] : [fix(whiteMove)];
  });
};

export const getAsciiPiece = (piece: Piece, player: Player): string => ({
  [Player.WHITE]: {
    [Piece.KING]: '\u2654',
    [Piece.QUEEN]: '\u2655',
    [Piece.ROOK]: '\u2656',
    [Piece.BISHOP]: '\u2657',
    [Piece.KNIGHT]: '\u2658',
    [Piece.PAWN]: '\u2659',
  },
  [Player.BLACK]: {
    [Piece.KING]: '\u265A',
    [Piece.QUEEN]: '\u265B',
    [Piece.ROOK]: '\u265C',
    [Piece.BISHOP]: '\u265D',
    [Piece.KNIGHT]: '\u265E',
    [Piece.PAWN]: '\u265F',
  }
}[player][piece]);

export const getPieceCode = (piece: Piece, player: Player): string => ({
  [Player.WHITE]: {
    [Piece.KING]: 'wk',
    [Piece.QUEEN]: 'wq',
    [Piece.ROOK]: 'wr',
    [Piece.BISHOP]: 'wb',
    [Piece.KNIGHT]: 'wn',
    [Piece.PAWN]: 'wp',
  },
  [Player.BLACK]: {
    [Piece.KING]: 'bk',
    [Piece.QUEEN]: 'bq',
    [Piece.ROOK]: 'br',
    [Piece.BISHOP]: 'bb',
    [Piece.KNIGHT]: 'bn',
    [Piece.PAWN]: 'bp',
  }
}[player][piece]);

export const getPiecePoints = (piece: Piece): number => ({
  [Piece.QUEEN]: 9,
  [Piece.ROOK]: 5,
  [Piece.BISHOP]: 3,
  [Piece.KNIGHT]: 3,
  [Piece.PAWN]: 1,
}[piece]);

export const getMaterialScore = (whiteCaptured: Piece[], blackCaptured: Piece[]): number[] => {
  const whiteScore = whiteCaptured.reduce((total, piece) => total + getPiecePoints(piece), 0);
  const blackScore = blackCaptured.reduce((total, piece) => total + getPiecePoints(piece), 0);

  if (whiteScore === blackScore) return [0, 0];

  return whiteScore > blackScore ? [whiteScore, blackScore - whiteScore] : [whiteScore - blackScore, blackScore];
};

export const isCastlingMove = (move: string): boolean => move?.toLowerCase() === 'o-o' || move === '0-0';
export const isLongCastlingMove = (move: string): boolean => move?.toLowerCase() === 'o-o-o' || move === '0-0-0';
