import { loadGetInitialProps } from "next/dist/next-server/lib/utils";
import dynamic from "next/dynamic";
import { useState, useRef, useReducer } from "react";
import { Rect, Circle, Line, Arc, Wedge, Group } from "react-konva";
import Controls from "../Controls";
import TopBar from "./TopBar2D";

const Monitor = dynamic(() => import("../Monitor"), {
  ssr: false,
});

// constantes
const CENTER_VIEW_SCALE = 7;
const CENTER_VIEW_SCALE_PERCENTAGE = 2;
const BALL_COLOR = "white";
const BALL_RADIUS = 0.4;
const TOTAL_NUMBER_OF_PLAYERS = 22;
const TIME_BETWEEN_FRAMES = 120; // in ms
const MAX_NUMBER_OF_FRAMES = 5999; //IMPORTANT: counting with 0. so, for example, for 15 frames, the constant value must be 14.
// const PITCH_COLOR = "#1FA01F";
const PITCH_COLOR = "#008D2A";
const PITCH_DARKER_STRIPES_COLOR = "#007B1D";
const GOAL_COLOR = "black";
const PITCH_LENGTH = 105.0;
const PITCH_WIDTH = 68.0;
const PITCH_LINES_COLOR = "white";
const PITCH_MARGIN = 0.1;
const CENTER_CIRCLE_R = 9.15;
const PENALTY_AREA_LENGTH = 16.5;
const PENALTY_AREA_WIDTH = 40.32;
const GOAL_AREA_LENGTH = 5.5;
const GOAL_AREA_WIDTH = 18.32;
const GOAL_WIDTH = 14.02;
const GOAL_DEPTH = 2.44;
const PENALTY_SPOT_DIST = 11.0;
const CORNER_ARC_R = 1.0;
const PLAYER_RADIUS = 1.2; //TODO! get actual default value (this is a placeholder)
const PLAYER_LEFT_COLOR = "yellow";
const GOALIE_LEFT_COLOR = "lightGreen";
const PLAYER_RIGHT_COLOR = "red";
const GOALIE_RIGHT_COLOR = "#D358FF";
const VIEW_AREA_INDICATOR_LINE_COLOR = "#80c8ff";
const VIEW_AREA_INDICATOR_LINE_WIDTH = 0.1;
const PLAYER_OUTLINE_WIDTH = 0.1;
const PLAYER_OUTLINE_COLOR = "black";
const PLAYER_OUTLINE_KICK_COLOR = "white";
const DEFAULT_PLAYER_VIEW_AREA_SIZE = 5;

