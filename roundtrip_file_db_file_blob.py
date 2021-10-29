import os
import psycopg2
import shutil

from dbconfig import config


# based on:
# https://www.postgresqltutorial.com/postgresql-python/blob/


def create_table():
    # read database configuration
    params = config()
    # connect to the PostgresQL database
    conn = psycopg2.connect(**params)
    # create a new cursor object
    cur = conn.cursor()

    # execute queries to drop and create test table
    sql = """
        DROP TABLE IF EXISTS b3dm_test;
    """
    cur.execute(sql)

    sql = """
        CREATE TABLE b3dm_test (
            oid INTEGER PRIMARY KEY,
            b3dm_bytes BYTEA NOT NULL
        );
    """
    cur.execute(sql)

    # commit the changes to the database
    conn.commit()
    # close the communication with the PostgresQL database
    cur.close()
    conn.close()


def write_blob(oid, path_to_file):
    """ insert a BLOB into a table """
    # read data from b3dm file
    b3dm = open(path_to_file, "rb").read()
    # read database configuration
    params = config()
    # connect to the PostgresQL database
    conn = psycopg2.connect(**params)
    # create a new cursor object
    cur = conn.cursor()
    # execute the INSERT statement
    cur.execute(
        "INSERT INTO b3dm_test(oid, b3dm_bytes) VALUES (%s, %s)",
        [oid, psycopg2.Binary(b3dm)],
    )
    # commit the changes to the database
    conn.commit()
    print(f"inserted {oid}")
    # close the communication with the PostgresQL database
    cur.close()
    conn.close()


def read_blob(oid, path_to_dir):
    """ read BLOB data from a table """
    # read database configuration
    params = config()
    # connect to the PostgresQL database
    conn = psycopg2.connect(**params)
    # create a new cursor object
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
    with open(path_to_dir + str(blob_record[0]) + ".b3dm", "wb") as fh:
        fh.write(blob_record[1])
    # close the communication with the PostgresQL database
    cur.close()
    conn.close()
    print(f"read {oid}")


if __name__ == "__main__":
    print("Creating table in DB")
    create_table()

    script_folder = os.path.abspath(os.path.dirname(__file__))
    for n in range(0, 11):
        file_nm = os.path.join(script_folder, f"b3dm/data/data{n}.b3dm")
        print(f"Writing into DB: {file_nm}")
        write_blob(n, file_nm)

    out_folder = os.path.join(script_folder, "output/")
    print(f"Retrieving from DB into {out_folder}")
    # remove folder
    shutil.rmtree(out_folder)
    # make (empty) folder
    if not os.path.isdir(out_folder):
        os.mkdir(out_folder)
    # retrieve files from db into folder
    for n in range(0, 11):
        read_blob(n, out_folder)
    print("done.")
