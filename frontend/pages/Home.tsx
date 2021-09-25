import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";
import { defaultDataObject } from "../data/2D/2D_defaultDataObject";
import { default as demoMatch } from "../data/2D/2D_demoMatch.json";
import Link from "next/link";
import { AiFillFileAdd, AiOutlineLoading } from "react-icons/ai";

const BACKEND_PORT = 5002;

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
      className="text-xl flex flex-col justify-center items-center h-full px-20 text-gray-700"
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
    const smallMonitorWidth = 700;
    const smallMonitorHeight = 500;
    const smallMonitorCenterViewScale = 6.2;
    const normalMonitorWidth = 1000;
    const normaMonitorHeight = 600;
    const normalMonitorCenterViewScale = 8;

    const [showPlayerViewArea, setShowPlayerViewArea] = useState(true);

    const [dataObject, setDataObject] = useState(defaultDataObject);

    return (
      <div className="h-full bg-gray-100 ">
        {/* Top bar */}
        <div className="flex justify-between text-left p-4 text-4xl bg-white border-b-2 border-black mb-">
          <Link href="/">
            <div className="font-bold cursor-pointer">
              WebSoccerMonitor
              <span className="text-gray-400 text-xl"> 0.1</span>
            </div>
          </Link>
          <div className="flex">
            <Link href="https://github.com/robocin/SoccerWebMonitor">
              <div className="text-gray-500 pr-12 hover:text-black cursor-pointer">
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
        <div className="flex bg-green-600">
          <div className="text-7xl text-left py-6 bg-green-90 w-7/12 flex justify-center">
            <div className="bg-green-800 p-4 ">
              <div className=" text-white">
                Welcome to the{" "}
                <span className="font-bold">WebSoccerMonitor</span> Envirnonment
              </div>
              <div className="shadow-2xl bg-white p-4 w-8/12 mt-6 text-xl text-left">
                <span className="font-bold">
                  This{" "}
                  <Link href="https://github.com/robocin/SoccerWebMonitor">
                    <span className="bg-yellow-200 underline cursor-pointer">
                      Open Source project
                    </span>
                  </Link>{" "}
                  aims to be a simple yet powerful way of visualising matches
                  from RoboCup Soccer Leagues.{" "}
                </span>
                At the moment you can replay previous games by providing the log
                file of a 2D Simulation league match. In the near future, you'll
                be able to hook this envirnonment to a server running a game of
                any league and watch it in real time.
              </div>
            </div>
          </div>

          <div className="px-4 flex items-center">
            <div className="p-[15px] pb-[45px] flex justify-center items-center">
              <div
                className="w-full"
                style={{ width: smallMonitorWidth, height: smallMonitorHeight }}
              >
                <Monitor2D
                  dataObject={demoMatch}
                  maxNumberOfFrames={900}
                  windowWidth={smallMonitorWidth + 5}
                  windowHeight={smallMonitorHeight}
                  showControls={false}
                  startPlaying={true}
                  centerViewScale={smallMonitorCenterViewScale}
                  lockCameraZoom={true}
                  replayWhenReachesEnd={true}
                  showPlayerViewArea={showPlayerViewArea}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center my-6 ">
          <div className="bg-white shadow-2xl w-6/12 h-48 text-xl flex flex-wrap justify-center items-start border-2 border-gray-300">
            <div className="text-gray-500 font-bold mt-4">Tip:</div>
            <div>
              By default, no log file is selected. If you don't have any 2D
              league log file in the "*.rcg.gz" format in your computer, you can
              download one from
              <Link
                href={"https://archive.robocup.info/Soccer/Simulation/2D/logs/"}
              >
                <div>
                  <span className="underline cursor-pointer">
                    the RoboCup Archive
                  </span>{" "}
                  .
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Monitor Area */}
        <div className="my-12 w-full flex justify-between px-6 h-[700px]">
          <div
            style={{ width: normalMonitorWidth, height: normaMonitorHeight }}
          >
            <Monitor2D
              maxNumberOfFrames={dataObject.match.quantity_of_frames}
              dataObject={dataObject}
              windowWidth={normalMonitorWidth + 5}
              windowHeight={normaMonitorHeight}
              showControls={true}
              startPlaying={true}
              centerViewScale={normalMonitorCenterViewScale}
              lockCameraZoom={false}
              showPlayerViewArea={showPlayerViewArea}
            />
          </div>

          <div className="w-full ml-4 flex flex-wrap justify-center">
            <div className="w-11/12 h-2/6 bg-gray-300">
              <Dropzone setDataObject={setDataObject} />
            </div>
            <div>
              <div className="font-bold select-none">Options</div>
              <div
                className={` text-xl select-none`}
                onClick={() => setShowPlayerViewArea(!showPlayerViewArea)}
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
              <div className="text-base text-gray-400 w-60">
                Known bug: Options selection works only when game is being
                played (not paused)
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center h-full bg-green-900">
          <div className="m-4 w-6/12 h-[500px] border-2 border-black bg-white shadow-2xl flex flex-col p-12">
            <div className="flex justify-center items-center text-4xl font-bold mb-12">
              Made by{" "}
              <Link href="https://robocin.com.br">
                <img
                  className="w-24 inline-block cursor-pointer"
                  src="https://avatars.githubusercontent.com/u/29430108?s=280&v=4"
                />
              </Link>
              , inspired by{" "}
              <Link href="https://robocup.org">
                <img
                  className="w-48 inline-block cursor-pointer"
                  src="https://www.robocup.org/assets/admin/event-missing-196de6f5a822875bcb7dae3a5facd9ad34dc45c123ba218aabd2bef2e2e9634f.jpg"
                />
              </Link>
            </div>

            <div className="my-12  text-gray-600 text-2xl">Contributors:</div>
            <div className="h-full text-gray-600 text-xl flex justify-center items-center">
              Contribute to the project on GitHub and earn a place here for the
              logo of your team!
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
