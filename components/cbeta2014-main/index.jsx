/** @jsx React.DOM */

var Kde=Require('ksana-document').kde;  // Ksana Database Engine
var Kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)

var resultlist=React.createClass({  //should search result
  show:function() {
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      return <div>
      <hr/>
      <div>{r.pagename}</div>
      <div dangerouslySetInnerHTML={{__html:r.text}}></div>
      </div>
    })
  },
  render:function() {
    if (this.props.res) return <div>{this.show()}</div>
    else return <div>Not Found</div>
  }
});

var main = React.createClass({
  componentDidMount:function() {
      Kde.open("cbeta",this,function(db){
        this.setState({db:db});  
      });
  },
  getInitialState: function() {
    return {res:null,db:null };
  },
  dosearch:function() {
    var tofind=this.refs.tofind.getDOMNode().value; // get tofind
    Kse.search(this.state.db,tofind,{range:{start:0}},function(data){ //call search engine
      this.setState({res:data});
      //console.log(data) ; // watch the result from search engine
    });
  },
  keypress:function(e) {
    if (e.keyCode==13) this.dosearch();
  },
  renderinputs:function() {  // input interface for search
    if (this.state.db) {
      return ( 
        //"則為正"  "為正觀" both ok
        <div><input onKeyPress={this.keypress} ref="tofind" defaultValue="則為正觀"></input>
        <button ref="btnsearch" onClick={this.dosearch}>GO</button>
        </div>
        )      
    } else {
      return <span>loading database....</span>
    }
  },
  render: function() {  //main render routine
    return (
      <div>
        {this.renderinputs()}
        <resultlist res={this.state.res}/>
      </div>
    );
  }
});
module.exports=main; //common JS