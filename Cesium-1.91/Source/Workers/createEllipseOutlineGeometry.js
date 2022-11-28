/* This file is automatically rebuilt by the Cesium build process. */
define(['./Matrix2-48c16a80', './when-8166c7dd', './EllipseOutlineGeometry-0dfcffeb', './RuntimeError-ec3b0f53', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './GeometryOffsetAttribute-19e8bbd6', './Transforms-a91b6c40', './combine-ed18558d', './EllipseGeometryLibrary-0f0fd2b0', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './IndexDatatype-ed482b61'], (function (Matrix2, when, EllipseOutlineGeometry, RuntimeError, ComponentDatatype, WebGLConstants, GeometryOffsetAttribute, Transforms, combine, EllipseGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype) { 'use strict';

  function createEllipseOutlineGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseOutlineGeometry.EllipseOutlineGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Matrix2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Matrix2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseOutlineGeometry.EllipseOutlineGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseOutlineGeometry;

}));
