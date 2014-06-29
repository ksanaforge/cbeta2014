var sax = require("sax"),
  strict = true, // set to false for html-mode
  parser = sax.parser(strict);
var fs=require('fs')
parser.onerror = function (e) {
  // an error happened.
  console.log("E",e)
};
parser.ontext = function (t) {
  // got some text.  t is the string of text.
  console.log("text",t)
};
parser.onopentag = function (node) {
  // opened a tag.  node has "name" and "attributes"
  console.log("open",node)
};
parser.onattribute = function (attr) {
  // an attribute.  attr has "name" and "value"
};
parser.onend = function () {
  // parser stream is done, and ready to have more stuff written to it.
  console.log("end")
};
parser.onclosetag=function(node){
  console.log("close",node)
}

parser.write('<xml>Hello, <who name="world">wo<a>rld</who>!</xml>').close();

// stream usage
var options={};
// takes the same options as the parser
var saxStream = require("sax").createStream(strict, options)
saxStream.on("error", function (e) {
  // unhandled errors will throw, since this is a proper node
  // event emitter.
  console.error("error!", e)
  // clear the error
  this._parser.error = null
  this._parser.resume()
})
saxStream.on("opentag", function (node) {
  // same object as above
  console.log(node)
})
/*
// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
fs.createReadStream("file.xml")
  .pipe(saxStream)
  .pipe(fs.createWriteStream("file-copy.xml"))
  */