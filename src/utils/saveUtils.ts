import {GameInfo} from "./chessUtils";

const STORAGE_KEY = 'chess_scan_saved_games';

export interface SavedGame {
  title: string;
  game: GameInfo;
}

export interface Bookmark {
  name: string;
  games?: SavedGame[]
}

export interface SavedGames {
  bookmarks: Bookmark[]
}

const readSaveData = (): SavedGames => {
  try {
    const savedGames = localStorage.getItem(STORAGE_KEY);
    return savedGames ? JSON.parse(savedGames) : {bookmarks: []};
  } catch (e) {
    const freshStart = { bookmarks: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshStart));
    return freshStart;
  }
};

export const createBookmark = (bookmark: string): SavedGames => {
  const readSavedGames = readSaveData();

  const updatedSave = {
    bookmarks: [{ name: bookmark }, ...(readSavedGames.bookmarks || [])],
  };

  console.log(updatedSave);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSave));
  return updatedSave;
};

export const deleteBookmark = (bookmark: string): SavedGames => {
  const readSavedGames = readSaveData();

  const updatedBookmarks = readSavedGames.bookmarks.filter(bookmarkItem => bookmarkItem.name !== bookmark);
  const updatedSave = {
    bookmarks: [...updatedBookmarks],
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSave));
  return updatedSave;
};

export const deleteGame = (bookmark: string, game: string): SavedGames => {
  const readSavedGames = readSaveData();

  const updatedBookmarks = readSavedGames.bookmarks.map(bookmarkItem => {
    if (bookmarkItem.name === bookmark) {
      const updatedGames = bookmarkItem.games?.filter(gameItem => gameItem.title !== game);
      return {
        ...bookmarkItem,
        games: [...(updatedGames || [])],
      };
    } else {
      return bookmarkItem;
    }
  });

  const updatedSave = {
    bookmarks: [...updatedBookmarks],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSave));
  return updatedSave;
};

export const saveGame = (bookmark: string, title: string, game: GameInfo): SavedGames => {
  const readSavedGames = readSaveData();
  const newGame = { title, game };

  const updatedBookmarks = readSavedGames.bookmarks.map(
    bookmarkItem => bookmarkItem.name === bookmark ?
        { ...bookmarkItem, games: [...(bookmarkItem?.games || []), newGame] } : bookmarkItem
  );

  const updatedSave = {
    bookmarks: updatedBookmarks,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSave));
  return updatedSave;
};

export const getSavedGames = (): SavedGames | null => {
  try {
    const savedGames = localStorage.getItem(STORAGE_KEY);
    return savedGames ? JSON.parse(savedGames) : {bookmarks: []};
  } catch (e) {
    console.error(e);
    return null;
  }
};
