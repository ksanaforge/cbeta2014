/*
TODO , normalize all traditional and variants to simplified Chinese
*/
var taisho="/CBReader/XML/T*/*.xml";//T01n0001_001
var tei=require("ksana-document").tei;
var juanstart=0;
var njuan=0;
var filename2sutrano=function(fn) {
	var m=fn.match(/n(.*?)_/);
	if (m) return m[1];
}
var do_juan=function(text,tag,attributes,status) {
	if (attributes["fun"]=="open") {
		njuan++;
		var sutrano=filename2sutrano(status.filename) || "?";
		return [
			{path:["juan","text"], value:text  }
			,{path:["juan","no"], value: sutrano+"."+attributes["n"] }
			,{path:["sutra",sutrano,"juan"], value:[attributes["n"] ,njuan]   }
		]
	}
	return null;
}


var captureTags={
	//"cb:juan":do_juan,"/cb:juan":do_juanend
	"cb:juan":do_juan,
};

var beforebodystart=function(s,status) {
}
var afterbodyend=function(s,status) {
	//status has parsed body text and raw body text, raw start text
	var apps=tei(status.starttext+s,status.parsed,status.filename,config,status);
	//console.log(apps)
}
var warning=function() {
	console.log.apply(console,arguments);
}

var onFile=function(fn) {
	process.stdout.write("indexing "+fn+"\033[0G");
}
var setupHandlers=function() {
	this.addHandler("cb:div/p/note", require("./note"));
	this.addHandler("cb:div/p/app", require("./apparatus"));
	this.addHandler("cb:div/p/choice", require("./choice"));
	this.addHandler("cb:div/p/cb:tt", require("./cbtt"));
}
var finalized=function(session) {
	console.log("VPOS",session.vpos);
	console.log("FINISHED");
}
var finalizeField=function(fields) {

}
var beforeParseTag=function(xml) {
	//make <back> as root node
	var back=xml.indexOf("<back>");
	xml=xml.substr(back);
	xml=xml.replace("</text></TEI>","");
	return xml;
}
var config={
	name:"cbeta"
	,meta:{
		config:"simple1"	
	}
	,glob:taisho
	,pageSeparator:"pb.n"
	,format:"TEI-P5"
	,bodystart: "<body>"
	,bodyend : "</body>"
	,reset:true
	,setupHandlers:setupHandlers
	,finalized:finalized
	,finalizeField:finalizeField
	,warning:warning
	,captureTags:captureTags
	,callbacks: {
		beforebodystart:beforebodystart
		,afterbodyend:afterbodyend
		,onFile:onFile
		,beforeParseTag:beforeParseTag
	}
}
setTimeout(function(){ //this might load by gulpfile-app.js
	if (!config.gulp) require("ksana-document").build();
},100)
module.exports=config;