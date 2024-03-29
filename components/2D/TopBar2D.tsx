export default function TopBar(props: {
  team_l_name: string;
  team_r_name: string;
  currentFrame: number;
  team_l_score_log: any;
  team_r_score_log: any;
  game_state_log: any;
  topBarHeight: number;
}) {
  return (
    <div
      className={`w-full flex text-lg select-none text-xs tablet:text-base laptop-L:text-xl 4k:text-3xl h-[25px] 4k:h-[40px]`}
      // style={{ height: `${props.topBarHeight}px` }}
    >
      <div className="h-full w-full bg-yellow-300 flex justify-center items-center">
        {props.team_l_name} {props.team_l_score_log[props.currentFrame]}
      </div>
      <div className="h-full w-full bg-white flex justify-center items-center">
        {props.game_state_log[props.currentFrame]} {props.currentFrame}
      </div>
      <div className="h-full w-full bg-red-600 flex justify-center items-center">
        {props.team_r_name} {props.team_r_score_log[props.currentFrame]}
      </div>
    </div>
  );
}
