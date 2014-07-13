var regex=require("ksana-document").kse.regex;

var Kde=require("ksana-document").kde;

getStatus=function() {
	var status=regex.status();
	console.log(Math.floor(status.progress*100));
	if (status.done) {
		clearInterval(timer);
		console.timeEnd("regex");
		console.log("pagecount",status.output.pagecount)
		var ratio=status.output.pagecount/status.output.totalpagecount;
		console.log("keyword coverage",(ratio*100).toFixed(2));
		console.log(status.output.terms.join("\r\n"));
	}
}
console.time("regex");
regex.start({db:"cbeta",q:"..法門",threshold:5});
var timer=setInterval(getStatus,100);

