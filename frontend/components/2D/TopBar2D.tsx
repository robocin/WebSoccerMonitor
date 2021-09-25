export default function TopBar(props: {team_l_name: string; team_r_name: string; currentFrame: number; team_l_score_log: any; team_r_score_log: any; game_state_log: any}) {
  return (
    <div className="w-full h-[25px] flex text-lg">
      <div className="h-full w-full bg-yellow-300 flex justify-center items-center">
        {props.team_l_name}{" "}{props.team_l_score_log[props.currentFrame]}
      </div>
      <div className="h-full w-full bg-white flex justify-center items-center">
        {props.game_state_log[props.currentFrame]}{" "}{props.currentFrame}
      </div>
      <div className="h-full w-full bg-red-600 flex justify-center items-center">
        {props.team_r_name}{" "}{props.team_r_score_log[props.currentFrame]}
      </div>
    </div>
  );
}
