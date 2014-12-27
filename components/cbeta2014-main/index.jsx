
var tofindExtra=function(historytofind) {
  var res=[];
  historytofind.map(function(tf){
  	res.unshift(<a href="#" onClick={this.dosearch}>{tf}</a>);
  	res.unshift(<span> </span>);
  },this);
  return res;
}
 
var Main = React.createClass({
  mixins:[Require("defaultmain")],
  tocTag:"mulu",  
  defaultTofind:"發菩提心",
  tofindExtra:tofindExtra,
  dbid:"cbeta",
  dictionaries:["dingfubao_dict"]
});
module.exports=Main;