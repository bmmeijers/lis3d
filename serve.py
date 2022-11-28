# based on: https://gist.github.com/vulcan25/55ce270d76bf78044d067c51e23ae5ad
from psycopg2 import pool

import time

import numpy as np

import wkb_utils
import gltf
import batch_table
import b3dm

from flask import Flask, g, jsonify, Response, url_for, send_from_directory

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
        db = g.pop("db", None)
        if db is not None:
            print("Closing DbConnection")
            app.config["postgreSQL_pool"].putconn(db)


    @app.route("/Cesium-1.91/<path:name>")
    def ui(name):
        # FIXME: 
        # in a production setting the contents of this folder should be served 
        # by a 'real' webserver, like nginx or apache
        return send_from_directory("Cesium-1.91", name, as_attachment=False)

    @app.route("/ui/")
    def cesium_ui():
        return Response("""<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Use correct character set. -->
    <meta charset="utf-8" />
    <!-- Tell IE to use the latest, best version. -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- Make the application on mobile take up the full browser screen and disable user scaling. -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
    />
    <title>Hello World!</title>
    <script src="/Cesium-1.91/Build/Cesium/Cesium.js"></script>
    <style>
      @import url(/Cesium-1.91/Build/Cesium/Widgets/widgets.css);
      html,
      body,
      #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script>
        const viewer = new Cesium.Viewer("cesiumContainer");
        let tileset = new Cesium.Cesium3DTileset({
            url: '/dbtiles/tileset.json',
            backFaceCulling : false // also show wrongly oriented faces
        });

        var scene = viewer.scene;

        viewer.scene.primitives.add (
            tileset
        );

        tileset.readyPromise.then(
            function(tileset) 
            {
                viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(1.5, -0.4, tileset.boundingSphere.radius * 3.0));
                // Override the default home button = reset to location of tileset instead of to world globe
                viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
                    function (e) {
                        e.cancel = true;
                        viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(1.5, -0.4, tileset.boundingSphere.radius * 3.0));
                    }
                );
            }
        )
        .otherwise(function(error) { console.log(error); } );

    </script>
  </body>
</html>""")


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
    <h1>Index</h1>
    <p>This is a dynamic HTML file served up by Flask</p>
    <p>It is connected to {result[0][0]}</p>
    <ul>
    <li><a href="{url_for('cesium_ui')}">Cesium</a></li>
    <!--<li><a href="{url_for('dbtiles_tileset')}">{url_for('dbtiles_tileset')}</a></li>-->
    </ul>

</body>

</html>"""
        return result

    @app.route("/dbtiles/tileset.json")
    def dbtiles_tileset():
        # FIXME:
        # - embed relevant parts of 'arrays2tileset' function of py3dtiles here
        #   for serializing bounding boxes of nodes/extents (also in Y-up coordinate system)
        #   but this will require a 'tileset table' / metadata inside the database which tiles there are
        #   and for each tile you then need to have its boundingvolume and 'screen space error'
        # - make it possible to access multiple datasets (dataset name should be part of the route)
        # - maybe even make it possible to retrieve tilesets in parts (tilesets refer to other tilesets), if tileset becomes huge
        contents = {
            "asset": {"version": "1.0"},
            "geometricError": 500,
            "root": {
                "boundingVolume": {
                    "box": [
                        0.0,
                        11.007,
                        0.0,
                        292.547,
                        0,
                        0,
                        0,
                        314.658,
                        0,
                        0,
                        0,
                        215.476,
                    ]
                },
                "geometricError": 500,
                "children": [
                    {
                        "boundingVolume": {
                            "box": [
                                0.0,
                                11.007,
                                0.0,
                                292.547,
                                0,
                                0,
                                0,
                                314.658,
                                0,
                                0,
                                0,
                                215.476,
                            ]
                        },
                        "geometricError": 250.0,
                        "children": [],
                        "refine": "ADD", # should be capitalized!
                        "content": {"uri": url_for('dbtiles_one_tile')},
                    }
                ],
                "refine": "ADD",
                "transform": [
                    1.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    1.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    1.0,
                    0.0,
                    3923193.03,
                    299976.288,
                    5003107.883,
                    1.0,
                ],
            },
        }
        return jsonify(contents)

    @app.route("/dbtiles/1.b3dm")
    def dbtiles_one_tile():
        start_time = time.time()
        conn = get_db()
        cur = conn.cursor()
        # FETCH GEOMETRY FOR A TILE
        # FIXME:
        # - add more attributes (and see how this changes with 3D Tiles Next)
        id_column_name = "gid"
        column_name = "geom4978"
        table_name = "b3dm_lod22_3d_epsg4978"

        print("Loading data from database...")
        sql = "SELECT ST_3dExtent({0}) FROM {1}".format(column_name, table_name)
        print(sql)
        cur.execute(sql)
        extent = cur.fetchall()[0][0]
        extent = [m.split(" ") for m in extent[6:-1].split(",")]
        offset = [(float(extent[1][0]) + float(extent[0][0])) / 2,
                (float(extent[1][1]) + float(extent[0][1])) / 2,
                (float(extent[1][2]) + float(extent[0][2])) / 2]
        print(offset)

        id_statement = ""
        if id_column_name is not None:
            id_statement = "," + id_column_name
        cur.execute("SELECT ST_AsBinary(ST_RotateX(ST_Translate({0}, {1}, {2}, {3}), -pi() / 2))"
                    " {5} FROM {4} "
                    # " WHERE gid = 1372430 "
                    " ORDER BY ST_Area(ST_Force2D({0})) DESC"
                    # " LIMIT 100"
                    .format(column_name, -offset[0], -offset[1], -offset[2],
                            table_name, id_statement))
        res = cur.fetchall()
        #print(res)
        wkbs = [t[0] for t in res]
        # print(wkbs)

        #print(wkbs)
        ids = None
        if id_column_name is not None:
            ids = [t[1] for t in res]
        # print(ids)
        # response = Response("", mimetype="application/octet-stream")
        # return response
        transform = np.array([
            [1, 0, 0, offset[0]],
            [0, 1, 0, offset[1]],
            [0, 0, 1, offset[2]],
            [0, 0, 0, 1]], dtype=float)
        transform = transform.flatten('F')

        ## TRIANGULATE SURFACES AND CREATE NORMALS
        # taken from wkbs2tileset in py3dtiles
        geoms = [wkb_utils.TriangleSoup.from_wkb_multipolygon(wkb) for wkb in wkbs]
        positions = [ts.getPositionArray() for ts in geoms]
        normals = [ts.getNormalArray() for ts in geoms]
        bboxes = [ts.getBbox() for ts in geoms]

        ## SERIALIZE (GLTF / B3DM encoding)
        #indices = [i for i in range(len(positions))]
        identity = np.identity(4).flatten('F')
        binarrays = []
        gids = []
        for pos in range(len(positions)):
            # pos = index
            binarrays.append({
                'position': positions[pos],
                'normal': normals[pos],
                'bbox': [[float(i) for i in j] for j in bboxes[pos]],
            })
            if ids is not None:
                gids.append(ids[pos])
        gltf_instance = gltf.GlTF.from_binary_arrays(binarrays, identity)
        bt = None
        if ids is not None:
            bt = batch_table.BatchTable()
            bt.add_property_from_array("id", gids)
        b3dm_array = b3dm.B3dm.from_glTF(gltf_instance, bt).to_array()
        duration = time.time() - start_time
        print(f"Tile generation took {duration:.4f} secs")
        ## RESPONSE
        response = Response(bytes(b3dm_array), mimetype="application/octet-stream")
        return response

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
