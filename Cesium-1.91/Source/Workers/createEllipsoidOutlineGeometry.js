/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-8166c7dd', './EllipsoidOutlineGeometry-c922fc31', './GeometryOffsetAttribute-19e8bbd6', './RuntimeError-ec3b0f53', './Transforms-a91b6c40', './Matrix2-48c16a80', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './combine-ed18558d', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './IndexDatatype-ed482b61'], (function (when, EllipsoidOutlineGeometry, GeometryOffsetAttribute, RuntimeError, Transforms, Matrix2, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, IndexDatatype) { 'use strict';

  function createEllipsoidOutlineGeometry(ellipsoidGeometry, offset) {
    if (when.defined(ellipsoidGeometry.buffer)) {
      ellipsoidGeometry = EllipsoidOutlineGeometry.EllipsoidOutlineGeometry.unpack(
        ellipsoidGeometry,
        offset
      );
    }
    return EllipsoidOutlineGeometry.EllipsoidOutlineGeometry.createGeometry(ellipsoidGeometry);
  }

  return createEllipsoidOutlineGeometry;

}));
