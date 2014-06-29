var app=null;  //<app> apparatus
var closeapp=null;
var closechildapp=null;
var inlem=false, lemtext=""; //<lem> lemma
var rdg=null,inrdg=false,rdgtext=""; //<rdg>
var innote=false;
var parser=null,childapp=false,inlang=false,lang="",langtext="";
/*
  TODO , APP can be nested !!
*/
var ontext=function(t) {
	if (innote) return;
	if (inlem) lemtext+=t;
	if (inrdg) rdgtext+=t;
	if (inlang) langtext+=t;
}
var onclosechoice=function(choice) {
/*
  <choice> inside app has no "from" and "to",
  use <corr> directly in node text,  <sic> is dropped.
*/
	if (choice.corr) ontext(choice.corr); 
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
}
var oncloseapp=function(app) { //child app
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	childapp=false;

}
var onopentag_cbtt=function(e) {
	if (e.name=="cb:t") {
		lang=e.attributes["xml:lang"];
		if (lang=="zh") { //assume zh as lemma
			lemtext="";
			inlem=true;
		} else {
			langtext="";
			inlang=true;
		}
	} else if (e.name=="app") {
		childapp=true;
		open(e,parser,oncloseapp);
	}
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
	} else if (e.name=="choice") { //cbeta wit always wit1
		require("./choice").open(e,parser,onclosechoice);
	} else if (e.name=="app") {
		childapp=true;
		open(e,parser,oncloseapp);
	} else {
		//unknown tag
	}
}
var onclosetag=function(e) {
	if (e=="app") {
		closeapp( app);
	} else if (e=="lem") {
		inlem=false;
		app.lemma=lemtext;
	} else if (e=="rdg") {
		if (!childapp) {
			rdg.text=rdgtext;
			app.rdg.push(rdg);
		}
		inrdg=false;
	} else if (e=="note") {
		innote=false;
	} else if (e=="cb:tt") {
		closechildapp(app);
		innote=false;
	} else if (e=="cb:t") {//for cb:tt
		if (inlem)  {
			inlem=false;
			app.lemma=lemtext;
		}
		if (inlang)  {
			inlang=false;
			app.rdg.push({text:langtext,lang:lang});
			langtext="";
			lang="";
		}

	}
}
var open=function(attrs,_parser,_closeapp) {
	app={rdg:[]};
	parser=_parser;
	parser.ontext=ontext;
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	closeapp=_closeapp;
	if (attrs.from)app.from=attrs.from.substr(1); //remove #
}
var opencbtt=function(attrs,_parser,_closeapp) {	
	app={rdg:[]};
	parser=_parser;
	parser.ontext=ontext;
	parser.onopentag=onopentag_cbtt;
	parser.onclosetag=onclosetag;
	closechildapp=_closeapp;
	if (attrs.from)app.from=attrs.from.substr(1); //remove #
}

module.exports={open:open,opencbtt:opencbtt};