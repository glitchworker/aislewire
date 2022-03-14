const fs = require('fs');
const path = require('path');
const url = require('url');

const mime = require('mime');
const imageSize = require('image-size');
const roundPrecision = require('round-precision');

const Processor = function(options) {
  this.options = options || {};
  this.paths = {
    images_path: 'src/images',
    http_images_path: '../images',
  };
  let path;
  for(path in this.paths) {
    if(this.options[path]) {
      this.paths[path] = this.options[path];
    }
  }
};

Processor.prototype.asset_cache_buster = function(http_path, real_path, done) {
  if (typeof this.options.asset_cache_buster !== 'function') {
    throw new Error('asset_cache_buster should be a function');
  }
  let http_path_url = url.parse(http_path), new_url;
  this.options.asset_cache_buster(http_path, real_path, function(value) {
    if (typeof value == 'object') {
      const parsed_path = url.parse(value.path);
      new_url = {
        pathname: parsed_path.pathname,
        search: value.query || http_path_url.search
      };
    } else {
      new_url = {
        pathname: http_path_url.pathname,
        search: value
      };
    }
    done(url.format(new_url));
  });
};

Processor.prototype.asset_host = function(filepath, done) {
  if (typeof this.options.asset_host !== 'function') {
    throw new Error('asset_host should be a function');
  }
  this.options.asset_host(filepath, function(host) {
    done(url.resolve(host, filepath));
  });
};

Processor.prototype.real_path = function(filepath, segment) {
  const sanitized_filepath = filepath.replace(/(#|\?).+$/, '');
  return path.resolve(this.paths[segment + '_path'], sanitized_filepath);
};

Processor.prototype.http_path = function(filepath, segment) {
  return path.join(this.paths['http_' + segment + '_path'], filepath).replace(/\\/g, '/');
};

Processor.prototype.image_width = function(filepath, done) {
  done(imageSize(this.real_path(filepath, 'images')).width);
};

Processor.prototype.image_height = function(filepath, done) {
  done(imageSize(this.real_path(filepath, 'images')).height);
};

Processor.prototype.image_width_ratio = function(filepath, done) {
  const width = imageSize(this.real_path(filepath, 'images')).width;
  const height = imageSize(this.real_path(filepath, 'images')).height;
  done(roundPrecision(width / height * 100, 4));
};

Processor.prototype.image_height_ratio = function(filepath, done) {
  const width = imageSize(this.real_path(filepath, 'images')).width;
  const height = imageSize(this.real_path(filepath, 'images')).height;
  done(roundPrecision(height / width * 100, 4));
};

Processor.prototype.inline_image = function(filepath, mime_type, done) {
  const src = this.real_path(filepath, 'images');
  mime_type = mime_type || mime.getType(src);
  const data = fs.readFileSync(src);
  done('data:' + mime_type + ';base64,' + data.toString('base64'));
};

Processor.prototype.asset_url = function(filepath, segment, done) {
  const http_path = sanitized_http_path = this.http_path(filepath, segment);
  const real_path = this.real_path(filepath, segment);
  const fragmentIndex = sanitized_http_path.indexOf('#'), fragment = '';
  if (~fragmentIndex) {
    fragment = sanitized_http_path.substring(fragmentIndex);
    sanitized_http_path = sanitized_http_path.substring(0, fragmentIndex);
  }
  const restoreFragment = function(url) {
    done(url + fragment);
  };
  const next = function(http_path) {
    if (this.options.asset_host) {
      this.asset_host(http_path, restoreFragment);
    } else {
      restoreFragment(http_path);
    }
  }.bind(this);
  if (this.options.asset_cache_buster) {
    this.asset_cache_buster(sanitized_http_path, real_path, next);
  } else {
    next(sanitized_http_path);
  }
};

Processor.prototype.image_url = function(filepath, done) {
  this.asset_url(filepath, 'images', done);
};

module.exports = Processor;