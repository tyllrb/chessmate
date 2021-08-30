import React, {useCallback, useEffect, useRef, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import AddBox from '@material-ui/icons/AddBox';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Placeholder from "../../ui/Placeholder";
import AlertBox from "../../ui/AlertBox";
import {DialogCommonProps} from "../../../contexts/DialogsContext";
import {GameInfo} from "../../../utils/chessUtils";
import {createBookmark, saveGame, getSavedGames, SavedGames} from "../../../utils/saveUtils";
import {List} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((theme) => ({
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  buttons: {
    marginLeft: 'auto',
    '& > :not(:first-child)': {
      marginLeft: theme.spacing(1),
    },
  },
  container: {
    position: 'relative',
  },
  newBookmarkInput: {
    width: '100%',
    marginRight: theme.spacing(2),
  },
  savedGameItem: {
    marginLeft: theme.spacing(5),
    padding: 0,
  },
  placeholders: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
}));

export interface SaveDialogProps {
  game?: GameInfo;
  onComplete: (success: boolean) => void;
}

const SaveDialog: React.FC<DialogCommonProps & SaveDialogProps> = ({ game, isOpen, onClose, onComplete }) => {
  const classes = useStyles();
  const [savedGames, setSavedGames] = useState<SavedGames>();
  const [saveError, setSaveError] = useState<string>();
  const [openBookmarks, setOpenBookmarks] = useState<string[]>([]);
  const [showCreateBookmark, setShowCreateBookmark] = useState<boolean>(false);
  const [showCreateGame, setShowCreateGame] = useState<boolean>(false);
  const [createBookmarkInputValue, setCreateBookmarkInputValue] = useState<string>('');
  const [createGameInputValue, setCreateGameInputValue] = useState<string>('');
  const [targetBookmark, setTargetBookmark] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const games = getSavedGames();
      if (games === null) {
        setSaveError('Could not read save file!');
      } else {
        setSavedGames(games);
      }
    }
  }, [isOpen]);

  const showCreateBookmarkInput = useCallback(() => {
    if (!showCreateBookmark) {
      setShowCreateBookmark(true);
      setShowCreateGame(false);
    }
  }, [showCreateBookmark]);

  const onCreateBookmark = useCallback(() => {
    if (!!createBookmarkInputValue) {
      setSavedGames(createBookmark(createBookmarkInputValue));
      setShowCreateBookmark(false);
    }
  }, [createBookmarkInputValue]);

  const handleCreateBookmarkInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCreateBookmarkInputValue(event.target.value);

  const handleCreateGameInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCreateGameInputValue(event.target.value);

  const createGameSave = useCallback((bookmark: string) => {
    setTargetBookmark(bookmark);
    setShowCreateBookmark(false);
    setShowCreateGame(true);
  }, []);

  const performSave = useCallback(() => {
    if (!targetBookmark || !game) {
      setSaveError('Hmm, theres no game to be saved?');
    } else {
      saveGame(targetBookmark, createGameInputValue, game);
      setShowCreateGame(false);
      onComplete(true);
    }
  }, [targetBookmark, createGameInputValue, game]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="body1" className={classes.title}>Save Game</Typography>

        <div className={classes.buttons}>
          <Button onClick={showCreateBookmarkInput} color="secondary" variant="contained" size="small">
            New Bookmark
          </Button>
        </div>
      </Toolbar>

      <Divider />

      <div className={classes.container}>
        { !!saveError && (<AlertBox message={saveError} />) }

        {!!showCreateBookmark && (
          <List>
            <ListItem key={'create-bookmark'}>
              <TextField
                autoFocus
                label="New Bookmark"
                variant="outlined"
                size="small"
                color="secondary"
                value={createBookmarkInputValue}
                className={classes.newBookmarkInput}
                onChange={handleCreateBookmarkInputChange}
              />
              <Button variant="contained" color="secondary" onClick={onCreateBookmark}>Create</Button>
            </ListItem>
          </List>
        )}

        {!!showCreateGame && (
          <List>
            <ListItem key={'save-game'}>
              <TextField
                autoFocus
                label="Name of game"
                variant="outlined"
                size="small"
                color="secondary"
                value={createGameInputValue}
                className={classes.newBookmarkInput}
                onChange={handleCreateGameInputChange}
              />
              <Button variant="contained" color="secondary" onClick={performSave}>Save</Button>
            </ListItem>
          </List>
        )}

        { !!savedGames?.bookmarks?.length && (
          <List>
            { savedGames.bookmarks.map(bookmark => (
              <>
                <ListItem key={bookmark.name.replace(' ', '-')}>
                  <ListItemIcon onClick={() => createGameSave(bookmark.name)}>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary={`${bookmark.name} ${!!bookmark.games ? `(${bookmark.games.length})` : ''}`} />
                  { openBookmarks.includes(bookmark.name) ? (
                    <ExpandLess onClick={() => setOpenBookmarks(openBookmarks.filter(b => b !== bookmark.name))} />
                  ): (
                    <ExpandMore onClick={() => setOpenBookmarks([...openBookmarks, bookmark.name])} />)
                  }
                </ListItem>
                <Collapse in={openBookmarks.includes(bookmark.name)}>
                  { bookmark.games?.map(game => (
                    <ListItem className={classes.savedGameItem} key={game.title.replace(' ', '-')}>
                      <ListItemText secondary={game.title} />
                    </ListItem>
                  ))}
                </Collapse>
              </>
            ))}
          </List>
        )}

        { !!savedGames && !savedGames.bookmarks.length && (
          <div className={classes.placeholders}>
            <Placeholder
              message={'There are no bookmarks available, create a new one to save your game!'}
              icon={<HelpIcon />}
            />
          </div>
        )}

        { !savedGames && (
          <div className={classes.placeholders}>
            <Placeholder
              message={'Hmm trouble with save file?'}
              icon={<HelpIcon />}
            />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default SaveDialog;
