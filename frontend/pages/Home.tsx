import dynamic from "next/dynamic";
import {playersArray} from "../demoDataPlayers.js"
import {ballPositionArray} from "../demoDataBallPosition.js"

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

const MARGIN = 10;
const dataObject = {
  ball: ballPositionArray,
  players: playersArray
};

export default function Home() {
  if (typeof window !== "undefined") {
    const monitorWidth = window.innerWidth - MARGIN * 2 - 7;
    const monitorHeight = window.innerHeight - MARGIN * 2 - 120;

    return (
      <div className="h-full" style={{ padding: MARGIN }}>
        <div className="text-4xl">WebSoccerMonitor</div>
        <div className="border-2 border-black mt-12">
          <Monitor2D
            dataObject={dataObject}
            windowWidth={monitorWidth}
            windowHeight={monitorHeight}
          />
        </div>
      </div>
    );
  } else {
    return <div style={{ padding: MARGIN }}>Loading...</div>;
  }
}
