import React from "react";
import centerView from "../../functions/CenterView";

export default function Controls2D(props: {
  endGameFrame: number;
  currentFrame: number;
  setCurrentFrame: Function;
  isPlaying: boolean;
  setIsPlaying: Function;
  setCenterView: Function;
}) {
  return (
    <div className="h-20 w-full flex flex-wrap justify-center items-start py-0 z-10 select-none">
      <div className="w-full relative flex justify-center">
        <div className="absolute border-t-2 border-white w-[97%] top-6">
          <div className="absolute -bottom-12 w-full flex justify-between font-bold">
            <div className="transform -translate-x-1.5">0</div>
            <div className="transform translate-x-2.5">
              {props.endGameFrame}
            </div>
          </div>
        </div>
        <input
          id="showtimeSlider"
          type="range"
          min="0"
          max={props.endGameFrame}
          step="1"
          value={props.currentFrame}
          className="w-full text-center appearance-none bg-gray-500 h-8 rounded-full m-2 "
          onChange={(e) =>
            handleShowtimeSliderInput({
              value: parseInt(e.target.value),
              setPlay: props.setIsPlaying,
              setShowtime: props.setCurrentFrame,
            })
          }
        ></input>
      </div>

      <div className="w-full flex justify-center z-20">
        <div
          className="bg-black text-white px-1 flex justify-center items-center rounded-md cursor-pointer mx-1"
          onClick={() => props.setIsPlaying(!props.isPlaying)}
        >
          Play/Stop
        </div>

        <div
          className="bg-black text-white px-1 flex justify-center items-center rounded-md cursor-pointer mx-1"
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
