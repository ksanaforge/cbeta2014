var glob=require("glob");
var fs=require("fs");
var tags={};
var parseFile=function(fn) {
	console.log(fn)
	var text=fs.readFileSync(fn,"utf8");
	text.replace(/<([^\/ >]+?)>/g,function(m,m1){
		if (!tags[m1]) tags[m1]=0;
		tags[m1]++;
	})
}

glob("../../CBReader/XML/**/*.xml",function(err,res){
	res.map(parseFile);
	var out=[];
	for (var i in tags) out.push([i,tags[i]]);
	out.sort(function(a,b){return b[1]-a[1]});

  fs.writeFileSync("tags.txt",  out.map(function(o){return o[0]+' '+o[1]}),'utf8');
})