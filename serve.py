# based on: https://gist.github.com/vulcan25/55ce270d76bf78044d067c51e23ae5ad
import os
import json

import psycopg2
from psycopg2 import pool

from flask import Flask, g, jsonify, Response
import werkzeug

from dbconfig import config


def get_db():
    print("Getting DbConnection")
    if "db" not in g:
        g.db = app.config["postgreSQL_pool"].getconn()
    return g.db


def create_app():
    app = Flask(__name__)

    conn_params = config()
    app.config["postgreSQL_pool"] = pool.SimpleConnectionPool(
        1,
        20,
        user=conn_params["user"],
        password=conn_params["password"],
        host=conn_params["host"],
        port=conn_params["port"],
        database=conn_params["database"],
    )

    @app.teardown_appcontext
    def close_conn(e):
        print("Closing DbConnection")
        db = g.pop("db", None)
        if db is not None:
            app.config["postgreSQL_pool"].putconn(db)

    @app.route("/")
    def index():
        print("Index route")
        db = get_db()
        cursor = db.cursor()
        cursor.execute("select postgis_full_version();")
        result = cursor.fetchall()
        cursor.close()
        
        result = f"""<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Index</title>
</head>

<body>
  <h1 style="color: blue">Index</h1>
  <p>This is an HTML file served up by Flask</p>
  <p>It is connected to {result[0][0]}</p>
  <p>
    <ul>
        <li><a href="/tileset.json">tileset.json</a></li>
        <li><a href="/data/data1.b3dm">data1.b3dm</a></li>
    </ul>
  </p>
</body>

</html>"""
        return result

    @app.route("/tileset.json")
    def tileset():
        # open the tileset from the filesystem
        # and send it as json to the client
        script_folder = os.path.abspath(os.path.dirname(__file__))
        file_nm = os.path.join(script_folder, f"b3dm/tileset.json")
        with open(file_nm) as fh:
            contents = json.loads(fh.read())
        return jsonify(contents)

    @app.route("/b3dm_test")
    def b3dm():
        conn = get_db()
        cur = conn.cursor()
        # execute the SELECT statement
        cur.execute(
            """
        SELECT
            oid, b3dm_bytes
        FROM
            b3dm_test
        WHERE
            oid = %s
        """,
            [1],
        )
        blob_record = cur.fetchone()
        return Response(blob_record[1].tobytes(), mimetype="application/octet-stream")

    @app.route("/data/data<int:oid>.b3dm")
    def b3dm_by_oid(oid):
        # Batched 3D Model tiles use the .b3dm extension and application/octet-stream MIME type.
        conn = get_db()
        cur = conn.cursor()
        # execute the SELECT statement
        cur.execute(
            """
        SELECT
            oid, b3dm_bytes
        FROM
            b3dm_test
        WHERE
            oid = %s
        """,
            [oid],
        )
        blob_record = cur.fetchone()
        return Response(blob_record[1].tobytes(), mimetype="application/octet-stream")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
