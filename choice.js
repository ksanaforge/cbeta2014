var choice=null;
var innote=false;
var sictext="",corrtext="";
var closechoice=null;
var incorr=false,insic=false;
var ontext=function(t) {
	if (innote) return;
	if (incorr) corrtext+=t;
	if (insic) sictext+=t;
}
var onopentag=function(e) {
	if (e.name=="corr") { //cbeta wit always wit1
		incorr=true;
		corrtext="";
	} else if (e.name=="sic") {
		insic=true;
		sictext="";
	} else if (e.name=="note") { // note in lem or rdg is dropped
		innote=true;
	}
}
var onclosetag=function(e) {
	if (e=="choice") {
		closechoice( choice);
	} else if (e=="sic") {
		choice.sic=sictext;
		insic=false;
	} else if (e=="corr") {
		choice.corr=corrtext;
		incorr=false;
	} else if (e=="note") {
		innote=false;
	}
}
var open=function(e,parser,_closechoice){
	choice={};
	if (e["cb:from"]) choice.from=e["cb:from"].substr(1); //remove #
	if (e["cb:to"]) choice.to=e["cb:to"].substr(1); //remove #
	parser.ontext=ontext;
	closechoice=_closechoice;
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
}

module.exports={open:open}