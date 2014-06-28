var taisho="/CBReader/XML/T01/*.xml";
var cbeta_tei_p5=require("./cbeta_tei_p5");
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
	
	var apps=cbeta_tei_p5(status.starttext+s,status.parsed);
	//console.log(apps)
}

var onFile=function(fn) {
	outback("indexing"+fn);
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