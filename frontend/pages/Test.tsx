import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { default as demoMatch } from "../data/2D/2D_demoMatch.json";
import { useState } from "react";

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

export default function Test() {
  if (typeof window !== "undefined") {
    return (
      <div>
        <div className="flex flex-wrap h-[300px]">
          <Monitor2D
            id={"1"}
            dataObject={demoMatch}
            maxNumberOfFrames={900}
            showControls={false}
            startPlaying={true}
            lockCameraZoom={false}
          />
        </div>
      </div>
    );
  } else {
    return <div>loading...</div>;
  }
}
