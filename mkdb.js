
var taisho="/CBReader/XML/T01/*.xml";
var beforebydstart=function(s,status) {
	console.log("start",s.length);
}
var afterbodyend=function(s,status) {
	console.log("end",s.length);
}

module.exports={
	name:"cbeta"
	,config:"simple1"
	,glob:taisho
	,pageSeparator:"pb.n"
	,format:"TEIP5"
	, bodystart: "<body>"
	, bodyend : "</body>"
	,callbacks: {
		beforebodystart:beforebydstart
		,afterbodyend:afterbodyend
	}
}