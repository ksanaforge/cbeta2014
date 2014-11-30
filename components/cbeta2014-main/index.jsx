var tofindExtra=function() {
  return <a href="#" onClick={this.dosearch}>給孤獨</a>
}
var Main = React.createClass({
  mixins:[Require("defaultmain")],
  tocTag:"mulu",
  defaultTofind:"正觀",
  tofindExtra:tofindExtra,
  dbid:"cbeta",
});
module.exports=Main;