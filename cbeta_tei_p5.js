var sax=require("sax");

var errors=[],anchors=[];
var parser=null,filename="";
var context=null;

var warn=function(err) {
	errors.push(err, filename);
	//console.log(err,filename);
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
		if (handler) {
			context.handler=handler;
		}		
	}
	if (context.handler)  context.handler();
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];

	var handler=context.handlers[context.path];
	if (handler) {
		if (context.handler) context.handler(true);
		context.handler=null;//stop handling
		context.text="";
	} else if (context.handler) {
		context.handler(true);
	}
	context.paths.pop();
	context.parents.pop();
	context.path=context.paths.join("/");		
}
var addHandler=function(path,handler) {
	if (handler) context.handlers[path]=handler;
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

var resolveChoice=function(choices,anchors,texts) {
	var froms={};
	choices.map(function(C,idx){ 
		if (!C.from) {
			warn("no 'from' in "+JSON.stringify(C));
			return;
		} 
		if (froms[C.from]) warn("repeat id"+C.from);
		froms[C.from]=idx+1;
	});

	for (var i=0;i<anchors.length;i++) {
		var id=anchors[i][3];
		var link=anchors[i][4] || [];
		if (froms[id]) {
			var sic=choices[ froms[id]-1].sic;
			var corr=choices[ froms[id]-1].corr.replace(/[\n\t]/g,"");
			var sourcetext=texts[anchors[i][0]].t.substr( anchors[i][1], anchors[i][2]).replace(/[\n\t]/g,"");
			//beg0034031 , inline note, sourcetext is ""
			if (corr!=sourcetext && corr &&sourcetext) console.log("corr not same"+JSON.stringify(corr+"<>"+sourcetext+" id:"+id));
			link.push({type:"choice", sic:sic});
		}
		anchors[i][4]=link;
	}
}
var  createMarkups=function(parsed) {

	anchors=createAnchors(parsed);
	//resolveApp(apps,anchors,parsed.texts);
	//resolveCbtt(cbtt,anchors,parsed.texts);
	require("./note").resolve(anchors);
	//resolveChoice(choices,anchors,parsed.texts);

	for (var i=0;i<anchors.length;i++) {
		if (anchors[i][4] && !anchors[i][4].length) {
			warn("unresolve "+anchors[i]);
		}
	}
	return anchors;
}


var parseP5=function(xml,parsed,fn) {
	parser=sax.parser(true);
	filename=fn;
	context={ paths:[] , parents:[], handlers:{}, text:"" ,now:null};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	addHandler(  "TEI/text/back/cb:div/p/note", require("./note").handler );

	parser.write(xml);

	parser=null;
	return createMarkups(parsed);
}
module.exports=parseP5;