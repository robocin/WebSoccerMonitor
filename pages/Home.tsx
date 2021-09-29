import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";
import { defaultDataObject } from "../data/2D/2D_defaultDataObject";
import { default as demoMatch } from "../data/2D/2D_demoMatch.json";
import Link from "next/link";
import { AiFillFileAdd, AiOutlineLoading } from "react-icons/ai";

// const BACKEND_URL = `http://localhost:5002`;
const BACKEND_URL = `http://2549-186-226-191-138.ngrok.io`;
const DEFAULT_TIME_BETWEEN_FRAMES = 130; //TODO: refactor/ this const value should be in Monitor2D

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

export default function Home() {
  if (typeof window !== "undefined") {
    return (
      <div className="h-full w-full bg-gray-100 ">
        {/* Top bar */}
        <Topbar />
        {/* Welcome Banner */}
        <WelcomeBanner />
        {/* Monitor Area */}
        <MonitorArea />
        {/* Footer */}
        {/* TODO: fix the responsivity problem that happens if you remove the line below*/}
        <WorkAroundResponsivityProblem />
        <Footer />
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

// Definition of functions

function Topbar() {
  return (
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
  );
}

function WelcomeBanner() {
  return (
    <div className="flex justify-between bg-green-600 py-2 laptop:py-6 4k:py-12">
      <div className="text-white bg-green-900 text-left px-3 py-2 laptop:w-6/12 4k:p-5">
        <div className="tablet:text-4xl 4k:text-8xl laptop-L:text-5xl">
          Welcome to the{" "}
          <div className="font-bold text-3xl tablet:text-5xl laptop-L:text-6xl 4k:text-9xl">
            WebSoccerMonitor
          </div>{" "}
          Environment
        </div>
        <div className="shadow-2xl bg-white text-left text-black text-sm tablet:text-lg tablet:w-7/12 laptop:w-10/12 laptop-L:w-8/12 laptop-L:text-xl laptop:mb-6 4k:text-4xl my-2 p-2 4k:p-4">
          <span className="font-bold">
            This{" "}
            <Link href="https://github.com/robocin/SoccerWebMonitor">
              <span className="bg-yellow-200 underline cursor-pointer">
                Open Source project
              </span>
            </Link>{" "}
            aims to be a simple yet powerful way of visualising matches from
            RoboCup Soccer Leagues.{" "}
          </span>
          At the moment you can replay previous games by providing the log file
          of a 2D Simulation league match. In the near future, you'll be able to
          hook this envirnonment to a server running a game of any league and
          watch it in real time.
        </div>
      </div>
      <div className=" w-7/12 flex justify-center">
        <div className="w-10/12 hidden laptop:block">
          <Monitor2D
            id={"Monitor2DInstance_1"}
            maxNumberOfFrames={900}
            timeBetweenFrames={130}
            dataObject={demoMatch}
            showControls={false}
            startPlaying={true}
            lockCameraZoom={true}
            showPlayerViewArea={true}
            playerViewAreaSize={5}
          />
        </div>
      </div>
    </div>
  );
}

function MonitorArea() {
  const [showPlayerViewArea, setShowPlayerViewArea] = useState(true);
  const [timeBetweenFrames, setTimeBetweenFrames] = useState(
    DEFAULT_TIME_BETWEEN_FRAMES
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playerViewAreaSize, setPlayerViewAreaSize] = useState(5); //TODO: we should get the default value for this useState from the 2DMonitor file (from the const), and not set it with a "magic number" here. TODO: fix this

  const [dataObject, setDataObject] = useState(defaultDataObject);

  return (
    // Tip
    // TODO: this TipCard component should be refactored to enable re-usability
    <div>
      <div className="w-full flex justify-center my-6 ">
        <div className="bg-white shadow-2xl w-full mx-2 tablet:w-6/12 h-48 text-base laptop:text-xl 4k:text-3xl 4k:h-64 4k:px-12 px-4 flex flex-wrap justify-center items-start border-2 border-gray-300">
          <div className="text-gray-500 font-bold mt-4 4k:text-4xl ">Tip:</div>
          <div>
            By default, no log file is selected. If you don't have any 2D league
            log file in the "*.rcg.gz" format in your computer, you can download
            one from{" "}
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

      {/* Monitor, upload and controls */}
      <div className="mb-32 my-12 flex flex-wrap laptop:flex-nowrap justify-center px-6 h-[700px]">
        <div className="w-full mb-32 laptop-L:mb-12 h-72 mobile-M:h-86 tablet:h-5/6 4k:h-[1200px]">
          <Monitor2D
            id={"Monitor2DInstance_2"}
            maxNumberOfFrames={dataObject.match.quantity_of_frames}
            timeBetweenFrames={timeBetweenFrames}
            playbackSpeed={playbackSpeed}
            dataObject={dataObject}
            showControls={true}
            startPlaying={true}
            lockCameraZoom={false}
            showPlayerViewArea={showPlayerViewArea}
            playerViewAreaSize={playerViewAreaSize}
          />
        </div>

        <div className="laptop:w-5/12 px-2">
          {/* <div className="w-f"> */}
          <div className="hidden laptop:block w-full px-4 h-72 mb-4">
            <Dropzone setDataObject={setDataObject} />
          </div>

          <div className="w-full mb-8 laptop:mt-24 4k:mt-52 flex flex-wrap justify-center items-start">
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
                className="-top-20 4k:-top-44 text-base 4k:text-2xl text-transparent w-60 duration-150 hidden absolute"
              >
                Known bug: This option works only when game is being played (not
                paused)
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
}

function Dropzone(props: { setDataObject: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    async function sendFileAndGetResponse() {
      var formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);
      const response = await fetch(`${BACKEND_URL}/convert_rcg_to_csv`, {
        method: "POST",
        body: formdata,
      });
      const jsonResponse = await response.json();
      props.setDataObject(jsonResponse);
      console.log(jsonResponse)
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
      className="w-full h-full text-base tablet:text-xl 4k:text-4xl flex flex-col justify-center items-center p-4 tablet:px-2 text-gray-700 bg-gray-300"
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

function Footer() {
  return (
    <div className="w-full mt-12 flex flex-wrap justify-center items-center h-full bg-green-900 ">
      <div className="m-4 w-11/12 h-[500px] border-2 border-black bg-white shadow-2xl flex flex-col p-1 tablet:p-12">
        <div className="flex flex-wrap justify-center items-center text-base tablet:text-4xl 4k:text-7xl font-bold mb-12">
          Made by{" "}
          <Link href="https://robocin.com.br">
            <img
              className="w-20 tablet:w-24 4k:w-32 inline-block cursor-pointer"
              src="https://avatars.githubusercontent.com/u/29430108?s=280&v=4"
            />
          </Link>
          ,
          <div className="flex justify-center items-center pl-4">
            inspired by{" "}
            <Link href="https://robocup.org">
              <img
                className="w-40 4k:w-60 inline-block cursor-pointer"
                src="https://www.robocup.org/assets/admin/event-missing-196de6f5a822875bcb7dae3a5facd9ad34dc45c123ba218aabd2bef2e2e9634f.jpg"
              />
            </Link>
          </div>
        </div>

        <div className="my-12  text-gray-600 text-2xl 4k:text-5xl">
          Contributors:
        </div>
        <div className="h-full text-gray-600 text-xl 4k:text-4xl flex justify-center items-center">
          Contribute to the project on GitHub and earn a place here for the logo
          of your team!
        </div>
      </div>
    </div>
  );
}

function WorkAroundResponsivityProblem() {
  return (
    <div className="invisible">
      <div className=" hidden  4k:block ">
        <Footer />
      </div>
      <div className="hidden tablet:block laptop:hidden ">
        <div>...</div>
        <div>...</div>
        <div>...</div>
        <div>...</div>
        <div>...</div>
        <div>...</div>
      </div>
    </div>
  );
}
