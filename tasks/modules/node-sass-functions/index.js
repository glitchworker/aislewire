const sass = require('node-sass');
const Processor = require('./processor');

module.exports = function(options) {
  const opts = options || {};
  const processor = new Processor(opts);
  return {
    'image-url($filename, $only_path: false)': function(filename, only_path, done) {
      processor.image_url(filename.getValue(), function(url) {
        if(!only_path.getValue()) url = 'url(\'' + url + '\')';
        done(new sass.types.String(url));
      });
    },
    'inline-image($filename, $mime_type: null)': function(filename, mime_type, done) {
      mime_type = mime_type instanceof sass.types.Null ? null : mime_type.getValue();
      processor.inline_image(filename.getValue(), mime_type, function(dataUrl) {
        done(new sass.types.String('url(\'' + dataUrl + '\')'));
      });
    },
    'image-width($filename)': function(filename, done) {
      processor.image_width(filename.getValue(), function(image_width) {
        done(new sass.types.Number(image_width, 'px'));
      });
    },
    'image-height($filename)': function(filename, done) {
      processor.image_height(filename.getValue(), function(image_height) {
        done(new sass.types.Number(image_height, 'px'));
      });
    },
    'image-width-ratio($filename)': function(filename, done) {
      processor.image_width_ratio(filename.getValue(), function(image_width_ratio) {
        done(new sass.types.Number(image_width_ratio, '%'));
      });
    },
    'image-height-ratio($filename)': function(filename, done) {
      processor.image_height_ratio(filename.getValue(), function(image_height_ratio) {
        done(new sass.types.Number(image_height_ratio, '%'));
      });
    }
  };
};