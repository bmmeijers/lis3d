/* This file is automatically rebuilt by the Cesium build process. */
define(['./BoxGeometry-e5fdfc06', './when-8166c7dd', './GeometryOffsetAttribute-19e8bbd6', './RuntimeError-ec3b0f53', './Transforms-a91b6c40', './Matrix2-48c16a80', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './combine-ed18558d', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './VertexFormat-36162c59'], (function (BoxGeometry, when, GeometryOffsetAttribute, RuntimeError, Transforms, Matrix2, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, VertexFormat) { 'use strict';

  function createBoxGeometry(boxGeometry, offset) {
    if (when.defined(offset)) {
      boxGeometry = BoxGeometry.BoxGeometry.unpack(boxGeometry, offset);
    }
    return BoxGeometry.BoxGeometry.createGeometry(boxGeometry);
  }

  return createBoxGeometry;

}));
