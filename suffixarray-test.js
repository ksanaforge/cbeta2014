var SA=require("./suffixarray");

var fs=require("fs");
var n001=fs.readFileSync("T01n0001_001.txt","utf8").replace(/\r\n/g,"");
console.time("t");
var sa=SA(n001);
var getTerm=function(pos) {
	var s=n001.substr(pos,3);
	for (var i=0;i<s.length;i++ ){
		var cc=s.charCodeAt(i);
		if (cc<0x3400 || cc>0xF000) break;
	}
	return s.substr(0,i);
}
var terms={};
for (var i=0;i<sa.length;i++) {
	var s=getTerm(sa[i]);
	if (!terms[s]) terms[s]=0;
	terms[s]++;
}
var sorted=[];
for (var term in terms) {
	var c=terms[term];
	if (c>3 && term.length>1) 	sorted.push([c,term]);
}
sorted=sorted.sort(function(a,b){return a[0]-b[0]});
console.log(sorted);
console.timeEnd("t");