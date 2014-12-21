/* search with bigram enable */
var kde=require("ksana-document").kde;
var kse=require("ksana-document").kse;

var search=function(db) {
	console.time("search");
	kse.search(db,"發菩提心"/*,{range:{start:0},nospan:true}*/,function(data){ //218ms without bigram
		console.timeEnd("search");
		//console.log(data.excerpt.map(function(d){return d.text}));
		console.log(data.rawresult.length,db.searchtime);
	});
}
kde.open("cbeta",search);
