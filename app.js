
const KEY="bp";

function get(){return JSON.parse(localStorage.getItem(KEY)||"[]")}
function set(v){localStorage.setItem(KEY,JSON.stringify(v))}

function save(){
const d=get();
d.unshift({
date:new Date().toLocaleString(),
sys:sys.value,
dia:dia.value,
pulse:pulse.value
});
set(d);
render();
}

function render(){
const d=get();
t.innerHTML=d.map(x=>`<tr><td>${x.date}</td><td>${x.sys}</td><td>${x.dia}</td><td>${x.pulse}</td></tr>`).join("");

if(window.chart)chart.destroy();
chart=new Chart(c,{type:"line",data:{
labels:d.map(x=>x.date).reverse(),
datasets:[
{label:"SYS",data:d.map(x=>x.sys).reverse()},
{label:"DIA",data:d.map(x=>x.dia).reverse()}
]}})
}

function exportCSV(){
const d=get();
let csv="date,sys,dia,pulse\n"+d.map(x=>`${x.date},${x.sys},${x.dia},${x.pulse}`).join("\n");
const a=document.createElement("a");
a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
a.download="blutdruck.csv";
a.click();
}

function exportPDF(){
const {jsPDF}=window.jspdf;
const doc=new jsPDF();
let y=10;
get().forEach(x=>{
doc.text(`${x.date} | ${x.sys}/${x.dia} | ${x.pulse}`,10,y);
y+=8;
});
doc.save("blutdruck.pdf");
}

render();