// Monitor2D function definition
export default function Monitor2D(props: {
  id: any;
  dataObject?: any;
  windowWidthPercentage?: number;
  windowHeightPercentage?: number;
  showControls: boolean;
  startPlaying: boolean;
  centerViewScalePercentage?: number;
  lockCameraZoom: boolean;
  maxNumberOfFrames?: number;
  replayWhenReachesEnd?: boolean;
  timeBetweenFrames?: number;
  showPlayerViewArea?: boolean;
  playbackSpeed?: number;
  playerViewAreaSize?: number;
}) {
  // config //
  const topBarHeight = 25;
  // const windowWidth = 700;
  // const windowHeight = 400;

  // states //
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(props.startPlaying);
  const [centerView, setCenterView] = useState(false);

  // Refs (references to DOM nodes) //
  let ballRef = useRef(null);
  let allPlayersRefs = [];
  for (let i = 0; i < TOTAL_NUMBER_OF_PLAYERS; i++) {
    allPlayersRefs.push(useRef(null));
  }

  /**
   * Monitor2D returns a Monitor component parameterized with 2D specificities (background, player and ball drawing functions, etc)
   */
  return (
    <div className="flex flex-wrap h-full w-full" id={props.id}>
      <TopBar
        topBarHeight={topBarHeight}
        currentFrame={currentFrame}
        team_l_name={props.dataObject.match.team_l_name}
        team_r_name={props.dataObject.match.team_r_name}
        team_l_score_log={props.dataObject.match.team_l_score}
        team_r_score_log={props.dataObject.match.team_r_score}
        game_state_log={props.dataObject.match.game_state_log}
      />
      <Monitor
        config={{
          category: "2D",
          parentDivId: props.id,
          topbarHeight: topBarHeight,
          DrawBackgroundFunction: () =>
            DrawBackground({
              lineColor: PITCH_LINES_COLOR,
              pitchLength: PITCH_LENGTH,
              pitchWidth: PITCH_WIDTH,
              pitchMargin: PITCH_MARGIN,
              cornerArcRadius: CORNER_ARC_R,
              centerCircleRadius: CENTER_CIRCLE_R,
              penaltyAreaWidth: PENALTY_AREA_WIDTH,
              penaltyAreaLength: PENALTY_AREA_LENGTH,
              goalAreaWidth: GOAL_AREA_WIDTH,
              goalAreaLength: GOAL_AREA_LENGTH,
              goalWidth: GOAL_WIDTH,
              goalDepth: GOAL_DEPTH,
              goalColor: GOAL_COLOR,
              penaltySpotDistance: PENALTY_SPOT_DIST,
              pitchColor: PITCH_COLOR,
            }),
          allPlayersRefs: allPlayersRefs,
          DrawAllEntities: () =>
            DrawAllEntities({
              allPlayersData: props.dataObject.players,
              allPlayersRef: allPlayersRefs,
              playerRadius: PLAYER_RADIUS,
              playerLeftColor: PLAYER_LEFT_COLOR,
              goalieLeftColor: GOALIE_LEFT_COLOR,
              playerRightColor: PLAYER_RIGHT_COLOR,
              goalieRightColor: GOALIE_RIGHT_COLOR,

              ballColor: BALL_COLOR,
              ballData: props.dataObject.ball,
              ballRadius: BALL_RADIUS,
              ballRef: ballRef,
            }),
          ballRef: ballRef,
          backgroundColor: PITCH_COLOR,
          defaultScalePercentage:
            props.centerViewScalePercentage ?? CENTER_VIEW_SCALE_PERCENTAGE,
          maxNumberOfFrames: props.maxNumberOfFrames ?? MAX_NUMBER_OF_FRAMES, // - 1 because the zero counts
          totalNumberOfPlayers: TOTAL_NUMBER_OF_PLAYERS,
          lockCameraZoom: props.lockCameraZoom,
          replayWhenReachesEnd: props.replayWhenReachesEnd ?? false,
          showPlayerViewArea: props.showPlayerViewArea ?? true,
          playerViewAreaSize:
            props.playerViewAreaSize ?? DEFAULT_PLAYER_VIEW_AREA_SIZE,
        }}
        states={{
          currentFrame: currentFrame,
          setCurrentFrame: setCurrentFrame,
          isPlaying: isPlaying,
          setIsPlaying: setIsPlaying,
          resetView: centerView,
          setResetView: setCenterView,
          timeBetweenFrames: props.timeBetweenFrames ?? TIME_BETWEEN_FRAMES,
          playbackSpeed: props.playbackSpeed,
        }}
        data={{
          setTimeBetweenFrames: null,
          dataObject: props.dataObject,
        }}
      />
      <div className="w-full">
        {props.showControls && (
          <Controls
            endGameFrame={props.maxNumberOfFrames ?? MAX_NUMBER_OF_FRAMES}
            currentFrame={currentFrame}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            setCenterView={() => setCenterView(true)}
            setCurrentFrame={setCurrentFrame}
          />
        )}
      </div>
    </div>
  );
}

