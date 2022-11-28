/* This file is automatically rebuilt by the Cesium build process. */
define(['./CylinderGeometry-dee1a8b4', './when-8166c7dd', './GeometryOffsetAttribute-19e8bbd6', './RuntimeError-ec3b0f53', './Transforms-a91b6c40', './Matrix2-48c16a80', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './combine-ed18558d', './CylinderGeometryLibrary-611ba5d7', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './IndexDatatype-ed482b61', './VertexFormat-36162c59'], (function (CylinderGeometry, when, GeometryOffsetAttribute, RuntimeError, Transforms, Matrix2, ComponentDatatype, WebGLConstants, combine, CylinderGeometryLibrary, GeometryAttribute, GeometryAttributes, IndexDatatype, VertexFormat) { 'use strict';

  function createCylinderGeometry(cylinderGeometry, offset) {
    if (when.defined(offset)) {
      cylinderGeometry = CylinderGeometry.CylinderGeometry.unpack(cylinderGeometry, offset);
    }
    return CylinderGeometry.CylinderGeometry.createGeometry(cylinderGeometry);
  }

  return createCylinderGeometry;

}));
