import { useState } from "react";
import dynamic from "next/dynamic";
import {playersArray} from "../demoDataPlayers.js"
import {ballPositionArray} from "../demoDataBallPosition.js"
import Link from "next/link"
import { normalizeConfig } from "next/dist/next-server/server/config-shared";

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

const dataObject = {
  ball: ballPositionArray,
  players: playersArray
};

export default function Home() {
  if (typeof window !== "undefined") {
    const smallMonitorWidth = 700
    const smallMonitorHeight = 500
    const smallMonitorCenterViewScale = 6.2 
    const normalMonitorWidth = 1000 
    const normaMonitorHeight = 600
    const normalMonitorCenterViewScale = 8



    return (
      <div className="h-full bg-gray-20 ">

        {/* Top bar */}
        <div className="flex justify-between text-left p-4 text-4xl bg-white border-b-2 border-black mb-">
          <Link href="/">
            <div className="font-bold cursor-pointer">
              WebSoccerMonitor
            </div>
          </Link>
          <Link href="https://github.com/robocin/SoccerWebMonitor">
            <div className="text-gray-500 hover:text-black cursor-pointer">
              Github Repo
            </div>
          </Link>
        </div>

        {/* Welcome Banner */}
        <div className="flex bg-green-600">

          <div className="text-7xl text-left py-6 bg-green-90 w-7/12 flex justify-center">
            <div className="bg-green-800 p-4 ">
              <div className=" text-white">Welcome to the <span className="font-bold">WebSoccerMonitor</span> Envirnonment</div>
              <div className="shadow-2xl bg-white p-4 w-7/12 mt-6 text-xl text-left"><span className="font-bold">This project aims to be a simple way of visualising matches from RoboCup Leagues.{" "}</span>At the moment you can replay previous games by providing the log file of a 2D Simulation league match. In the near future, you'll be able to hook this envirnonment to a server running a game of any league and watch it in real time.</div>
            </div>
          </div>

          <div className="px-4 flex items-center">
            <div className="p-[15px] pb-[45px] flex justify-center items-center"> 
              <div className="w-full" style={{width: smallMonitorWidth, height: smallMonitorHeight}}>
                <Monitor2D
                  dataObject={dataObject}
                  windowWidth={smallMonitorWidth +5}
                  windowHeight={smallMonitorHeight}
                  showControls={false}
                  startPlaying={true}
                  centerViewScale={smallMonitorCenterViewScale}
                  lockCameraZoom={true}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Monitor Area */}
        <div className="mt-12 w-full flex justify-start px-6 h-[700px]">
          <div style={{width: normalMonitorWidth, height: normaMonitorHeight}}>
            <div className="w-full pb-4">No log provided.</div>
            <Monitor2D
              dataObject={dataObject}
              windowWidth={normalMonitorWidth +5}
              windowHeight={normaMonitorHeight}
              showControls={true}
              startPlaying={false}
              centerViewScale={normalMonitorCenterViewScale}
              lockCameraZoom={false}
            />
          </div>
          <div className="border-4 bg-gray-200 border-dashed border-gray-500 w-full ml-12 my-8 mt-14"></div>

        </div>
        <div className="w-full flex justify-center items-center h-screen bg-green-900">
          <div className="w-6/12 h-[500px] border-2 border-black bg-white shadow-2xl">

          </div>
        </div>


      </div>
    );
  } else {
    return <div >Loading...</div>;
  }
}