// DrawBackground function definition
function DrawBackground(props: {
  lineColor: string;
  pitchLength: number;
  pitchWidth: number;
  pitchMargin: number;
  cornerArcRadius: number;
  centerCircleRadius: number;
  penaltyAreaWidth: number;
  penaltyAreaLength: number;
  goalAreaWidth: number;
  goalAreaLength: number;
  goalWidth: number;
  goalDepth: number;
  goalColor: string;
  penaltySpotDistance: number;
  pitchColor: string;
}) {
  return (
    <>
      {/* Darker pitch stripes TODO: this is almost done, but conflicts with another draw down the line. fix this.*/}
      {/* <Rect
        x={-props.pitchLength/2 - props.goalDepth}
        y={-props.pitchWidth/2}
        height={props.pitchWidth}
        width={props.pitchLength/12 + props.goalDepth*2}
        fill={PITCH_DARKER_STRIPES_COLOR}
      />
      */}

      {/* General lines (outline margins and corner arcs, center circle) and middle vertical line */}
      {BackgroundGenenralLines({
        lineColor: props.lineColor,
        pitchLength: props.pitchLength,
        pitchWidth: props.pitchWidth,
        pitchMargin: props.pitchMargin,
        cornerArcRadius: props.cornerArcRadius,
        centerCircleRadius: props.centerCircleRadius,
        penaltyAreaWidth: props.penaltyAreaWidth,
        penaltyAreaLength: props.penaltyAreaLength,
        goalAreaWidth: props.goalAreaLength,
        goalAreaLength: props.goalAreaLength,
        goalWidth: props.goalWidth,
        goalDepth: props.goalDepth,
        goalColor: props.goalColor,
        penaltySpotDistance: props.penaltySpotDistance,
        pitchColor: props.pitchColor,
      })}

      {/* LEFT side specifc drawings */}
      {SideSpecificBackgroundLines({
        side: "left",
        lineColor: props.lineColor,
        pitchMargin: props.pitchMargin,
        pitchLength: props.pitchLength,
        pitchWidth: props.pitchWidth,
        penaltyAreaLength: props.penaltyAreaLength,
        penaltyAreaWidth: props.penaltyAreaWidth,
        goalAreaWidth: props.goalAreaWidth,
        goalAreaLength: props.goalAreaLength,
        goalWidth: props.goalWidth,
        goalDepth: props.goalDepth,
        goalColor: props.goalColor,
        penaltySpotDistance: props.penaltySpotDistance,
        centerCircleRadius: props.centerCircleRadius,
        pitchColor: props.pitchColor,
      })}

      {/* RIGHT side specifc drawings */}
      {SideSpecificBackgroundLines({
        side: "right",
        lineColor: props.lineColor,
        pitchMargin: props.pitchMargin,
        pitchLength: props.pitchLength,
        pitchWidth: props.pitchWidth,
        penaltyAreaLength: props.penaltyAreaLength,
        penaltyAreaWidth: props.penaltyAreaWidth,
        goalAreaWidth: props.goalAreaWidth,
        goalAreaLength: props.goalAreaLength,
        goalWidth: props.goalWidth,
        goalDepth: props.goalDepth,
        goalColor: props.goalColor,
        penaltySpotDistance: props.penaltySpotDistance,
        centerCircleRadius: props.centerCircleRadius,
        pitchColor: props.pitchColor,
      })}
    </>
  );
}

