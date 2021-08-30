import React, {createContext, useState, useCallback, useContext, useMemo} from 'react';
import PhotoCropDialog, {PhotoCropDialogProps} from "../components/main/dialogs/PhotoCropDialog";
import FixNotationDialog, {FixNotationDialogProps} from "../components/main/dialogs/FixNotationDialog";
import OCRDialog, {OCRDialogProps} from "../components/main/dialogs/OCRDialog";
import GoogleOCRDialog, {GoogleOCRDialogProps} from "../components/main/dialogs/GoogleOCRDialog";
import SaveDialog, {SaveDialogProps} from "../components/main/dialogs/SaveDialog";
import NotationExplainer from "../components/main/dialogs/NotationExplainer";

export interface DialogActions {
  open: (props: any) => void;
  close: () => void;
}

export interface DialogSimpleActions {
  open: () => void;
  close: () => void;
}

export interface DialogCommonProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DialogsContextInterface {
  photoCropDialog: DialogActions;
  fixNotationDialog: DialogActions;
  ocrDialog: DialogActions;
  googleOcrDialog: DialogActions;
  saveDialog: DialogActions;
  notationExplainerDialog: DialogSimpleActions;
}

export const DialogsContext = createContext<DialogsContextInterface | undefined>(undefined);

export const DialogsProvider: React.FC = ({ children }) => {
  const [isPhotoCropDialogOpen, setPhotoCropDialogOpen] = useState<boolean>(false);
  const [photoCropDialogProps, setPhotoCropDialogProps] = useState<PhotoCropDialogProps>();
  const [isNotationDialogOpen, setNotationDialogOpen] = useState<boolean>(false);
  const [notationDialogProps, setNotationDialogProps] = useState<FixNotationDialogProps>();
  const [isOcrDialogOpen, setOcrDialogOpen] = useState<boolean>(false);
  const [ocrDialogProps, setOcrDialogProps] = useState<OCRDialogProps>();
  const [isGoogleOcrDialogOpen, setGoogleOcrDialogOpen] = useState<boolean>(false);
  const [googleOcrDialogProps, setGoogleOcrDialogProps] = useState<GoogleOCRDialogProps>();
  const [isSaveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [saveDialogProps, setSaveDialogProps] = useState<SaveDialogProps>();
  const [isNotationExplainerDialogOpen, setNotationExplainerDialogOpen] = useState<boolean>(false);

  const photoCropDialog: DialogActions = {
    open: useCallback((props: PhotoCropDialogProps) => {
      setPhotoCropDialogProps({...photoCropDialogProps, ...props});
      setPhotoCropDialogOpen(true);
    }, [photoCropDialogProps]),
    close: () => setPhotoCropDialogOpen(false),
  };

  const fixNotationDialog: DialogActions = {
    open: useCallback((props: FixNotationDialogProps) => {
      setNotationDialogProps({...notationDialogProps, ...props});
      setNotationDialogOpen(true);
    }, [notationDialogProps]),
    close: () => setPhotoCropDialogOpen(false),
  };

  const ocrDialog: DialogActions = {
    open: useCallback((props: OCRDialogProps) => {
      setOcrDialogProps({...ocrDialogProps, ...props});
      setNotationDialogOpen(true);
    }, [ocrDialogProps]),
    close: () => setOcrDialogOpen(false),
  };

  const googleOcrDialog: DialogActions = {
    open: useCallback((props: GoogleOCRDialogProps) => {
      setGoogleOcrDialogProps({...googleOcrDialogProps, ...props});
      setGoogleOcrDialogOpen(true);
    }, [googleOcrDialogProps]),
    close: () => setGoogleOcrDialogOpen(false),
  };

  const saveDialog: DialogActions = {
    open: useCallback((props: SaveDialogProps) => {
      setSaveDialogProps({ ...saveDialogProps, ...props});
      setSaveDialogOpen(true);
    }, [saveDialogProps]),
    close: () => setSaveDialogOpen(false),
  };

  const notationExplainerDialog: DialogSimpleActions = {
    open: () => setNotationExplainerDialogOpen(true),
    close: () => setNotationExplainerDialogOpen(false),
  };

  return (
    <DialogsContext.Provider
      value={{
        photoCropDialog,
        fixNotationDialog,
        ocrDialog,
        googleOcrDialog,
        saveDialog,
        notationExplainerDialog,
      }}>
      {!!photoCropDialogProps && (
        <PhotoCropDialog
          {...photoCropDialogProps}
          isOpen={isPhotoCropDialogOpen}
          onClose={() => setPhotoCropDialogOpen(false)}
        />
      )}
      {!!notationDialogProps && (
        <FixNotationDialog
          {...notationDialogProps}
          isOpen={isNotationDialogOpen}
          onClose={() => setNotationDialogOpen(false)}
        />
      )}
      {!!ocrDialogProps && (
        <OCRDialog
          {...ocrDialogProps}
          isOpen={isOcrDialogOpen}
          onClose={() => setOcrDialogOpen(false)}
        />
      )}
      {!!googleOcrDialogProps && (
        <GoogleOCRDialog
          {...googleOcrDialogProps}
          isOpen={isGoogleOcrDialogOpen}
          onClose={() => setGoogleOcrDialogOpen(false)}
        />
      )}
      {!!saveDialogProps && (
        <SaveDialog
          {...saveDialogProps}
          isOpen={isSaveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
        />
      )}
      <NotationExplainer
        isOpen={isNotationExplainerDialogOpen}
        onClose={() => setNotationExplainerDialogOpen(false)}
      />
      {children}
    </DialogsContext.Provider>
  );
};

export function useDialogs() {
  const context = useContext(DialogsContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a Provider');
  }
  return context;
}
