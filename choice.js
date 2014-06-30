var choice=null;
var choices=[];
//deal with choice with note

var handler=function(closing) {
	if (closing) {
		if (this.now.name=="corr") {
			choice.corr=this.text;
			this.text="";
		} else if (this.now.name=="sic") {
			choice.sic=this.text;
			this.text="";
		}else if (this.now.name=="choice") {
			if (this.now.attributes.from) choice.from=this.now.attributes.from.substr(1);
			if (this.now.attributes.to) choice.to=this.now.attributes.to.substr(1);
			if (this.parentHandler) {
				this.choice=choice;				
				this.handler=this.parentHandler;
				this.parentHandler(closing);
			} else {
				choices.push(choice);
			}
		}
	} else {
		if (this.now.name=="choice") {
			choice={corr:"",sic:""};
		}
	}
}
var resolve=function(anchors){

}
module.exports={handler:handler,resolve:resolve}