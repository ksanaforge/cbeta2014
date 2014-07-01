var sax=require("sax");

var errors=[],anchors=[];
var parser=null,filename="";
var context=null;

var warn=function(err) {
	errors.push(err, filename);
	console.log(err,filename);
}
var ontext=function(e) {
	if (context.handler) context.text+=e;
}
var onopentag=function(e) {
	context.paths.push(e.name);
	context.parents.push(e);
	context.now=e;	
	context.path=context.paths.join("/");
	if (!context.handler) {
		var handler=context.handlers[context.path];
		if (handler) 	context.handler=handler;
		var close_handler=context.close_handlers[context.path];
		if (close_handler) 	context.close_handler=close_handler;
		if (context.handler)  context.handler(true);
	} else {
		context.handler();
	}
	
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];

	var handler=context.close_handlers[context.path];
	if (handler) {
		if (context.close_handler) context.close_handler(true);
		context.handler=null;//stop handling
		context.close_handler=null;//stop handling
		context.text="";
	} else if (context.close_handler) {
		context.close_handler();
	}
	context.paths.pop();
	context.parents.pop();
	context.path=context.paths.join("/");		
}
var addHandler=function(path,tagmodule) {
	if (tagmodule.handler) context.handlers[path]=tagmodule.handler;
	if (tagmodule.close_handler) context.close_handlers[path]=tagmodule.close_handler;
	if (tagmodule.reset) tagmodule.reset();
}
var closeAnchor=function(pg,T,anchors,id,texts) {
	var beg="beg"+id.substr(3);
	for (var j=anchors.length-1;j>=0;j--) {
		if (anchors[j][3]!=beg) continue;
		var anchor=anchors[j];
		
		if (pg==anchor[0]) { //same page
			anchor[2]=T[0]-anchor[1]; // length
		} else { //assume end anchor in just next page// ref. pT01p0003b2901
			var pagelen=texts[anchor[0]].t.length;
			anchors[j][2]= (pagelen-anchor[1])  + T[0];
		}
		return;
	}
	warn("cannot find beg pointer for anchor:"+id);
}
// [pg, start, len, id]
var createAnchors=function(parsed) {
	var anchors=[];
	var tags=parsed.tags;
	for (var pg=0;pg<tags.length;pg++){
		var pgtags=tags[pg];
		for (var i=0;i<pgtags.length;i++) {
				var T=pgtags[i];
				if (T[1].indexOf("anchor xml:id=")!=0) continue;
				var id=T[1].substr(15);
				id=id.substr(0,id.indexOf('"'));
				if (id.substr(0,3)=="end") {
					closeAnchor(pg,T,anchors,id,parsed.texts);
				} else {
					anchors.push([pg,T[0],0,id]);	
				}
			}
	}
	return anchors;	
}

var  createMarkups=function(parsed) {
	anchors=createAnchors(parsed);
	require("./apparatus").resolve(anchors,parsed.texts);
	require("./note").resolve(anchors,parsed.texts);
	require("./choice").resolve(anchors,parsed.texts);
	require("./cbtt").resolve(anchors,parsed.texts);

	for (var i=0;i<anchors.length;i++) {
		if (anchors[i][4] && !anchors[i][4].length) {
			if (anchors[i][3].substr(0,2)!="fx")	warn("unresolve "+anchors[i]);
		}
	}
	return anchors;
}


var parseP5=function(xml,parsed,fn) {
	parser=sax.parser(true);
	filename=fn;
	context={ paths:[] , parents:[], handlers:{}, close_handlers:{}, text:"" ,now:null};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	addHandler(  "TEI/text/back/cb:div/p/note", require("./note"));
	addHandler(  "TEI/text/back/cb:div/p/app", require("./apparatus"));
	addHandler(  "TEI/text/back/cb:div/p/choice", require("./choice"));
	addHandler(  "TEI/text/back/cb:div/p/cb:tt", require("./cbtt"));

	parser.write(xml);
	context=null;
	parser=null;
	if (parsed) return createMarkups(parsed);
	else return { //raw result for debug
		apps:require("./apparatus").result()
		,notes:require("./note").result()
		,choices:require("./choice").result()
		,cbtts:require("./cbtt").result()
	} ;
}
module.exports=parseP5;