/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-8166c7dd', './FrustumGeometry-2cdad4a3', './Transforms-a91b6c40', './Matrix2-48c16a80', './RuntimeError-ec3b0f53', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './combine-ed18558d', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './Plane-d604146d', './VertexFormat-36162c59'], (function (when, FrustumGeometry, Transforms, Matrix2, RuntimeError, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, Plane, VertexFormat) { 'use strict';

  function createFrustumGeometry(frustumGeometry, offset) {
    if (when.defined(offset)) {
      frustumGeometry = FrustumGeometry.FrustumGeometry.unpack(frustumGeometry, offset);
    }
    return FrustumGeometry.FrustumGeometry.createGeometry(frustumGeometry);
  }

  return createFrustumGeometry;

}));
