import flask
from flask import Flask
import os
import pandas as pd
import json

TMP_DF = "./log.rcg"
QUANTITY_OF_PLAYERS_PER_TEAM = 11

app = Flask(__name__)

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
    os.system("gzip -d log.rcg.gz ")
    os.system("./rcss-log-extractor/bin/rcssLogExtractor --in . --out .")

    # open the .csv file and delete the .rcg one
    f = open("./log.rcg.csv")
    df = pd.read_csv(f)
    os.system("rm log.rcg")

    # create dictionary that will be send back as a json string
    # df = df.head(n=2) # TODO: delete this line!
    final_json = {
        "ball": {
            "stats_log": []
        },
        "players": []
    }


    # populate dictionary with data
    time_range = len(df["show_time"])
    print(time_range)

    for i in range(0, time_range):
        final_json["ball"]["stats_log"].append({"x": df["ball_x"][i], "y": df["ball_y"][i]})

    for side in ["l","r"]:
        for i in range(0,QUANTITY_OF_PLAYERS_PER_TEAM):
            final_json["players"].append({ "id":i + (0 if side=="l" else 11), "side": side, "name": f"player_{side}{i+1}", "stats_log":[]}) 
            for time in range(0, time_range):
                player_x_in_the_current_time = df[f"player_{side}{i+1}_x"][time]
                player_y_in_the_current_time = df[f"player_{side}{i+1}_y"][time]
                final_json["players"][i + (0 if side=="l" else 11)] ["stats_log"].append({"x": player_x_in_the_current_time, "y": player_y_in_the_current_time })


    os.system("rm log.rcg.csv")

    return json.dumps(final_json)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5002")