// BackgroundGeneralLines function definition
function BackgroundGenenralLines(props: {
  lineColor: string;
  pitchLength: number;
  pitchWidth: number;
  pitchMargin: number;
  cornerArcRadius: number;
  centerCircleRadius: number;
  penaltyAreaWidth: number;
  penaltyAreaLength: number;
  goalAreaWidth: number;
  goalAreaLength: number;
  goalWidth: number;
  goalDepth: number;
  goalColor: string;
  penaltySpotDistance: number;
  pitchColor: string;
}) {
  const arcs = [
    { x: -props.pitchLength / 2, y: -props.pitchWidth / 2, rotation: 0 },
    { x: props.pitchLength / 2, y: -props.pitchWidth / 2, rotation: 90 },
    { x: -props.pitchLength / 2, y: props.pitchWidth / 2, rotation: -90 },
    { x: props.pitchLength / 2, y: props.pitchWidth / 2, rotation: 180 },
  ];

  return (
    <>
      {/* Outline margin Line */}
      <Line
        points={[
          -props.pitchLength / 2,
          -props.pitchWidth / 2,

          props.pitchLength / 2,
          -props.pitchWidth / 2,

          props.pitchLength / 2,
          props.pitchWidth / 2,

          -props.pitchLength / 2,
          props.pitchWidth / 2,

          -props.pitchLength / 2,

          -props.pitchWidth / 2,
        ]}
        stroke={props.lineColor ?? "white"}
        strokeWidth={props.pitchMargin}
      />
      {/* Corner Arcs */}
      {arcs.map((item, index) => {
        return (
          <Arc
            key={index}
            x={item.x}
            y={item.y}
            innerRadius={0}
            outerRadius={CORNER_ARC_R}
            stroke={props.lineColor ?? "white"}
            strokeWidth={props.pitchMargin}
            angle={90}
            rotation={item.rotation}
          />
        );
      })}
      {/* Center Circle Line */}
      <Circle
        x={0}
        y={0}
        radius={props.centerCircleRadius}
        stroke={props.lineColor ?? "white"}
        strokeWidth={props.pitchMargin}
      />
      {/* Vertical line in the center */}
      <Line
        points={[0, -props.pitchWidth / 2, 0, props.pitchWidth / 2]}
        stroke={props.lineColor ?? "white"}
        strokeWidth={props.pitchMargin}
      />
    </>
  );
}

