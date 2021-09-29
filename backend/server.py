import flask
from flask import Flask, make_response
import os
from flask.json import jsonify
import pandas as pd
import json
from flask_cors import CORS, cross_origin
import subprocess

TMP_DF = "./log.rcg"
QUANTITY_OF_PLAYERS_PER_TEAM = 11

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "hello world"

@app.route("/convert_rcg_to_csv", methods=['POST'])
def convert_rcg_to_csv():
    # recieve a *.rcg.gz file as an http request
    file = flask.request.files["file"]

    if file.filename == '':
        return "file is empty"
    elif not (file.filename.endswith(".rcg") or file.filename.endswith(".rcg.gz")):
        return "file is not of .rcg nor .rcg.gz type"
    else:
        # save to the filesystem and RENAME (Not extract it) to just *.rcg
        file.save("./log.rcg.gz")


    # unzip and run the log extractor on the folder where the *.rcg file is and put the result on the results folder (/log_csv)
    result = subprocess.run(['gzip', '-d', 'log.rcg.gz'], stdout=subprocess.PIPE)
    if result.returncode == 1: # if file is not in gzip format it means it was already extracted, so, rename it
        os.system("mv log.rcg.gz log.rcg")
    os.system("./rcss-log-extractor/bin/rcssLogExtractor --in . --out .")

    # open the .csv file and delete the .rcg one
    f = open("./log.rcg.csv")
    df = pd.read_csv(f)
    os.system("rm log.rcg")

    # create and populate dictionary that will be send back as a json string
    # df = df.head(n=100) # TODO: delete this line!
    time_range = len(df["show_time"])
    final_json = {
        "match":{
            # "quantity_of_frames": time_range, // this should be the line. however, 
            "quantity_of_frames": time_range-1,
            "game_state_log": [],
            "team_l_name": str(df["team_name_l"][0]),
            "team_r_name": str(df["team_name_r"][0]),
            "team_l_score": [],
            "team_r_score": []
        },
        "ball": {
            "stats_log": []
        },
        "players": []
    }

    for i in range(0, time_range):
        final_json["ball"]["stats_log"].append({"x": df["ball_x"][i], "y": df["ball_y"][i]})
        final_json["match"]["team_l_score"].append(int(df["team_score_l"][i]))
        final_json["match"]["team_r_score"].append(int(df["team_score_r"][i]))
        final_json["match"]["game_state_log"].append(str(df["playmode"][i]))

    for side in ["l","r"]:
        for i in range(0,QUANTITY_OF_PLAYERS_PER_TEAM):
            final_json["players"].append({ "id":i + (0 if side=="l" else 11), "side": side, "name": f"player_{side}{i+1}", "stats_log":[], "other_stats":[]}) 

            for time in range(0, time_range):
                is_kicking_in_this_frame = False
                if(time>0):
                    is_kicking_in_this_frame = int(df[f"player_{side}{i+1}_counting_kick"][time]) > int(df[f"player_{side}{i+1}_counting_kick"][time-1])
                final_json["players"][i + (0 if side=="l" else 11)]["stats_log"].append({
                    "x": float(df[f"player_{side}{i+1}_x"][time]), # x position of the palyer at the current time
                    "y": float(df[f"player_{side}{i+1}_y"][time]), # y position of the palyer at the current time
                    "bodyAngle": float(df[f"player_{side}{i+1}_body"][time]), # angle of the body at the current time
                    "neckAngle": float(df[f"player_{side}{i+1}_neck"][time]), # angle of the neck at the current time
                    "viewWidth": float(df[f"player_{side}{i+1}_view_width"][time]), # width of the player view at the current time
                    "countingKick": int(df[f"player_{side}{i+1}_counting_kick"][time]), # quantity of kicks of this player at the current time
                    "isKicking":1 if is_kicking_in_this_frame else 0 # quantity of kicks of this player at the current time
                    })




    os.system("rm log.rcg.csv")

    return json.dumps(final_json)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5002")
