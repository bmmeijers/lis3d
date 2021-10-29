Retrieved from pakhuis as follows:

$ wget http://pakhuis.tudelft.nl:8080/edu/cesium7/Apps/SampleData/cadastral3/tileset7/tileset.json
$ mkdir data
$ cd data
$ for i in {0..10}; do wget http://pakhuis.tudelft.nl:8080/edu/cesium7/Apps/SampleData/cadastral3/tileset7/data/data$i.b3dm; done;
