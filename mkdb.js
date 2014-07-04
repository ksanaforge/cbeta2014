var taisho="/CBReader/XML/T01*/*.xml";
var tei=require("ksana-document").tei;
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var beforebodystart=function(s,status) {
}
var afterbodyend=function(s,status) {
	//status has parsed body text and raw body text, raw start text
	
	var apps=tei(status.starttext+s,status.parsed,status.filename);
	//console.log(apps)
}

var onFile=function(fn) {
	outback("indexing"+fn);
}
var initialize=function() {
	this.addHandler(  "TEI/text/back/cb:div/p/note", require("./note"));
	this.addHandler(  "TEI/text/back/cb:div/p/app", require("./apparatus"));
	this.addHandler(  "TEI/text/back/cb:div/p/choice", require("./choice"));
	this.addHandler(  "TEI/text/back/cb:div/p/cb:tt", require("./cbtt"));
}
var finalized=function(session) {
	console.log("VPOS",session.vpos);
	console.log("FINISHED")
}
var config={
	name:"cbeta"
	,config:"simple1"
	,glob:taisho
	,pageSeparator:"pb.xml:id"
	,format:"TEIP5"
	, bodystart: "<body>"
	, bodyend : "</body>"
	,reset:true
	,initialize:initialize
	,finalized:finalized
	,callbacks: {
		beforebodystart:beforebodystart
		,afterbodyend:afterbodyend
		,onFile:onFile
	}
}
setTimeout(function(){ //this might load by gulpfile-app.js
	if (!config.gulp) require("ksana-document").build();
},100)
module.exports=config;