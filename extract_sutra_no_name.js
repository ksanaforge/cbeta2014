var fs=require("fs");
var taishotoc="/CBReader/toc/T*.toc";

var glob=require("glob");
var out=[],names=[],nos=[];
var processfile=function(fn) {
	var arr=fs.readFileSync(fn,"ucs2").split(/\r?\n/g).map(function(L){
		var m=L.match(/<name>T(\d+[a-z]?) (.*?) \((\d+)卷\)</);
		if (m) {
			names.push('"'+m[2]+'"');
			nos.push('"'+m[1]+'"');
			//out.push('{"n":"'+m[1]+',"name":"'+m[2]+'","juan":"'+m[3]+'"}')
		}
	});
}
var processfiles=function(files) {
	files.map(processfile);
}
glob(taishotoc,function(err,data){
	processfiles(data.filter(function(f){return f.match(/T\d+/)}));
	var output="var names=["+names.join(",\n")+"];\n"+
	"var nos=["+nos.join(",\n")+"];\n"+
	"module.exports={names:names,nos:nos};";
	fs.writeFileSync("taishonames.json",output,"utf8");
});
