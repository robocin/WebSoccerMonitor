export default function TopBar(props) {
  return (
    <div className="w-full h-[30px] flex">
      <div className="h-full w-full bg-yellow-300 flex justify-center items-center">
        Team L 0
      </div>
      <div className="h-full w-full bg-white flex justify-center items-center">
        {props.currentFrame}
      </div>{" "}
      <div className="h-full w-full bg-red-600 flex justify-center items-center">
        Team R 0
      </div>
    </div>
  );
}
