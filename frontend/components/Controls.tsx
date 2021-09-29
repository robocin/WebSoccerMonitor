import React from "react";
import centerView from "../functions/CenterView";
import { GrBackTen, GrForwardTen } from "react-icons/gr";

export default function Controls2D(props: {
  endGameFrame: number;
  currentFrame: number;
  setCurrentFrame: Function;
  isPlaying: boolean;
  setIsPlaying: Function;
  setCenterView: Function;
}) {
  return (
    <div className="select-none">
      <div className="">
        <div className="flex justify-center items-center">
          <div className="">0</div>
          <input
            id="showtimeSlider"
            type="range"
            min="0"
            max={props.endGameFrame}
            step={1}
            value={props.currentFrame}
            className="w-full text-center appearance-none bg-green-900 h-2 rounded-full m-2 "
            onChange={(e) =>
              handleShowtimeSliderInput({
                value: parseInt(e.target.value),
                setPlay: props.setIsPlaying,
                setShowtime: props.setCurrentFrame,
              })
            }
          />

          <div className="">{props.endGameFrame}</div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-8">
        <GrBackTen
          onClick={() =>
            props.setCurrentFrame((oldFrame) =>
              oldFrame > 10 ? oldFrame - 10 : 0
            )
          }
          className="mx-2 text-3xl cursor-pointer"
        />
        <GrForwardTen
          onClick={() =>
            props.setCurrentFrame((oldFrame) =>
              oldFrame < props.endGameFrame - 10
                ? oldFrame + 10
                : props.endGameFrame
            )
          }
          className="mx-2 text-3xl cursor-pointer"
        />
        <div
          id="play-stop-button"
          className="bg-green-900 text-white px-1 flex justify-center items-center cursor-pointer mx-1 border-2 font-bold border-black"
          onClick={() => props.setIsPlaying(!props.isPlaying)}
        >
          Play/Stop
        </div>

        <div
          className="bg-green-900 text-white px-1 flex justify-center items-center cursor-pointer mx-1 border-2 font-bold border-black"
          onClick={() => props.setCenterView(true)}
        >
          Center View
        </div>
      </div>
    </div>
  );
}

// handle showtime slider input
function handleShowtimeSliderInput(props) {
  props.setPlay(false);
  props.setShowtime(props.value);
}