// SideSpecificBackgroundLines function definition
function SideSpecificBackgroundLines(props: {
  side: string;
  lineColor: string;
  pitchMargin: number;
  pitchLength: number;
  pitchWidth: number;
  penaltyAreaWidth: number;
  penaltyAreaLength: number;
  goalAreaWidth: number;
  goalAreaLength: number;
  goalWidth: number;
  goalDepth: number;
  goalColor: string;
  penaltySpotDistance: number;
  centerCircleRadius: number;
  pitchColor: string;
}) {
  return (
    <>
      {/* Penalti Area */}
      <Line
        points={[
          props.side === "left"
            ? -props.pitchLength / 2
            : props.pitchLength / 2,
          -props.pitchWidth / 2 +
            (props.pitchWidth - props.penaltyAreaWidth) / 2,

          props.side === "left"
            ? -props.pitchLength / 2 + props.penaltyAreaLength
            : props.pitchLength / 2 - props.penaltyAreaLength,
          -props.pitchWidth / 2 +
            (props.pitchWidth - props.penaltyAreaWidth) / 2,

          props.side === "left"
            ? -props.pitchLength / 2 + props.penaltyAreaLength
            : props.pitchLength / 2 - props.penaltyAreaLength,
          -props.pitchWidth / 2 +
            (props.pitchWidth - props.penaltyAreaWidth) / 2 +
            props.penaltyAreaWidth,

          props.side === "left"
            ? -props.pitchLength / 2
            : props.pitchLength / 2,
          -props.pitchWidth / 2 +
            (props.pitchWidth - props.penaltyAreaWidth) / 2 +
            props.penaltyAreaWidth,
        ]}
        stroke={props.lineColor}
        strokeWidth={props.pitchMargin}
      />
      {/* Goal Area */}
      <Line
        points={[
          props.side === "left"
            ? -props.pitchLength / 2
            : props.pitchLength / 2,
          -props.goalAreaWidth / 2,

          props.side === "left"
            ? -props.pitchLength / 2 + props.goalAreaLength
            : props.pitchLength / 2 - props.goalAreaLength,

          -props.goalAreaWidth / 2,

          props.side === "left"
            ? -props.pitchLength / 2 + props.goalAreaLength
            : props.pitchLength / 2 - props.goalAreaLength,
          props.goalAreaWidth / 2,

          props.side === "left"
            ? -props.pitchLength / 2
            : props.pitchLength / 2,
          props.goalAreaWidth / 2,
        ]}
        stroke={props.lineColor}
        strokeWidth={props.pitchMargin}
      />
      {/* Goal */}
      <Rect
        x={
          props.side === "left"
            ? -props.pitchLength / 2 - 0.05
            : props.pitchLength / 2 + 0.05 + props.goalDepth
        }
        y={-props.goalWidth / 2}
        height={props.goalWidth}
        width={-props.goalDepth}
        fill={props.goalColor}
      />
      {/* Goal Arc TODO: i draw this arc in 3 steps (and with some "magic numbers"). There is probably a better way of doing this just with 'Arc'. Fix it.*/}
      <Arc
        x={
          props.side === "left"
            ? -props.pitchLength / 2 + props.penaltySpotDistance
            : props.pitchLength / 2 - props.penaltySpotDistance
        }
        y={0}
        innerRadius={0}
        outerRadius={props.centerCircleRadius}
        stroke={props.lineColor}
        strokeWidth={props.pitchMargin}
        angle={180}
        rotation={props.side === "left" ? 270 : 90}
      />
      <Rect
        x={
          props.side === "left"
            ? -props.pitchLength / 2 + props.penaltySpotDistance - 1
            : props.pitchLength / 2 - props.penaltySpotDistance - 5.45
        }
        y={-props.goalAreaWidth / 2 - 0.1}
        height={props.goalAreaWidth + 2.1}
        width={6.45}
        fill={props.pitchColor}
      />
      {/* Penalty Spot Point */}
      <Line
        points={[
          props.side === "left"
            ? props.penaltySpotDistance - props.pitchLength / 2
            : props.pitchLength / 2 - props.penaltySpotDistance,

          0,

          props.side === "left"
            ? props.penaltySpotDistance - props.pitchLength / 2
            : props.pitchLength / 2 - props.penaltySpotDistance,

          0.2,
        ]}
        stroke={props.lineColor}
        strokeWidth={props.pitchMargin + 0.1}
      />
      {/* Goal lateral point top TODO: these are kind of guessed. Check it out and fix it if necessary*/}
      <Line
        points={[
          props.side === "left"
            ? props.pitchMargin + 0.04 - props.pitchLength / 2
            : props.pitchMargin + 0.04 + props.pitchLength / 2 - 0.27,
          -props.goalWidth / 2 - 0.15,

          props.side === "left"
            ? props.pitchMargin + 0.04 - props.pitchLength / 2
            : props.pitchMargin + 0.04 + props.pitchLength / 2 - 0.27,
          -props.goalWidth / 2 + 0.15,

          props.side === "left"
            ? props.pitchMargin + 0.04 - props.pitchLength / 2
            : props.pitchMargin + 0.04 + props.pitchLength / 2 - 0.27,
          -props.goalWidth / 2 - 0.001,

          props.side === "left"
            ? props.pitchMargin - 0.1 - props.pitchLength / 2
            : props.pitchMargin - 0.07 + props.pitchLength / 2 - 0.3,
          -props.goalWidth / 2 - 0.001,

          props.side === "left"
            ? props.pitchMargin + 0.18 - props.pitchLength / 2
            : props.pitchMargin + 0.2 + props.pitchLength / 2 - 0.3,
          -props.goalWidth / 2 - 0.001,
        ]}
        stroke={props.goalColor}
        strokeWidth={0.1}
      />
      {/* Goal lateral point bottom TODO: these are kind of guessed. Check it out and fix it if necessary*/}
      <Line
        points={[
          props.side === "left"
            ? props.pitchMargin + 0.04 - props.pitchLength / 2
            : props.pitchMargin + 0.04 + props.pitchLength / 2 - 0.27,
          props.goalWidth / 2 - 0.15,

          props.side === "left"
            ? props.pitchMargin + 0.04 - props.pitchLength / 2
            : props.pitchMargin + 0.04 + props.pitchLength / 2 - 0.27,
          props.goalWidth / 2 + 0.15,

          props.side === "left"
            ? props.pitchMargin + 0.04 - props.pitchLength / 2
            : props.pitchMargin + 0.04 + props.pitchLength / 2 - 0.27,
          props.goalWidth / 2 - 0.001,

          props.side === "left"
            ? props.pitchMargin - 0.1 - props.pitchLength / 2
            : props.pitchMargin - 0.07 + props.pitchLength / 2 - 0.3,
          props.goalWidth / 2 - 0.001,

          props.side === "left"
            ? props.pitchMargin + 0.18 - props.pitchLength / 2
            : props.pitchMargin + 0.2 + props.pitchLength / 2 - 0.3,
          props.goalWidth / 2 - 0.001,
        ]}
        stroke={props.goalColor}
        strokeWidth={0.1}
      />
    </>
  );
}

