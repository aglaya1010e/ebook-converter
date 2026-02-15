async function p(m){console.log("[FB2] Starting parse...");const i=await m.text();console.log("[FB2] File size:",i.length,"chars");const s=new DOMParser().parseFromString(i,"text/xml"),c=s.getElementsByTagName("parsererror")[0];if(c)throw console.error("[FB2] Parse error:",c.textContent),new Error("FB2 XML parse error");const l=s.getElementsByTagName("body")[0];if(console.log("[FB2] Body found:",!!l),!l)return console.log("[FB2] All tags:",Array.from(s.getElementsByTagName("*")).map(n=>n.nodeName).slice(0,20)),"Текст не найден";let a="";function t(n){if(n.nodeType===3)return n.textContent;let e="";for(const r of n.childNodes){const o=r.nodeName.toLowerCase().replace(/.*:/,"");o==="p"?e+=t(r).trim()+`
`:o==="title"||o==="v"?e+=`
`+t(r).trim().toUpperCase()+`

`:o==="empty-line"?e+=`
`:o==="emphasis"||o==="strong"?e+=t(r).trim():e+=t(r)}return e}return a=t(l).trim(),console.log("[FB2] Extracted text length:",a.length),a}export{p as parseFb2};
