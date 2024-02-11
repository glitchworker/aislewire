import { readFileSync } from 'node:fs'
import path from 'path'
import url from 'url'

import mime from 'mime'
import imageSize from 'image-size'
import roundPrecision from 'round-precision'

class Processor {
  constructor(options) {
    this.options = options || {};
    this.paths = {
      images_path: 'src/images',
      http_images_path: '../images',
    };
    Object.keys(this.paths).forEach((path) => {
      if (this.options[path]) {
        this.paths[path] = this.options[path]
      }
    })
  }

  asset_cache_buster = (http_path, real_path, done) => {
    if (typeof this.options.asset_cache_buster !== 'function') {
      throw new Error('asset_cache_buster should be a function')
    }
    let http_path_url = url.parse(http_path)
    let new_url
    this.options.asset_cache_buster(http_path, real_path, (value) => {
      if (typeof value === 'object') {
        const parsed_path = url.parse(value.path)
        new_url = {
          pathname: parsed_path.pathname,
          search: value.query || http_path_url.search,
        }
      } else {
        new_url = {
          pathname: http_path_url.pathname,
          search: value,
        }
      }
      done(url.format(new_url))
    })
  }

  asset_host = (filepath, done) => {
    if (typeof this.options.asset_host !== 'function') {
      throw new Error('asset_host should be a function')
    }
    this.options.asset_host(filepath, (host) => {
      done(url.resolve(host, filepath))
    })
  }

  real_path = (filepath, segment) => {
    const sanitized_filepath = filepath.replace(/(#|\?).+$/, '');
    return path.resolve(this.paths[segment + '_path'], sanitized_filepath)
  }

  http_path = (filepath, segment) => {
    return path.join(this.paths['http_' + segment + '_path'], filepath).replace(/\\/g, '/')
  }

  image_width = (filepath, done) => {
    done(imageSize(this.real_path(filepath, 'images')).width)
  }

  image_height = (filepath, done) => {
    done(imageSize(this.real_path(filepath, 'images')).height)
  }

  image_width_ratio = (filepath, done) => {
    const dimensions = imageSize(this.real_path(filepath, 'images'))
    done(roundPrecision(dimensions.width / dimensions.height * 100, 4))
  }

  image_height_ratio = (filepath, done) => {
    const dimensions = imageSize(this.real_path(filepath, 'images'))
    done(roundPrecision(dimensions.height / dimensions.width * 100, 4))
  }

  inline_image = (filepath, mime_type, done) => {
    const src = this.real_path(filepath, 'images')
    mime_type = mime_type || mime.getType(src)
    const data = readFileSync(src)
    done('data:' + mime_type + ';base64,' + data.toString('base64'))
  }

  asset_url = (filepath, segment, done) => {
    let http_path = this.http_path(filepath, segment)
    const real_path = this.real_path(filepath, segment)
    let fragmentIndex = http_path.indexOf('#')
    let fragment = ''
    if (fragmentIndex !== -1) {
      fragment = http_path.slice(fragmentIndex)
      http_path = http_path.slice(0, fragmentIndex)
    }
    const restoreFragment = (url) => {
      done(url + fragment)
    }
    const next = (http_path) => {
      if (this.options.asset_host) {
        this.asset_host(http_path, restoreFragment)
      } else {
        restoreFragment(http_path)
      }
    }
    if (this.options.asset_cache_buster) {
      this.asset_cache_buster(http_path, real_path, next)
    } else {
      next(http_path)
    }
  }

  image_url = (filepath, done) => {
    this.asset_url(filepath, 'images', done)
  }
}

export default Processor