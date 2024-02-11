import * as sass from 'sass'
import Processor from './processor.js'

export default (options) => {
  const opts = options || {}
  const processor = new Processor(opts)
  return {
    'image-url($filename, $only_path: false)': (filename, only_path, done) => {
      processor.image_url(filename.getValue(), (url) => {
        if(!only_path.getValue()) url = 'url(\'' + url + '\')'
        done(new sass.types.String(url));
      });
    },
    'inline-image($filename, $mime_type: null)': (filename, mime_type, done) => {
      mime_type = mime_type instanceof sass.types.Null ? null : mime_type.getValue()
      processor.inline_image(filename.getValue(), mime_type, (dataUrl) => {
        done(new sass.types.String('url(\'' + dataUrl + '\')'))
      })
    },
    'image-width($filename, $prefix: true)': (filename, prefix, done) => {
      processor.image_width(filename.getValue(), (image_width) => {
        let string = prefix.getValue() ? 'px' : ''
        done(new sass.types.Number(image_width, string))
      })
    },
    'image-height($filename, $prefix: true)': (filename, prefix, done) => {
      processor.image_height(filename.getValue(), (image_height) => {
        let string = prefix.getValue() ? 'px' : ''
        done(new sass.types.Number(image_height, string))
      })
    },
    'image-width-ratio($filename)': (filename, done) => {
      processor.image_width_ratio(filename.getValue(), (image_width_ratio) => {
        done(new sass.types.Number(image_width_ratio, '%'))
      })
    },
    'image-height-ratio($filename)': (filename, done) => {
      processor.image_height_ratio(filename.getValue(), (image_height_ratio) => {
        done(new sass.types.Number(image_height_ratio, '%'))
      })
    }
  }
}