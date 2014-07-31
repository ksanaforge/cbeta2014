/** @jsx React.DOM */
/*
   SPEC : 
     檔名過慮功能。
     經號速查功能。
     頁碼速查功能。taisho page, pts page 

     相似句搜尋  , 取出 caret 所在句子， 進行模糊搜尋。( 精確和相似結果)

     前後文搜尋 context 統計 。前後1,2 字。  後面 1,2字。 ( time consuming , need a click)
        先用索引查出 可能頁 ( 濾去控制字元， - 排除 )，再送regular expression ，最後頻次統計。
     
     辭典搜尋。搜尋可能名詞。 先取句子。再從游標處做 prefix search ， 退後n字再找。

     對讀。   

*/ 
var require_kdb=[{ 
  filename:"cbeta.kdb"  , url:"http://ya.ksana.tw/kdb/cbeta.kdb" , desc:"cbeta"
}];  
var bootstrap=Require("bootstrap"); 
var fileinstaller=Require("fileinstaller");
var Kde=Require('ksana-document').kde;  // Ksana Database Engine
var Kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var maintext=Require("maintext");
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

  }, 
  getInitialState: function() {
    return {res:null,db:null };
  },
  dosearch:function() {
    var tofind=this.refs.tofind.getDOMNode().value; // get tofind
    Kse.search(this.state.db,tofind,{range:{start:0,maxhit:20}},function(data){ //call search engine
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
  onReady:function(usage,quota) {
    this.setState({quota:quota,usage:usage});
    Kde.openLocal("cbeta.kdb",function(db){
        this.setState({db:db});  
    },this);      
  },        
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
      return <fileinstaller quota="512M" autoclose="true" needed={require_kdb} 
                     onReady={this.onReady}/>
    } else { 
    return (
      <div>
        <div className="col-md-3 nopadding">
            {this.renderinputs()}
            <resultlist res={this.state.res}/>
        </div>
        <div className="col-md-5 nopadding">
        </div>
        <div className="col-md-4 nopadding">
        </div>
      </div>
    );
  }
  }
});
module.exports=main; //common JS