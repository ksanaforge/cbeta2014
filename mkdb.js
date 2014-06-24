var taisho="/CBReader/XML/T*/*.xml";
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var beforebydstart=function(s,status) {
	//console.log("start",s.length);
}
var afterbodyend=function(s,status) {
	//console.log("end",s.length);
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
		//beforebodystart:beforebydstart
		//,afterbodyend:afterbodyend
		onFile:onFile
	}
}
setTimeout(function(){ //this might load by gulpfile-app.js
	if (!config.gulp) require("ksana-document").build();
},100)
module.exports=config;