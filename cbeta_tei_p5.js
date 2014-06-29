var sax=require("sax");
var apparatus=require("./apparatus");
var choice=require("./choice");
var note=require("./note");
var errors=[];
var parser=null,filename="";
var apps=[], notes=[] ,choices=[];
var warn=function(err) {
	errors.push(err, filename);
	console.log(err,filename);
}
var onclosetag_app=function(app) {
	apps.push(app);
	parser.onclosetag=onclosetag;
	parser.onopentag=onopentag;
}
var onclosetag_note=function(note) {
	notes.push(note);
	parser.onclosetag=onclosetag;
	parser.onopentag=onopentag;
}
var onclosetag_choice=function(choice) {
	choices.push(choice);
	parser.onclosetag=onclosetag;
	parser.onopentag=onopentag;
}
var onopentag=function(e) {
	if (e.name=="app") {
		apparatus.open(e.attributes,parser, onclosetag_app);
	} else if (e.name=="cb:tt") {
		apparatus.opencbtt(e.attributes,parser, onclosetag_app);
	} else if (e.name=="note") {
		if (e.attributes.n) note.open(e.attributes,parser, onclosetag_note);
	} else if (e.name=="choice") {
		choice.open(e.attributes,parser, onclosetag_choice);
	}
}

var onclosetag=function(e) {

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
var resolveApp=function(apps,anchors,texts) { //resolve app and cb:tt
	var froms={};
	apps.map(function(A,idx){ 
		if (!A.from) {
			warn("no 'from' in "+JSON.stringify(A));
			return;
		} 
		if (froms[A.from]) warn("repeat id"+A.from);
		froms[A.from]=idx+1;
	});

	for (var i=0;i<anchors.length;i++) {
		var id=anchors[i][3];
		if (typeof id!="string") continue;//already resolve
		if (froms[id]) {
			var rdg=apps[ froms[id]-1].rdg;
			var lemma=apps[ froms[id]-1].lemma.replace(/[\n\t]/g,"");
			var sourcetext=texts[anchors[i][0]].t.substr( anchors[i][1], anchors[i][2]).replace(/[\n\t]/g,"");
			//beg0034031 , inline note, sourcetext is ""
			if (lemma!=sourcetext && lemma &&sourcetext) console.log("lemma not same"+JSON.stringify(lemma+"<>"+sourcetext+" id:"+id));
			anchors[i][3]={type:"app", rdg:rdg};
		}
	}
}
var resolveNote=function(notes,anchors) {
	var targets={};
	notes.map(function(N,idx){ 
		if (!N.target) {
			warn("no 'target' in "+JSON.stringify(N));
			return;
		} 
		/*
		t01n0026_009.xml
		<note n="0478005" place="foot" type="cf." target="#nkr_note_cf._0478005">[Nos. 33-35]</note>
		<note n="0478005" place="foot" type="cf." target="#nkr_note_cf._0478005">cf. Vinaya, Cu IX.1.4<
		*/
		if (targets[N.target]) { //multiple <note> share same target
			if (typeof targets[N.target]=="number")  targets[N.target]=[targets[N.target]];
			targets[N.target].push(idx+1);
		}else {
			targets[N.target]=idx+1;	
		}
	});

	for (var i=0;i<anchors.length;i++) {
		var id=anchors[i][3];
		if (typeof id!="string") continue;//already resolve
		if (targets[id]) {
			if (typeof targets[id]=="number") {
				var text=notes[ targets[id]-1].text;	
			} else { //joining multiple note
				var text="";
				for (var j=0;j<targets[id].length;j++) {
					text+=notes[targets[id][j]-1].text+'\n';
				}
			}
			anchors[i][3]={type:"note", text:text};
		}
	}
}
var resolveChoice=function() {
	// i am tired...
}
var  createMarkups=function(parsed) {
	var anchors=createAnchors(parsed);
	resolveApp(apps,anchors,parsed.texts);
	resolveNote(notes,anchors);
	resolveChoice(choices,anchors);
	for (var i=0;i<anchors.length;i++) {
		if (typeof anchors[i][3]=="string") {
			warn("unresolve "+anchors[i]);
		}
	}
	return anchors;
}

var parseP5=function(xml,parsed,fn) {
	parser=sax.parser(true);
	apps=[];
	notes=[];
	choices=[];
	filename=fn;
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.write(xml);

	parser=null;
	return createMarkups(parsed);
}
module.exports=parseP5;