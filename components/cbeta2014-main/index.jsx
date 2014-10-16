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
      <span>{r.pagename}</span>
      <span dangerouslySetInnerHTML={{__html:r.text}}></span>
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
    return {res:null,db:null , msg:"click GO button to search"};
  },
  dosearch:function(e) {
    var t=new Date();
    var tofind=e.target.innerHTML;
    if (tofind=="GO") tofind=this.refs.tofind.getDOMNode().value;
    this.setState({msg:"Searching"});
    var that=this;
    setTimeout(function(){
      Kse.search(that.state.db,tofind,{range:{start:0,maxhit:20}},function(data){ //call search engine
        that.setState({res:data,msg:(new Date()-t)+"ms"});
        //console.log(data) ; // watch the result from search engine
      });
    },0);
  },
  keypress:function(e) {
    if (e.keyCode==13) this.dosearch();
  },
  renderinputs:function() {  // input interface for search
    if (this.state.db) {
      return (    
        //"則為正"  "為正觀" both ok
        <div> 
        <h1 className="logo">CBETA 2014 Search Engine</h1>
        <div className="centered inputs"><input onKeyPress={this.keypress} ref="tofind" defaultValue="正觀"></input>
        <button ref="btnsearch" onClick={this.dosearch}>GO</button>
        <a href="#" onClick={this.dosearch}>觀自在</a> |
        <a href="#" onClick={this.dosearch}>海文</a> |
        <a href="#" onClick={this.dosearch}>給孤獨園</a> 
        </div>
        </div>
        )          
    } else {
      return <span>loading database....</span>
    }
  }, 
  onReady:function(usage,quota) {
    if (!this.state.db) Kde.open("cbeta",function(db){
        this.setState({db:db});  
    },this);      
    this.setState({dialog:false,quota:quota,usage:usage});
  },
  openFileinstaller:function(autoclose) {
    if (window.location.origin.indexOf("http://127.0.0.1")==0) {
      require_kdb[0].url=window.location.origin+window.location.pathname+"cbeta.kdb";
    }
    return <fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },
  fidialog:function() {
      this.setState({dialog:true});
  }, 
  render: function() {  //main render routine
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
    return (
      <div className="main">
        
        {this.state.dialog?this.openFileinstaller():null}
        {this.renderinputs()}            
        <span>{this.state.msg}</span>  
        <resultlist res={this.state.res}/>
      </div>
    );
  }
  } 
});
module.exports=main; //common JS