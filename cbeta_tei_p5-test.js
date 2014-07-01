var cbetateip5=require("./cbeta_tei_p5");
var fn="sampletei.xml";
var xml=require("fs").readFileSync(fn,"utf8");
var res=cbetateip5(xml,null,fn);
QUnit.test("app",function(){
	equal(res.apps[0].from,"beg0023012");
	equal(res.apps[0].lemma,"毾𣰆，綩綖");
	equal(res.apps[0].rdg[0].text,"塔登菀莚");
	equal(res.apps[0].rdg[0].wit,"#wit5");
});

QUnit.test("note",function(){
	equal(res.notes[0].target,"nkr_note_mod_0020003");
	equal(res.notes[0].text,"牒＝藝【元】【明】＊");

	equal(res.notes[1].target,"nkr_note_mod_0941009");
	equal(res.notes[1].text,"瑩＝鎣【甲】＊");	
});

QUnit.test("choice",function(){
	equal(res.choices[0].from,"beg_38");
	equal(res.choices[0].corr,"辦");
	equal(res.choices[0].sic,"辨");

	equal(res.choices[1].from,"beg_ef");
	equal(res.choices[1].orig,"𪄲鴹");
	equal(res.choices[1].reg,"商羊");
});

QUnit.test("cbtt",function(){
	equal(res.cbtts[0].from,"beg0016018");
	equal(res.cbtts[0].cbt[0].text,"香塔");
	equal(res.cbtts[0].cbt[0].lang,"zh");
	equal(res.cbtts[0].cbt[1].text,"Kūṭāgāra.");
	equal(res.cbtts[0].cbt[1].lang,"pi");

	equal(res.cbtts[1].cbt[0].text,"婆梨婆");
	equal(res.cbtts[1].cbt[0].lang,"zh");	
	equal(res.cbtts[1].cbt[1].text,"Pāvā.");
	equal(res.cbtts[1].cbt[1].lang,"pi");	

	equal(res.cbtts[2].cbt[0].text,"耆闍崛山");
	equal(res.cbtts[2].cbt[0].lang,"zh");	
	equal(res.cbtts[2].cbt[1].text,"Gijjhakūṭa-pabbata.");
	equal(res.cbtts[2].cbt[1].lang,"pi");		
});
