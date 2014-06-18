var indexer=require("ksana-document").indexer;
var mkdb=require("./mkdb.js");
require("glob")(mkdb.glob, function (err, files) {
	mkdb.files=files;
	indexer.start(mkdb);
});
