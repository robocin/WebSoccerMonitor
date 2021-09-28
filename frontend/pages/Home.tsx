import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";
import { defaultDataObject } from "../data/2D/2D_defaultDataObject";
import { default as demoMatch } from "../data/2D/2D_demoMatch.json";
import Link from "next/link";
import { AiFillFileAdd, AiOutlineLoading } from "react-icons/ai";

const BACKEND_PORT = 5002;
const DEFAULT_TIME_BETWEEN_FRAMES = 130;

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

function Dropzone(props: { setDataObject: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    async function sendFileAndGetResponse() {
      var formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);
      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/convert_rcg_to_csv`,
        {
          method: "POST",
          body: formdata,
        }
      );
      const jsonResponse = await response.json();
      props.setDataObject(jsonResponse);
      setIsProcessing(false);
    }
    setIsProcessing(true);
    sendFileAndGetResponse();
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full h-full text-base tablet:text-xl 4k:text-4xl flex flex-col justify-center items-center p-4 tablet:px-20 text-gray-700 bg-gray-300"
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-wrap justify-center">
          <div className="w-full">Processing</div>
          <AiOutlineLoading className="text-3xl mt-6 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {isDragActive ? (
            <p className="w-full">Drop the log file here ...</p>
          ) : (
            <p>
              Drag and drop a *.rcg.gz log file here, or click to select one
              locally
            </p>
          )}

          <AiFillFileAdd className="text-6xl mt-4 text-gray-600 transform hover:scale-105 duration-300 cursor-pointer" />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  if (typeof window !== "undefined") {
    const normalMonitorWidth = 1000;
    const normaMonitorHeight = 600;

    const [showPlayerViewArea, setShowPlayerViewArea] = useState(true);
    const [timeBetweenFrames, setTimeBetweenFrames] = useState(
      DEFAULT_TIME_BETWEEN_FRAMES
    );
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [playerViewAreaSize, setPlayerViewAreaSize] = useState(5); //TODO: we should get the default value for this useState from the 2DMonitor file (from the const), and not set it with a "magic number" here. TODO: fix this

    const [dataObject, setDataObject] = useState(defaultDataObject);

    return (
      <div className="h-full w-full bg-gray-100 ">
        {/* Top bar */}
        <div className="flex justify-between text-left p-4 text-base tablet:text-2xl 4k:text-6xl 4k:py-6 bg-white border-b-2 border-black w-full">
          <Link href="/">
            <div className="font-bold cursor-pointer">
              WebSoccerMonitor
              <span className="text-gray-400 tablet:text-xl"> 0.1</span>
            </div>
          </Link>
          <div className="flex">
            <Link href="https://github.com/robocin/SoccerWebMonitor">
              <div className="text-gray-500 px-3 tablet:pr-12 hover:text-black cursor-pointer">
                Docs
              </div>
            </Link>

            <Link href="https://github.com/robocin/SoccerWebMonitor">
              <div className="text-gray-500 hover:text-black cursor-pointer">
                Github Repo
              </div>
            </Link>
          </div>
        </div>
        {/* Welcome Banner */}

        {/* Tip Card */}
        <div className="w-full flex justify-center my-6 ">
          <div className="bg-white shadow-2xl w-full mx-2 tablet:w-6/12 h-48 text-base laptop:text-xl 4k:text-3xl 4k:h-64 4k:px-12 px-4 flex flex-wrap justify-center items-start border-2 border-gray-300">
            <div className="text-gray-500 font-bold mt-4 4k:text-4xl ">
              Tip:
            </div>
            <div>
              By default, no log file is selected. If you don't have any 2D
              league log file in the "*.rcg.gz" format in your computer, you can
              download one from{" "}
              <Link
                href={"https://archive.robocup.info/Soccer/Simulation/2D/logs/"}
              >
                <span>
                  <span className="underline cursor-pointer">
                    the RoboCup Archive
                  </span>{" "}
                </span>
              </Link>
              , or{" "}
              <span
                onClick={() => setDataObject(demoMatch)}
                className="underline cursor-pointer bg-yellow-200"
              >
                click here
              </span>{" "}
              to use a demo log file.
            </div>
          </div>
        </div>

        {/* Monitor Area */}
        <div className=" my-12 flex flex-wrap laptop:flex-nowrap justify-center px-6 h-[700px]">
          <div className="w-full mb-32 laptop-L:mb-12 h-72 mobile-M:h-86 tablet:h-5/6 4k:h-[1000px]">
            <Monitor2D
              id={"Monitor2DInstance_2"}
              maxNumberOfFrames={dataObject.match.quantity_of_frames}
              timeBetweenFrames={timeBetweenFrames}
              playbackSpeed={playbackSpeed}
              dataObject={dataObject}
              showControls={true}
              startPlaying={true}
              lockCameraZoom={true}
              showPlayerViewArea={showPlayerViewArea}
              playerViewAreaSize={playerViewAreaSize}
            />
          </div>

          <div className="w-5/12 4k:w-6/12">
            <div className="hidden laptop:block w-full px-4 h-72 mb-4">
              <Dropzone setDataObject={setDataObject} />
            </div>

            <div className="w-full px-4 mb-12 flex flex-wrap justify-center items-start">
              {/*TODO: Ideally, all options should be inside the controls file. TODO: it is probably a good idea to refactor this. */}
              <div className="flex text-base tablet:text-xl 4k:text-4xl relative flex-wrap justify-center items-start">
                <div className="font-bold select-none w-full">Options</div>
                <div
                  className={`select-none`}
                  onClick={() => setShowPlayerViewArea(!showPlayerViewArea)}
                  onMouseEnter={() => {
                    document
                      .getElementById("known_bug_message")
                      .classList.add("text-gray-400");

                    document
                      .getElementById("known_bug_message")
                      .classList.remove("text-transparent");
                    document
                      .getElementById("known_bug_message")
                      .classList.remove("hidden");
                  }}
                  onMouseLeave={() => {
                    document
                      .getElementById("known_bug_message")
                      .classList.add("hidden");
                    document
                      .getElementById("known_bug_message")
                      .classList.add("text-transparent");

                    document
                      .getElementById("known_bug_message")
                      .classList.remove("text-gray-400");
                  }}
                >
                  Show PlayerViewArea{" "}
                  <span
                    className={`font-bold cursor-pointer ${
                      showPlayerViewArea ? "text-green-600" : "text-red-900"
                    }`}
                  >
                    {showPlayerViewArea ? "ON" : "OFF"}
                  </span>
                </div>

                <div
                  id="known_bug_message"
                  className="-top-20 text-base text-transparent w-60 duration-150 hidden absolute"
                >
                  Known bug: This option works only when game is being played
                  (not paused)
                </div>

                {/* TODO: the following two blocks of code below are very similar, because they share the same structure. It should be a separete component that is just imported here passing arguments. TODO: do this */}
                {showPlayerViewArea && (
                  <div className="w-full my-2 select-none">
                    PlayerViewArea Size
                    {[2, 3, 4, 5, 7].map((item, index) => {
                      return (
                        <span
                          key={index}
                          onClick={() => {
                            setPlayerViewAreaSize(item);
                          }}
                          className={`mx-2 px-2 font-bold border-black border-2 ${
                            playerViewAreaSize === item
                              ? "bg-gray-400"
                              : "bg-transparent"
                          } hover:bg-gray-400 duration-300 cursor-pointer`}
                        >
                          {item}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="w-full my-2 select-none">
                  Playback Speed
                  {[0.5, 1, 2, 4].map((item, index) => {
                    return (
                      <span
                        key={index}
                        onClick={() => {
                          setPlaybackSpeed(item);
                          setTimeBetweenFrames(
                            DEFAULT_TIME_BETWEEN_FRAMES / item
                          );

                          document.getElementById("play-stop-button").click();

                          // TODO: this is a workaround to stop and the play the game. I'm clicking the button 'play/stop' by getting it's id, then clicking one time, waiting 10 ms and clicking one more time. TODO: refactor this. (a hint is that all controls should probably be inside the control.tsx file)
                          setTimeout(function () {
                            document.getElementById("play-stop-button").click();
                          }, 10);
                        }}
                        className={`mx-2 px-2 font-bold border-black border-2 ${
                          playbackSpeed === item
                            ? "bg-gray-400"
                            : "bg-transparent"
                        } hover:bg-gray-400 duration-300 cursor-pointer`}
                      >
                        {item}x
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className=" laptop:hidden">
            <Dropzone setDataObject={setDataObject} />
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
