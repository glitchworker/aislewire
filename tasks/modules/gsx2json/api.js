var request = require('request');
var fs = require('fs');

module.exports = function (req, res, next) {
  var id = req.query.id || '1sOQfS0pqxG4RkiSrWzf12yHKod0oqPEDStWM-hQxpks';
  var sheet = req.query.sheet || 1;
  var query = req.query.q || '';
  var useIntegers = req.query.integers || true;
  var showRows = req.query.rows || true;
  var showColumns = req.query.columns || true;
  var fileOutput = req.query.output || true;
  var url = 'https://spreadsheets.google.com/feeds/list/' + id + '/' + sheet + '/public/values?alt=json';

  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(response.body);
      var responseObj = {};
      var rows = [];
      var columns = {};
      if (data && data.feed && data.feed.entry) {
        for (var i = 0; i < data.feed.entry.length; i++) {
          var entry = data.feed.entry[i];
          var keys = Object.keys(entry);
          var newRow = {};
          var queried = false;
          for (var j = 0; j < keys.length; j++) {
            var gsxCheck = keys[j].indexOf('gsx$');
            if (gsxCheck > -1) {
              var key = keys[j];
              var name = key.substring(4);
              var content = entry[key];
              var value = content.$t;
              if (value.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                queried = true;
              }
              if (useIntegers === true && !isNaN(value)) {
                value = Number(value);
              }
              newRow[name] = value;
              if (queried === true) {
                if (!columns.hasOwnProperty(name)) {
                  columns[name] = [];
                  columns[name].push(value);
                } else {
                  columns[name].push(value);
                }
              }
            }
          }
          if (queried === true) {
            rows.push(newRow);
          }
        }
        if (showColumns === true) {
          responseObj['columns'] = columns;
        }
        if (showRows === true) {
          responseObj['rows'] = rows;
        }
        if (fileOutput === true) {
          fs.writeFile('./src/_modules/data/gsx.json', JSON.stringify(responseObj, null, '  '),function(err, result) {
            if(err) console.log('error', err);
          });
        }
        return res.status(200).json(responseObj);
      } else {
        return res.status(response.statusCode).json(error);
      }
    }
  });

};