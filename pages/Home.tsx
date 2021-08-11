import dynamic from "next/dynamic";

const Monitor2D = dynamic(() => import("../components/2D/Monitor2D"), {
  ssr: false,
});

const MARGIN = 10;
const dataObject = {
  ball: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 0 },
  ],
  players: [
    {
      id: 0,
      position: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 5, y: 0 },
        { x: 6, y: 0 },
        { x: 7, y: 0 },
        { x: 8, y: 0 },
        { x: 9, y: 0 },
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
        { x: 25, y: 0 },
        { x: 26, y: 0 },
        { x: 27, y: 0 },
      ],
    },
    {
      id: 1,
      position: [
        { x: 0, y: 0 },
        { x: -1, y: 0 },
        { x: -2, y: 0 },
        { x: -3, y: 0 },
        { x: -4, y: 0 },
        { x: -5, y: 0 },
        { x: -6, y: 0 },
        { x: -7, y: 0 },
        { x: -8, y: 0 },
        { x: -9, y: 0 },
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
        { x: -25, y: 0 },
        { x: -26, y: 0 },
        { x: -27, y: 0 },
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
