import { Chessboard, COLOR, PIECE, MARKER_TYPE } from 'cm-chessboard/src/cm-chessboard/Chessboard';

export interface BoardConfig {
  orientation?: COLOR;
  position?: string;
  animationDuration?: number;
}

export const getBoardConfig = (config?: BoardConfig): any => ({
  position: 'start' || config?.position,
  sprite: { url: 'chessboard-sprite.svg', cache: true },
  orientation: COLOR.white || config?.orientation,
  style: {
    cssClass: "black-and-white",
    aspectRatio: 0.9,
    moveFromMarker: MARKER_TYPE.frame,
    moveToMarker: MARKER_TYPE.frame
  },
  responsive: true,
  animationDuration: 375 || config?.animationDuration,
  moveTimeDuration: 1200,
});

export const getWhiteMarkerConfig = () => ({ class: 'marker-square-red', slice: 'markerSquare' });
export const getBlackMarkerConfig = () => ({ class: 'marker-square-blue', slice: 'markerSquare' });

export const getCropperConfig = () => ({
  responsive: true,
  modal: true,
  guides: false,
  center: true,
  highlight: false,
  autoCrop: true,
  movable: true,
  scalable: true,
  rotatable: true,
  zoomable: false,
  zoomOnTouch: false,
  zoomOnWheel: false,
  cropBoxMovable: true,
  cropBoxResizable: true
});
