/* This file is automatically rebuilt by the Cesium build process. */
define(['./arrayRemoveDuplicates-8aa05a3d', './Transforms-a91b6c40', './Matrix2-48c16a80', './RuntimeError-ec3b0f53', './ComponentDatatype-9c5a06cd', './CoplanarPolygonGeometryLibrary-14fb79ea', './when-8166c7dd', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './GeometryInstance-97dae403', './GeometryPipeline-d53b53f4', './IndexDatatype-ed482b61', './PolygonGeometryLibrary-516b5bc0', './combine-ed18558d', './WebGLConstants-7dccdc96', './OrientedBoundingBox-0c4e9bcf', './EllipsoidTangentPlane-e87970b1', './AxisAlignedBoundingBox-f8eef3e4', './IntersectionTests-ef21c31d', './Plane-d604146d', './AttributeCompression-b90e9889', './EncodedCartesian3-316be0be', './ArcType-0cf52f8c', './EllipsoidRhumbLine-18e41c26', './PolygonPipeline-5c0805be'], (function (arrayRemoveDuplicates, Transforms, Matrix2, RuntimeError, ComponentDatatype, CoplanarPolygonGeometryLibrary, when, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryPipeline, IndexDatatype, PolygonGeometryLibrary, combine, WebGLConstants, OrientedBoundingBox, EllipsoidTangentPlane, AxisAlignedBoundingBox, IntersectionTests, Plane, AttributeCompression, EncodedCartesian3, ArcType, EllipsoidRhumbLine, PolygonPipeline) { 'use strict';

  function createGeometryFromPositions(positions) {
    const length = positions.length;
    const flatPositions = new Float64Array(length * 3);
    const indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 2);

    let positionIndex = 0;
    let index = 0;

    for (let i = 0; i < length; i++) {
      const position = positions[i];
      flatPositions[positionIndex++] = position.x;
      flatPositions[positionIndex++] = position.y;
      flatPositions[positionIndex++] = position.z;

      indices[index++] = i;
      indices[index++] = (i + 1) % length;
    }

    const attributes = new GeometryAttributes.GeometryAttributes({
      position: new GeometryAttribute.GeometryAttribute({
        componentDatatype: ComponentDatatype.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: flatPositions,
      }),
    });

    return new GeometryAttribute.Geometry({
      attributes: attributes,
      indices: indices,
      primitiveType: GeometryAttribute.PrimitiveType.LINES,
    });
  }

  /**
   * A description of the outline of a polygon composed of arbitrary coplanar positions.
   *
   * @alias CoplanarPolygonOutlineGeometry
   * @constructor
   *
   * @param {Object} options Object with the following properties:
   * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
   *
   * @see CoplanarPolygonOutlineGeometry.createGeometry
   *
   * @example
   * const polygonOutline = new Cesium.CoplanarPolygonOutlineGeometry({
   *   positions : Cesium.Cartesian3.fromDegreesArrayHeights([
   *      -90.0, 30.0, 0.0,
   *      -90.0, 30.0, 1000.0,
   *      -80.0, 30.0, 1000.0,
   *      -80.0, 30.0, 0.0
   *   ])
   * });
   * const geometry = Cesium.CoplanarPolygonOutlineGeometry.createGeometry(polygonOutline);
   */
  function CoplanarPolygonOutlineGeometry(options) {
    options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);
    const polygonHierarchy = options.polygonHierarchy;
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("options.polygonHierarchy", polygonHierarchy);
    //>>includeEnd('debug');

    this._polygonHierarchy = polygonHierarchy;
    this._workerName = "createCoplanarPolygonOutlineGeometry";

    /**
     * The number of elements used to pack the object into an array.
     * @type {Number}
     */
    this.packedLength =
      PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(polygonHierarchy) + 1;
  }

  /**
   * A description of a coplanar polygon outline from an array of positions.
   *
   * @param {Object} options Object with the following properties:
   * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
   * @returns {CoplanarPolygonOutlineGeometry}
   */
  CoplanarPolygonOutlineGeometry.fromPositions = function (options) {
    options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("options.positions", options.positions);
    //>>includeEnd('debug');

    const newOptions = {
      polygonHierarchy: {
        positions: options.positions,
      },
    };
    return new CoplanarPolygonOutlineGeometry(newOptions);
  };

  /**
   * Stores the provided instance into the provided array.
   *
   * @param {CoplanarPolygonOutlineGeometry} value The value to pack.
   * @param {Number[]} array The array to pack into.
   * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
   *
   * @returns {Number[]} The array that was packed into
   */
  CoplanarPolygonOutlineGeometry.pack = function (value, array, startingIndex) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.typeOf.object("value", value);
    RuntimeError.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = when.defaultValue(startingIndex, 0);

    startingIndex = PolygonGeometryLibrary.PolygonGeometryLibrary.packPolygonHierarchy(
      value._polygonHierarchy,
      array,
      startingIndex
    );

    array[startingIndex] = value.packedLength;

    return array;
  };

  const scratchOptions = {
    polygonHierarchy: {},
  };
  /**
   * Retrieves an instance from a packed array.
   *
   * @param {Number[]} array The packed array.
   * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
   * @param {CoplanarPolygonOutlineGeometry} [result] The object into which to store the result.
   * @returns {CoplanarPolygonOutlineGeometry} The modified result parameter or a new CoplanarPolygonOutlineGeometry instance if one was not provided.
   */
  CoplanarPolygonOutlineGeometry.unpack = function (
    array,
    startingIndex,
    result
  ) {
    //>>includeStart('debug', pragmas.debug);
    RuntimeError.Check.defined("array", array);
    //>>includeEnd('debug');

    startingIndex = when.defaultValue(startingIndex, 0);

    const polygonHierarchy = PolygonGeometryLibrary.PolygonGeometryLibrary.unpackPolygonHierarchy(
      array,
      startingIndex
    );
    startingIndex = polygonHierarchy.startingIndex;
    delete polygonHierarchy.startingIndex;
    const packedLength = array[startingIndex];

    if (!when.defined(result)) {
      result = new CoplanarPolygonOutlineGeometry(scratchOptions);
    }

    result._polygonHierarchy = polygonHierarchy;
    result.packedLength = packedLength;

    return result;
  };

  /**
   * Computes the geometric representation of an arbitrary coplanar polygon, including its vertices, indices, and a bounding sphere.
   *
   * @param {CoplanarPolygonOutlineGeometry} polygonGeometry A description of the polygon.
   * @returns {Geometry|undefined} The computed vertices and indices.
   */
  CoplanarPolygonOutlineGeometry.createGeometry = function (polygonGeometry) {
    const polygonHierarchy = polygonGeometry._polygonHierarchy;

    let outerPositions = polygonHierarchy.positions;
    outerPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(
      outerPositions,
      Matrix2.Cartesian3.equalsEpsilon,
      true
    );
    if (outerPositions.length < 3) {
      return;
    }
    const isValid = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.validOutline(outerPositions);
    if (!isValid) {
      return undefined;
    }

    const polygons = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(
      polygonHierarchy,
      false
    );

    if (polygons.length === 0) {
      return undefined;
    }

    const geometries = [];

    for (let i = 0; i < polygons.length; i++) {
      const geometryInstance = new GeometryInstance.GeometryInstance({
        geometry: createGeometryFromPositions(polygons[i]),
      });
      geometries.push(geometryInstance);
    }

    const geometry = GeometryPipeline.GeometryPipeline.combineInstances(geometries)[0];
    const boundingSphere = Transforms.BoundingSphere.fromPoints(polygonHierarchy.positions);

    return new GeometryAttribute.Geometry({
      attributes: geometry.attributes,
      indices: geometry.indices,
      primitiveType: geometry.primitiveType,
      boundingSphere: boundingSphere,
    });
  };

  function createCoplanarPolygonOutlineGeometry(polygonGeometry, offset) {
    if (when.defined(offset)) {
      polygonGeometry = CoplanarPolygonOutlineGeometry.unpack(
        polygonGeometry,
        offset
      );
    }
    polygonGeometry._ellipsoid = Matrix2.Ellipsoid.clone(polygonGeometry._ellipsoid);
    return CoplanarPolygonOutlineGeometry.createGeometry(polygonGeometry);
  }

  return createCoplanarPolygonOutlineGeometry;

}));
