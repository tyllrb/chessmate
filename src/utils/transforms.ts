export enum Piece {
  ROOK = 'rook',
  QUEEN = 'queen',
  KNIGHT = 'knight',
  KING = 'king',
  BISHOP = 'bishop',
  PAWN = 'pawn',
}

export enum Player {
  WHITE = 'white',
  BLACK = 'black'
}

export interface GameSnapshot {
  turnToMove: Player,
  move: string,
  whiteCaptured: Piece[];
  blackCaptured: Piece[];
  winning?: string;
}

export const transformCharToPiece = (char: string): Piece | undefined => ({
  ['p']: Piece.PAWN,
  ['r']: Piece.ROOK,
  ['q']: Piece.QUEEN,
  ['k']: Piece.KING,
  ['n']: Piece.KNIGHT,
  ['b']: Piece.BISHOP,
}[char.toLowerCase()]);

export const transformGameHistory = (history): GameSnapshot[] => {
  const allBlackCaptured: Piece[] = [];
  const allWhiteCaptured: Piece[] = [];

  return history?.map(item => {
    const player = item.color === 'w' ? Player.WHITE : Player.BLACK;

    if (item.captured) {
      const piece = transformCharToPiece(item.captured);
      player === Player.WHITE ? allWhiteCaptured.push(piece!) : allBlackCaptured.push(piece!);
    }

    return {
      turnToMove: player,
      move: item.to,
      whiteCaptured: [...allWhiteCaptured],
      blackCaptured: [...allBlackCaptured],
    };
  });
};

export const transformSquareFromMove = (move: string): string => {
  if (isNaN(Number(move.charAt(move.length - 1)))) {
    return move.slice(0, move.length - 1).slice(-2);
  }
  return move?.slice(-2);
};

