import dynamic from "next/dynamic";

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

const MARGIN = 10;
const dataObject = {
  ball: {
    position: [
      { x: 0, y: -20 },
      { x: 1, y: -20 },
      { x: 2, y: -20 },
      { x: 3, y: -20 },
      { x: 4, y: -20 },
      { x: 5, y: -20 },
      { x: 6, y: -20 },
      { x: 7, y: -20 },
      { x: 8, y: -20 },
      { x: 9, y: -20 },
      { x: 10, y: -20 },
      { x: 11, y: -20 },
      { x: 12, y: -20 },
      { x: 13, y: -20 },
      { x: 14, y: -20 },
    ],
  },

  players: [
    {
      id: 0,
      side: "rigth",
      position: [
        { x: 10, y: 0 },
        { x: 11, y: 0 },
        { x: 12, y: 0 },
        { x: 13, y: 0 },
        { x: 14, y: 0 },
        { x: 15, y: 0 },
        { x: 16, y: 0 },
        { x: 17, y: 0 },
        { x: 18, y: 0 },
        { x: 19, y: 0 },
        { x: 20, y: 0 },
        { x: 21, y: 0 },
        { x: 22, y: 0 },
        { x: 23, y: 0 },
        { x: 24, y: 0 },
      ],
    },

    {
      id: 1,
      side: "left",
      position: [
        { x: -10, y: 0 },
        { x: -11, y: 0 },
        { x: -12, y: 0 },
        { x: -13, y: 0 },
        { x: -14, y: 0 },
        { x: -15, y: 0 },
        { x: -16, y: 0 },
        { x: -17, y: 0 },
        { x: -18, y: 0 },
        { x: -19, y: 0 },
        { x: -20, y: 0 },
        { x: -21, y: 0 },
        { x: -22, y: 0 },
        { x: -23, y: 0 },
        { x: -24, y: 0 },
      ],
    },

    {
      id: 2,
      side: "right",
      position: [
        { x: 10, y: -10 },
        { x: 11, y: -10 },
        { x: 12, y: -10 },
        { x: 13, y: -10 },
        { x: 14, y: -10 },
        { x: 15, y: -10 },
        { x: 16, y: -10 },
        { x: 17, y: -10 },
        { x: 18, y: -10 },
        { x: 19, y: -10 },
        { x: 20, y: -10 },
        { x: 21, y: -10 },
        { x: 22, y: -10 },
        { x: 23, y: -10 },
        { x: 24, y: -10 },
      ],
    },

    {
      id: 3,
      side: "left",
      position: [
        { x: -10, y: -10 },
        { x: -11, y: -10 },
        { x: -12, y: -10 },
        { x: -13, y: -10 },
        { x: -14, y: -10 },
        { x: -15, y: -10 },
        { x: -16, y: -10 },
        { x: -17, y: -10 },
        { x: -18, y: -10 },
        { x: -19, y: -10 },
        { x: -20, y: -10 },
        { x: -21, y: -10 },
        { x: -22, y: -10 },
        { x: -23, y: -10 },
        { x: -24, y: -10 },
      ],
    },
  ],
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
