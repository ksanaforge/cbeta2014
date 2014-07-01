var choice=null;
var choices=[];
//deal with choice with note

var handler=function() {
	if (this.now.name=="choice") {
		var from=this.now.attributes["cb:from"];
		choice={corr:"",sic:""};
		if (from) choice.from=from.substr(1);
	}
}
var close_handler=function() {
	if (this.now.name=="corr") {
		choice.corr=this.text;
		this.text="";
	} else if (this.now.name=="sic") {
		choice.sic=this.text;
		this.text="";
	}else if (this.now.name=="choice") {
		if (this.now.attributes.from) choice.from=this.now.attributes.from.substr(1);
		if (this.now.attributes.to) choice.to=this.now.attributes.to.substr(1);
		if (this.parentCloseHandler) {
			this.choice=choice;				
			this.parentCloseHandler(true);
		} else {
			choices.push(choice);
		}
	}
}
var resolve=function(anchors,texts){
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
			/*
			var corr=choices[ froms[id]-1].corr.replace(/[\n\t]/g,"");
			var sourcetext=texts[anchors[i][0]].t.substr( anchors[i][1], anchors[i][2]).replace(/[\n\t]/g,"");
			//beg0034031 , inline note, sourcetext is ""
			if (corr!=sourcetext && corr &&sourcetext) console.log("corr not same"+JSON.stringify(corr+"<>"+sourcetext+" id:"+id));
			*/
			link.push({type:"choice", sic:sic});
		}
		anchors[i][4]=link;
	}
}
var result=function() {
	return choices;
}
var reset=function() {
	choices=[];
	choice=null;
}
module.exports={handler:handler,close_handler:close_handler,
	resolve:resolve,result:result,reset:reset}