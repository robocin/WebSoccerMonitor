import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";

import centerView from "../functions/CenterView";

export default function Monitor(props: {
  /**
   * This is the component that shows the field and all the entities on a canvas. It uses React Konva library.
   *
   * It recieves config values and React states with their setters, in order to enable reusability and
   * two-way communication between the Monitor component and the outside context, respectively.
   */
  config: {
    // height and width
    windowHeight: number;
    windowWidth: number;
    // color of the background everywhere
    backgroundColor: string;
    // total number of players (sum of both teams)
    totalNumberOfPlayers: number;
    // maximum number of frames in a match. In 2D this is equivalent to "showtime"
    maxNumberOfFrames: number;
    // all players refs (DOM references for updating states)
    allPlayersRefs: any;
    // ball ref
    ballRef: any;
    // true disables camera movement (locks it)
    lockCameraZoom: boolean;
    // (React Konva) default scale value of the Monitor's Stage
    defaultScaleValue: number;
    // (React Konva) function to draw the background layer
    DrawBackgroundFunction: Function;
    // (React Konva) function to draw all entities (players and ball)
    DrawAllEntities: Function;
  };
  states: {
    // a match is a collection of frames, or 'snapshots', each containing the states of each game entity.
    currentFrame: number; // TODO! old "showtime"
    setCurrentFrame: Function;
    // when set to true, starts an interval that, on every tick, pushes the currentFrame foward by 1 and makes a call to update the state of all entities
    // is set to false when currentFrame reaches maxNumberOfFrames
    isPlaying: boolean; // TODO! old "play"
    setIsPlaying: Function;
    // when resetView is set to true, a UseEffect code resets the view and sets resetView back to false
    resetView: boolean;
    setResetView: Function;
    // TODO: implement a selector outside of monitor for those values with an "?" symbol
    // carries the number of miliseconds that must be elapsed between each frame. The smaller this number is, the faster is the match playback.
    timeBetweenFrames?: number;
  };
  data: {
    /**
     * Set how much ms should elapse betwen two frames
     */
    setTimeBetweenFrames?: Function;
    // carries the ball, palyers, and game data. Filtered to contain only useful data for the Monitor. Note that this data is read-only for the Monitor
    // __ball_data_______________    __player_1_data______   __player_2_data_____________  _p3_...   _match_data
    /**
     * {
     * ball: [{x, y}, {x, y}, ...],
     * players: [[{x, y}, {x, y}, ...],[{x, y}, {x, y}, ...], ...],
     * match:?
     * }
     */
    dataObject: any;
  };
}) {
  // Refs (references to DOM nodes) //
  const stageRef = useRef(null);

  /**
   * --- useEffects ---
   *
   * check a condition (and act on it) on every change of state of a given array of variabes (React states).
   */
  // center the field on screen at the start
  useEffect(() => {
    if (stageRef !== null) {
      centerView({
        stageRef: stageRef,
        defaultScaleValue: props.config.defaultScaleValue,
      });
    }
  }, [stageRef]);

  // listens for resetView button press (to center the field on the screen)
  useEffect(() => {
    if (props.states.resetView === true) {
      centerView({
        stageRef: stageRef,
        defaultScaleValue:
          props.config.defaultScaleValue ?? props.config.defaultScaleValue,
      });
      props.states.setResetView(false);
    }
  }, [props.states.resetView]);

  // everytime the play state changes, if it is true, create a new interval (start playing the match)
  useEffect(() => {
    if (props.states.isPlaying === true) {
      const interval = setInterval(() => {
        props.states.setCurrentFrame((showtime) => showtime + 1);
      }, props.states.timeBetweenFrames);
      return () => clearInterval(interval);
    }
  }, [props.states.isPlaying]);

  // checks, every frame, if the game has ended (in order to stop the replay), if not, update the position of all entities everytime showtime changes
  useEffect(() => {
    if (props.states.currentFrame > props.config.maxNumberOfFrames) {
      props.states.setIsPlaying(0);
      props.states.setCurrentFrame((oldFrame) => oldFrame - 1);
    } else {
      updateAllEntities({
        allPlayersRefs: props.config.allPlayersRefs,
        playersDataArray: props.data.dataObject.players,
        currentFrame: props.states.currentFrame,
        ballRef: props.config.ballRef,
        ballDataArray: props.data.dataObject.ball,
      });
    }
  }, [props.states.currentFrame]);

  return (
    <div>
      {/* Top Bar  */}
      {/* {TopBar({ showtime: props.states.showtime })} */}

      {/* Konva stage */}
      <div className="w-full relative select-none">
        <Stage
          ref={stageRef}
          style={{ backgroundColor: props.config.backgroundColor }}
          width={props.config.windowWidth ?? window.innerWidth}
          height={props.config.windowHeight ?? window.innerHeight}
          draggable
          onWheel={props.config.lockCameraZoom?null:handleWheel}
        >
          {/* background layer */}
          <Layer>{props.config.DrawBackgroundFunction()}</Layer>
          {/* game entities layer */}
          <Layer>{props.config.DrawAllEntities()}</Layer>
        </Stage>
      </div>
    </div>
  );
}

// update state of all entities (ball and players)
function updateAllEntities(props: {
  allPlayersRefs;
  playersDataArray;
  ballRef;
  ballDataArray;
  currentFrame;
}) {
  // update all players
  updateAllPlayers({
    allPlayersRefs: props.allPlayersRefs,
    playersDataArray: props.playersDataArray,
    currentFrame: props.currentFrame,
  });

  // update ball
  UpdateEntity({
    shape: props.ballRef.current,
    x: props.ballDataArray[props.currentFrame].x,
    y: props.ballDataArray[props.currentFrame].y,
  });
}

// update all players state
function updateAllPlayers(props: {
  playersDataArray;
  allPlayersRefs;
  currentFrame;
}) {
  props.playersDataArray.forEach((player, index) => {
    UpdateEntity({
      shape: props.allPlayersRefs[index].current,
      x: player.position[props.currentFrame].x,
      y: player.position[props.currentFrame].y,
    });
  });
}

// update an entity state
function UpdateEntity(props: { shape: any; x: number; y: number }) {
  props.shape.to({ x: props.x, y: props.y, duration: 0 });
}

function handleWheel(e) {
  // The code for the function below (handleWheel) is taken from a demo code made by Konva.js's author
  // https://codesandbox.io/s/react-konva-zoom-on-scroll-demo-zzbkb?file=/index.js:1012-1541

  e.evt.preventDefault();

  const stage = e.target.getStage();
  const oldScale = stage.scaleX();
  const mousePointTo = {
    x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
    y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
  };
  const deltaYBounded = !(e.evt.deltaY % 1)
    ? Math.abs(Math.min(-10, Math.max(10, e.evt.deltaY)))
    : Math.abs(e.evt.deltaY);

  const scaleBy = 1.01 + deltaYBounded / 150;
  const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

  stage.scale({ x: newScale, y: newScale });

  stage.position({
    x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
    y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
  });
  stage.batchDraw();
}
