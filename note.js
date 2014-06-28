var note=null;
var innote=false;
var sictext="",corrtext="";
var closenote=null;
var parser=null;
var ontext=function(t) {
	note.text+=t;
}
var onclosechoice=function(choice) {
/*
  <choice> inside note has no "from" and "to",
  use <corr> directly in node text,  <sic> is dropped.
*/

	if (choice.corr) note.text+=choice.corr;  
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
}
var onopentag=function(e) {
	if (e.name=="choice") { //cbeta wit always wit1
		require("./choice").open(e,parser,onclosechoice);
	}
}
var onclosetag=function(e) {
	if (e=="note") {
		closenote(note);
	} else if (e=="") {
		innote=false;
	}
}
var open=function(e,_parser,_closenote){
	if (!e.target) return;
	note={target:e.target.substr(1),text:""};
	parser=_parser;
	parser.ontext=ontext;
	closenote=_closenote;
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
}

module.exports={open:open}