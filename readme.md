# what is this?

A small web application that can connect to a Postgres + PostGIS database and produce 3D tiles (both hierarchy and data) for use in Cesium.

# getting started

To get some 3D data in Postgres you can follow the following steps:

Downloaded a tile of 3D BAG data from 3dbag.nl in geopackage format (gpkg). The tile downloaded/used in the following: <https://3dbag.nl/en/download?tid=5910> (tile around TU Delft).

The geopackage file contains multiple tables/layers (note, the .gpkg file can be directly loaded inside QGIS to visualize the contents). 

Convert the 3D layer with LOD 2.2 into PostGIS dump format, with the help of ogr2ogr:

```
$ ogr2ogr --config PG_USE_COPY YES -f PGDump out.dmp 3dbag_v210908_fd2cee53_5910.gpkg -sql "SELECT * FROM lod22_3d" -nln "b3dm_lod22_3d" -lco SCHEMA=[dbuser]
```

Then, load the postgis dump file into Postgres, leading to a table 'b3dm_lod22_3d', where the 3D geometry is stored as multipolygonz, with coordinate reference system EPSG:7415:

```
$ psql -d [database_name] -h [database_host] -f out.dmp
```

Perform a coordinate transformation inside the database to go from EPSG:7415 (RD+NAP) to EPSG:4978 (WGS'84 ECEF, what Cesium expects), with sql, leading to a new table in the database:

```
create table b3dm_lod22_3d_epsg4978 as select gid, st_transform(geometrie, 4978) as geom4978 from b3dm_lod22_3d;
```

### Running the web service

After loading the data, fix the settings in database.ini for your local database set up.

Then set up a virtualenv (inside the lis3d folder).

```
$ python3 -m venv env
$ source env/bin/activate
$ python3 -m pip install -r requirements.txt
```

After installing the requirements, you should be able to start the Flask web service

```
$ python3 serve.py
```

Now connect with a webbrowser to the service running on your own laptop:

<http://127.0.0.1:5000>

A web page should show up, displaying the version of the Postgres database to which the service is connected.

This page contains a link to:

<http://127.0.0.1:5000/ui/>

This loads Cesium, and after a while the loaded tile with buildings should show inside Cesium.