var app=null;  //<apparatus>
var closeapp=null;
var inlem=false, lemtext=""; //<lemma>
var rdg=null,inrdg=false,rdgtext=""; //<reading>
var innote=false;
var ontext=function(t) {
	if (innote) return;
	if (inlem) lemtext+=t;
	if (inrdg) rdgtext+=t;
}
var onopentag=function(e) {
	if (e.name=="lem") { //cbeta wit always wit1
		inlem=true;
		lemtext="";
	} else if (e.name=="rdg") {
		inrdg=true;
		rdgtext="";
		rdg={wit:e.attributes.wit.split(" ")};
	} else if (e.name=="note") { // note in lem or rdg is dropped
		innote=true;
	}
}
var onclosetag=function(e) {
	if (e=="app") {
		closeapp( app);
	} else if (e=="lem") {
		inlem=false;
		app.lemma=lemtext;
	} else if (e=="rdg") {
		rdg.text=rdgtext;
		app.rdg.push(rdg);
		inrdg=false;
	} else if (e=="note") {
		innote=false;
	}
}
var open=function(attrs,parser,_closeapp) {
	if (!attrs.from) return ; //do nothing for none body text <app> 
	//t01n0001_001.xml:1275 <cb:tt type="app" from="#beg0001026" to="#end0001026">
	app={rdg:[]};
	parser.ontext=ontext;
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	closeapp=_closeapp;
	if (attrs.from)app.from=attrs.from.substr(1); //remove #
	//if (attrs.to) app.to=attrs.to.substr(1);
}


module.exports={open:open};