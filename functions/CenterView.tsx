// function to center the view
export default function centerView(props: {
  stageRef: any;
  defaultScaleValue: number;
}) {
  // TODO: try to put this declaration outside of the main component.
  const stage = props.stageRef.current;
  const scale = props.defaultScaleValue;

  stage.scale({ x: scale, y: scale });

  stage.position({
    x: stage.width() / 2 - 4,
    y: stage.height() / 2,
  });

  stage.batchDraw();
}
