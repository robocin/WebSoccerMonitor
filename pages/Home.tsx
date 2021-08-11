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
        <div className="p-12">Top of the page</div>
        <div className="border-2 border-black p-1">
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