// DrawAllEntities function definition
function DrawAllEntities(props: {
  playerRadius: number;
  allPlayersRef: any;
  allPlayersData: any;
  playerLeftColor: string;
  goalieLeftColor: string;
  playerRightColor: string;
  goalieRightColor: string;
  ballColor: string;
  ballRadius: number;
  ballRef: any;
  ballData: any;
}) {
  return (
    <>
      {DrawAllPlayers({
        radius: props.playerRadius,
        allPlayersRef: props.allPlayersRef,
        allPlayersData: props.allPlayersData,
        playerLeftColor: props.playerLeftColor,
        goalieLeftColor: props.goalieLeftColor,
        playerRightColor: props.playerRightColor,
        goalieRightColor: props.goalieRightColor,
      })}
      {DrawBall({
        color: props.ballColor,
        radius: props.ballRadius,
        ref: props.ballRef,
        initialX: props.ballData.stats_log[0].x,
        initialY: props.ballData.stats_log[0].y,
      })}
    </>
  );
}

// DrawAllPlayers function definition
function DrawAllPlayers(props: {
  radius: number;
  allPlayersRef: any[];
  allPlayersData: any[];
  playerLeftColor: string;
  goalieLeftColor: string;
  playerRightColor: string;
  goalieRightColor: string;
}) {
  return (
    <>
      {props.allPlayersData.map((player: any, index) => {
        return DrawPlayer({
          key: index,
          ref: props.allPlayersRef[index],
          radius: props.radius,
          color:
            player.side === "l"
              ? index === 0
                ? props.goalieLeftColor
                : props.playerLeftColor // if player side is left and player index on the json is 0, then it is the goalie of the left team //TODO: change from player index on json to player id (local to the team)
              : index === 11
              ? props.goalieRightColor
              : props.playerRightColor, // if player side IS NOT left and player index on the json is 11, then it is the goalie of the left team //TODO: change from player index on json to player id (local to the team)
          initialX: player.stats_log[0].x,
          initialY: player.stats_log[0].y,
          playerType: index === 1 || index === 12 ? "goalie" : "player",
          bodyAngle: player.stats_log[0].bodyAngle,
          neckAngle: player.stats_log[0].neckAngle,
          viewWidth: player.stats_log[0].viewWidth,
          outlineColor: player.stats_log[0].isKicking === 1 ? "white" : "black",
        });
      })}
    </>
  );
}

// DrawPlayer function definition
function DrawPlayer(props: {
  key: number;
  ref: any;
  radius: number;
  color: string;
  initialX: number;
  initialY: number;
  playerType: string;
  bodyAngle: number;
  neckAngle: number;
  viewWidth: number;
  outlineColor: string;
}) {
  return (
    <Group
      key={props.key}
      ref={props.ref}
      x={props.initialX}
      y={props.initialY}
      rotation={props.bodyAngle}
    >
      <Circle
        radius={props.radius}
        fill={props.color}
        strokeWidth={PLAYER_OUTLINE_WIDTH}
        stroke={props.outlineColor}
      />

      <Wedge radius={props.radius} fill={"black"} angle={180} />

      <Wedge
        radius={1}
        angle={props.viewWidth}
        rotation={props.neckAngle}
        stroke={VIEW_AREA_INDICATOR_LINE_COLOR}
        strokeWidth={VIEW_AREA_INDICATOR_LINE_WIDTH}
        height={7}
      />
    </Group>
  );
}

// DrawBall function definition
function DrawBall(props: {
  ref: any;
  radius: number;
  color: string;
  initialX: number;
  initialY: number;
}) {
  return (
    <>
      <Circle
        ref={props.ref}
        radius={props.radius}
        fill={props.color}
        x={props.initialX}
        y={props.initialY}
      />
    </>
  );
}
