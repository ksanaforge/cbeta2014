var concordance=require("ksana-document").kse.concordance;

var Kde=require("ksana-document").kde;
var renderHTML=function(output)  {

}
getStatus=function() {
	var status=concordance.status();
	//console.log(Math.floor(status.progress*100));
	if (status.done) {
		clearInterval(timer);
		var ratio=status.output.pagecount/status.output.totalpagecount;
		console.log(status.output.starts.join("\r\n"));
		console.log(status.output.ends.join("\r\n"));
		
		console.timeEnd("concordance");
		console.log("pagecount",status.output.pagecount)
		console.log("keyword coverage",(ratio*100).toFixed(2));
	}
}
console.time("concordance");
concordance.start({db:"cbeta",q:"阿閦",threshold:0.005,threshold_count:100});
var timer=setInterval(getStatus,100);

