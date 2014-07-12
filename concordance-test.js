var concordance=require("ksana-document").kse.concordance;

var Kde=require("ksana-document").kde;

getStatus=function() {
	var status=concordance.status();
	console.log(Math.floor(status.progress*100));
	if (status.done) {
		clearInterval(timer);
		console.timeEnd("concordance");
		console.log("pagecount",status.output.pagecount)
		var ratio=status.output.pagecount/status.output.totalpagecount;
		console.log("keyword coverage",(ratio*100).toFixed(2));
		console.log(status.output.terms.join("\r\n"));
	}
}
console.time("concordance");
concordance.start({db:"cbeta",q:"法師",threshold:0.0005,threshold2:0.001,threshold_count:10, threshold2_count:10});
var timer=setInterval(getStatus,100);

