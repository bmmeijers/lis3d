/* This file is automatically rebuilt by the Cesium build process. */
define(['./PrimitivePipeline-a08f4644', './createTaskProcessorWorker', './Transforms-a91b6c40', './Matrix2-48c16a80', './RuntimeError-ec3b0f53', './when-8166c7dd', './ComponentDatatype-9c5a06cd', './WebGLConstants-7dccdc96', './combine-ed18558d', './GeometryAttribute-6ac0bf83', './GeometryAttributes-50becc99', './GeometryPipeline-d53b53f4', './AttributeCompression-b90e9889', './EncodedCartesian3-316be0be', './IndexDatatype-ed482b61', './IntersectionTests-ef21c31d', './Plane-d604146d', './WebMercatorProjection-6244f98c'], (function (PrimitivePipeline, createTaskProcessorWorker, Transforms, Matrix2, RuntimeError, when, ComponentDatatype, WebGLConstants, combine, GeometryAttribute, GeometryAttributes, GeometryPipeline, AttributeCompression, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, WebMercatorProjection) { 'use strict';

  function combineGeometry(packedParameters, transferableObjects) {
    const parameters = PrimitivePipeline.PrimitivePipeline.unpackCombineGeometryParameters(
      packedParameters
    );
    const results = PrimitivePipeline.PrimitivePipeline.combineGeometry(parameters);
    return PrimitivePipeline.PrimitivePipeline.packCombineGeometryResults(
      results,
      transferableObjects
    );
  }
  var combineGeometry$1 = createTaskProcessorWorker(combineGeometry);

  return combineGeometry$1;

}));
