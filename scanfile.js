var Kde=require("ksana-document").kde;
var now=0,filenames=null,engine=null;
var hit=0;

var engine=Kde.openLocal("cbeta");
filenames=engine.get("fileNames");
console.time("scan");
{
	for (var i=0;i<filenames.length;i++) {
		var offsets=engine.get(["files",i,"pageOffset"],true);
		for (var j=0;j<offsets.length-1;j++) {
			var page=engine.get(["fileContents",i,j]);
			if (page.indexOf("菩提")>-1) hit++;
		}
	}
}
console.log(hit)
console.timeEnd("scan");
