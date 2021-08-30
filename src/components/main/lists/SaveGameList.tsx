import React, {useCallback, useEffect, useState} from "react";

import {makeStyles} from '@material-ui/core/styles';
import {List, Typography} from "@material-ui/core";
import {GameInfo} from "../../../utils/chessUtils";
import {createBookmark, getSavedGames, SavedGames, saveGame} from "../../../utils/saveUtils";
import ListItem from "@material-ui/core/ListItem";
import FolderIcon from '@material-ui/icons/Folder';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import {createKey} from "../../../utils/misc";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AlertBox from "../../ui/AlertBox";
import {AlertType, useToaster} from "../../../contexts/ToasterContext";

const useStyles = props => makeStyles(theme => ({
  container: {
  },
  buttons: {
    marginLeft: 'auto',
    '& > :not(:first-child)': {
      marginLeft: theme.spacing(1),
    },
  },
  placeholders: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  bookmarkLabel: {
    paddingLeft: 10,
    '& > *': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      maxWidth: 200,
      fontSize: 15,
    }
  },
  gameTitleLabel: {
    '& > *': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      maxWidth: 220,
      fontSize: 14,
    }
  },
  newBookmarkInput: {
    width: '100%',
    marginRight: theme.spacing(2),
  },
}));

const SaveGameList: React.FC<{
  game: GameInfo,
  onClose: () => void,
}> = ({ game, onClose }) => {
  const classes = useStyles({})();
  const toaster = useToaster();

  const [savedGames, setSavedGames] = useState<SavedGames>();
  const [showBookmarkInput, setShowBookmarkInput] = useState<boolean>(false);
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [bookmarkInputValue, setBookmarkInputValue] = useState<string>('');
  const [nameInputValue, setNameInputValue] = useState<string>('');
  const [targetBookmark, setTargetBookmark] = useState<string>('');

  useEffect(() => {
    const games = getSavedGames();
    if (!!games) {
      setSavedGames(games);
    }
  }, []);

  const handleBookmarkInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setBookmarkInputValue(event.target.value);

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNameInputValue(event.target.value);

  const showCreateBookmarkInput = useCallback(() => {
    setShowBookmarkInput(true);
    setShowNameInput(false);
  }, []);

  const onCreateBookmark = useCallback(() => {
    if (!!bookmarkInputValue) {
      setSavedGames(createBookmark(bookmarkInputValue));
      setShowBookmarkInput(false);
      setTargetBookmark(bookmarkInputValue);
      setShowNameInput(true);
    }
  }, [bookmarkInputValue]);

  const selectBookmark = (bookmark: string) => {
    setShowBookmarkInput(false);
    setTargetBookmark(bookmark);
    setShowNameInput(true);
  };

  const cancelSelectBookmark = () => {
    setTargetBookmark('');
    setShowNameInput(false);
  };

  const onCreateName = useCallback(() => {
    saveGame(targetBookmark, nameInputValue, game);
    toaster.show(`Saved "${nameInputValue}"!`, AlertType.SUCCESS);
    onClose();
  }, [targetBookmark, nameInputValue, game, onClose]);

  return (
    <div className={classes.container}>
      <Toolbar>
        {showNameInput ? (
          <IconButton edge="start" color="inherit" onClick={cancelSelectBookmark} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        )}
        <Typography variant="body1">Save Game</Typography>

        {!showNameInput && (
          <div className={classes.buttons}>
            <Button onClick={showCreateBookmarkInput} color="secondary" variant="contained" size="small">
              New Bookmark
            </Button>
          </div>
        )}
      </Toolbar>

      <Divider />

      {showBookmarkInput && (
        <List>
          <ListItem key={'create-bookmark'}>
            <TextField
              autoFocus
              label="New Bookmark"
              variant="outlined"
              size="small"
              color="secondary"
              value={bookmarkInputValue}
              className={classes.newBookmarkInput}
              onChange={handleBookmarkInputChange}
            />
            <Button variant="contained" color="secondary" onClick={onCreateBookmark}>Create</Button>
          </ListItem>
        </List>
      )}

      {showNameInput && (
        <List>
          <ListItem key={'create-save-name'}>
            <TextField
              autoFocus
              label="Name of Game"
              variant="outlined"
              size="small"
              color="secondary"
              value={nameInputValue}
              className={classes.newBookmarkInput}
              onChange={handleNameInputChange}
            />
            <Button variant="contained" color="secondary" onClick={onCreateName}>Save</Button>
          </ListItem>
        </List>
      )}

      {!!savedGames?.bookmarks?.length && !showNameInput && (
        <List>
          { savedGames.bookmarks.map(bookmark => (
            <ListItem
              button
              onClick={() => selectBookmark(bookmark.name)}
              key={createKey()}>
              <FolderIcon />
              <ListItemText
                className={classes.bookmarkLabel}
                primary={bookmark.name}
              />
            </ListItem>
          ))}
        </List>
      )}

      {!!savedGames && !savedGames.bookmarks.length && (
        <div style={{ 'padding': 16 }}>
          <Typography variant="body1" color="textSecondary"><i>Create a new bookmark to save this game!</i></Typography>
        </div>
      )}
    </div>
  );
};

export default SaveGameList;
