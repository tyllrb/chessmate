import React, {useCallback, useEffect, useState} from "react";
import clsx from 'clsx';

import {makeStyles} from '@material-ui/core/styles';
import {List, Typography} from "@material-ui/core";
import {GameInfo} from "../../../utils/chessUtils";
import {deleteBookmark, deleteGame, getSavedGames, SavedGames} from "../../../utils/saveUtils";
import ListItem from "@material-ui/core/ListItem";
import FolderIcon from '@material-ui/icons/Folder';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import Collapse from "@material-ui/core/Collapse";
import Toolbar from "@material-ui/core/Toolbar";
import CenterBox from "../../ui/CenterBox";
import {createKey} from "../../../utils/misc";
import {red} from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import {AlertType, useToaster} from "../../../contexts/ToasterContext";

const useStyles = props => makeStyles(theme => ({
  container: {
  },
  savedGameItem: {
    paddingLeft: 20,
    padding: 0,
  },
  placeholders: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  deleteItem: {
    color: red[400],
    padding: theme.spacing(1),
    paddingLeft: 20,
    fontSize: 14,
  },
  deleteIcon: {
    paddingRight: theme.spacing(2),
  },
  bookmarkLabel: {
    paddingLeft: 10,
    '& > *': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontSize: 15,
    }
  },
  gameTitleLabel: {
    '& > *': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      fontSize: 14,
    }
  },
}));

const OpenGameList: React.FC<{
  onOpenGame: (game: GameInfo) => void,
  canDelete?: boolean,
  onClose: () => void,
  isOpen: boolean;
}> = ({ isOpen, onClose, canDelete = false, onOpenGame }) => {
  const classes = useStyles({})();
  const toaster = useToaster();
  const [openBookmarks, setOpenBookmarks] = useState<string[]>([]);
  const [savedGames, setSavedGames] = useState<SavedGames>();

  useEffect(() => {
    if (isOpen) {
      const games = getSavedGames();
      if (games) {
        setSavedGames(games);
      }
    }
  }, [isOpen]);

  const openBookmark = useCallback((bookmarkName: string) => {
    setOpenBookmarks([...openBookmarks, bookmarkName]);
  }, [openBookmarks]);

  const closeBookmark = useCallback((bookmarkName: string) => {
    setOpenBookmarks(openBookmarks.filter(b => b !== bookmarkName));
  }, [openBookmarks]);

  const toggleBookmark = useCallback((bookmarkName: string) => {
    if (openBookmarks.includes(bookmarkName)) {
      closeBookmark(bookmarkName);
    } else {
      openBookmark(bookmarkName);
    }
  }, [openBookmarks, closeBookmark]);

  const onDeleteBookmark = useCallback((bookmark: string) => {
    setSavedGames(deleteBookmark(bookmark));
    toaster.show(`Deleted "${bookmark}"!`, AlertType.SUCCESS);
  }, []);

  const onDeleteGame = useCallback((bookmark: string, game: string) => {
    setSavedGames(deleteGame(bookmark, game));
    toaster.show(`Deleted "${game}"!`, AlertType.SUCCESS);
  }, []);

  return (
    <div className={classes.container}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="body1">Open Game</Typography>
      </Toolbar>
      <Divider />
      { !!savedGames?.bookmarks?.length && (
        <List>
          { savedGames?.bookmarks.map(bookmark => (
            <React.Fragment key={createKey()}>
              <ListItem
                button
                onClick={() => toggleBookmark(bookmark.name)}
                key={createKey()}>
                <FolderIcon />
                <ListItemText
                  className={classes.bookmarkLabel}
                  primary={`${!!bookmark.games ? `(${bookmark.games.length})` : ''} ${bookmark.name}`} />
                { openBookmarks.includes(bookmark.name) ? <ExpandLess />: <ExpandMore /> }
              </ListItem>
              <Collapse in={openBookmarks.includes(bookmark.name)} key={createKey()}>
                <List disablePadding dense={false}>
                  { bookmark.games?.map(game => (
                    <ListItem
                      button
                      onClick={() => onOpenGame(game.game)}
                      className={classes.savedGameItem}
                      key={createKey()}>
                      <ListItemText className={classes.gameTitleLabel} primary={game.title} />
                      { canDelete && (
                        <IconButton
                          size="small"
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteGame(bookmark.name, game.title)
                          }}
                          className={classes.deleteIcon}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                  { canDelete && (
                    <ListItem
                      button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteBookmark(bookmark.name)
                      }}
                      className={clsx(classes.deleteItem, classes.savedGameItem)}
                      key={createKey()}>
                      <div>Delete Bookmark...</div>
                    </ListItem>
                  )}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      )}

      { !!savedGames && !savedGames.bookmarks.length && (
        <CenterBox>
          <div style={{ 'padding': 16 }}>
            <Typography variant="body1" color="textSecondary"><i>There are no saved games!</i></Typography>
          </div>
        </CenterBox>
      )}
    </div>
  );
};

export default OpenGameList;
