var entries=require("./entries");
entries.sort();
require("fs").writeFileSync("entries.json",JSON.stringify(entries,"", " "),"utf8");
