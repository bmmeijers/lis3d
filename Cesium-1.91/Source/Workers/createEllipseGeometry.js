/* This file is automatically rebuilt by the Cesium build process. */
define(['./Matrix2-48c16a80', './when-8166c7dd', './EllipseGeometry-1af0b809', './RuntimeError-ec3b0f53', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './GeometryOffsetAttribute-19e8bbd6', './Transforms-a91b6c40', './combine-ed18558d', './EllipseGeometryLibrary-0f0fd2b0', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './GeometryInstance-97dae403', './GeometryPipeline-d53b53f4', './AttributeCompression-b90e9889', './EncodedCartesian3-316be0be', './IndexDatatype-ed482b61', './IntersectionTests-ef21c31d', './Plane-d604146d', './VertexFormat-36162c59'], (function (Matrix2, when, EllipseGeometry, RuntimeError, ComponentDatatype, WebGLConstants, GeometryOffsetAttribute, Transforms, combine, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, GeometryInstance, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, VertexFormat) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Matrix2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Matrix2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

}));
