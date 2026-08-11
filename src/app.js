let db = null;
let currentPage = "dashboard";

const $ = (s) => document.querySelector(s);
const money = (n) => `${Number(n || 0).toFixed(2)} ${db.shop.currency || "AUD"}`;
const uid = (p) => `${p}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

async function save() { await window.barberAPI.saveData(db); }
function toast(msg) { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2200); }
function today(){ return new Date().toLocaleDateString("ar-AU",{weekday:"long",year:"numeric",month:"long",day:"numeric"}); }

async function boot(){
  db = await window.barberAPI.getData();
  $("#today").textContent=today();
  $("#loginForm").addEventListener("submit", login);
  $("#logoutBtn").onclick=()=>{ $("#app").classList.add("hidden"); $("#loginScreen").classList.remove("hidden"); $("#password").value=""; };
  document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
}
async function login(e){
  e.preventDefault();
  const ok=await window.barberAPI.login({username:$("#username").value.trim(),password:$("#password").value});
  if(!ok){$("#loginError").textContent="اسم المستخدم أو كلمة المرور غير صحيحة.";return;}
  $("#loginError").textContent="";
  db=await window.barberAPI.getData();
  $("#loginScreen").classList.add("hidden");$("#app").classList.remove("hidden");showPage("dashboard");
}
function showPage(page){
  currentPage=page;
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const titles={dashboard:"لوحة التحكم",employees:"الموظفين",services:"الخدمات والأسعار",sales:"المبيعات",expenses:"المصاريف",reports:"التقارير",settings:"الإعدادات"};
  $("#pageTitle").textContent=titles[page]||"Barber Shop";
  const pages={dashboard:dashboardPage,employees:employeesPage,services:servicesPage,sales:salesPage,expenses:expensesPage,reports:reportsPage,settings:settingsPage};
  pages[page]();
}
function dashboardPage(){
  const revenue=db.sales.reduce((a,x)=>a+Number(x.total),0);
  const expenses=db.expenses.reduce((a,x)=>a+Number(x.amount),0);
  const todayStr=new Date().toISOString().slice(0,10);
  const todaySales=db.sales.filter(x=>x.date===todayStr).reduce((a,x)=>a+Number(x.total),0);
  $("#page").innerHTML=`
    <div class="grid">
      <div class="card stat"><div class="label">إجمالي المبيعات</div><div class="value green">${money(revenue)}</div></div>
      <div class="card stat"><div class="label">صافي الدخل</div><div class="value accent">${money(revenue-expenses)}</div></div>
      <div class="card stat"><div class="label">مبيعات اليوم</div><div class="value blue">${money(todaySales)}</div></div>
      <div class="card stat"><div class="label">الموظفين</div><div class="value">${db.employees.length}</div></div>
    </div>
    <div class="section">
      <div class="section-head"><h3>آخر المبيعات</h3><button class="secondary" onclick="showPage('sales')">عرض الكل</button></div>
      ${salesTable(db.sales.slice().reverse().slice(0,8))}
    </div>`;
}
function employeesPage(){
  $("#page").innerHTML=`
    <div class="section-head"><h3>الموظفين</h3><button class="primary" onclick="employeeModal()">+ إضافة موظف</button></div>
    ${db.employees.length?simpleTable(["الاسم","النسبة/الأجر","الحالة",""],db.employees.map(e=>[
      e.name,e.rate+(e.type==="percent"?"%":" $"),e.active?"نشط":"غير نشط",
      `<button class="danger" onclick="removeEmployee('${e.id}')">حذف</button>`])):`<div class="card empty">لا يوجد موظفين بعد.</div>`}`;
}
function servicesPage(){
  $("#page").innerHTML=`
    <div class="section-head"><h3>الخدمات والأسعار</h3><button class="primary" onclick="serviceModal()">+ إضافة خدمة</button></div>
    ${simpleTable(["الخدمة","السعر","المدة",""],db.services.map(s=>[
      s.name,money(s.price),`${s.duration} دقيقة`,`<button class="danger" onclick="removeService('${s.id}')">حذف</button>`]))}`;
}
function salesPage(){
  $("#page").innerHTML=`
    <div class="section-head"><h3>المبيعات</h3><button class="primary" onclick="saleModal()">+ تسجيل مبيع</button></div>
    ${salesTable(db.sales.slice().reverse())}`;
}
function expensesPage(){
  $("#page").innerHTML=`
    <div class="section-head"><h3>المصاريف</h3><button class="primary" onclick="expenseModal()">+ إضافة مصروف</button></div>
    ${db.expenses.length?simpleTable(["الوصف","المبلغ","التاريخ",""],db.expenses.slice().reverse().map(x=>[
      x.description,money(x.amount),x.date,`<button class="danger" onclick="removeExpense('${x.id}')">حذف</button>`])):`<div class="card empty">لا يوجد مصاريف بعد.</div>`}`;
}
function reportsPage(){
  const revenue=db.sales.reduce((a,x)=>a+Number(x.total),0), expenses=db.expenses.reduce((a,x)=>a+Number(x.amount),0);
  const byEmployee={}; db.sales.forEach(s=>{byEmployee[s.employee||"غير محدد"]=(byEmployee[s.employee||"غير محدد"]||0)+Number(s.total)});
  $("#page").innerHTML=`
    <div class="grid">
      <div class="card stat"><div class="label">الإيرادات</div><div class="value green">${money(revenue)}</div></div>
      <div class="card stat"><div class="label">المصاريف</div><div class="value red">${money(expenses)}</div></div>
      <div class="card stat"><div class="label">الصافي</div><div class="value accent">${money(revenue-expenses)}</div></div>
      <div class="card stat"><div class="label">عدد العمليات</div><div class="value">${db.sales.length}</div></div>
    </div>
    <div class="section"><div class="section-head"><h3>المبيعات حسب الموظف</h3></div>
    ${simpleTable(["الموظف","إجمالي المبيعات"],Object.entries(byEmployee).map(([k,v])=>[k,money(v)]))}</div>`;
}
function settingsPage(){
  $("#page").innerHTML=`
    <div class="card">
      <h3>إعدادات المحل</h3>
      <div class="form-grid">
        <div><label>اسم المحل</label><input id="shopName" value="${esc(db.shop.name)}"></div>
        <div><label>العملة</label><select id="currency"><option ${db.shop.currency==="AUD"?"selected":""}>AUD</option><option ${db.shop.currency==="USD"?"selected":""}>USD</option><option ${db.shop.currency==="EUR"?"selected":""}>EUR</option></select></div>
      </div>
      <button class="primary" style="margin-top:18px" onclick="saveSettings()">حفظ الإعدادات</button>
    </div>
    <div class="card section">
      <h3>الأمان</h3>
      <div class="form-grid">
        <div><label>كلمة المرور الحالية</label><input id="oldPass" type="password"></div>
        <div><label>كلمة المرور الجديدة</label><input id="newPass" type="password"></div>
      </div>
      <button class="secondary" style="margin-top:18px" onclick="changePassword()">تغيير كلمة المرور</button>
    </div>
    <div class="card section">
      <h3>النسخ الاحتياطي</h3>
      <p style="color:var(--muted)">احفظ نسخة من بيانات المحل أو استعد نسخة سابقة.</p>
      <button class="secondary" onclick="backup()">تصدير نسخة احتياطية</button>
      <button class="secondary" onclick="restore()">استعادة نسخة احتياطية</button>
    </div>`;
}
function simpleTable(headers,rows){
  return `<div class="table-wrap"><table class="table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function salesTable(rows){
  if(!rows.length)return `<div class="card empty">لا توجد مبيعات بعد.</div>`;
  return simpleTable(["التاريخ","الخدمة","الموظف","المبلغ"],rows.map(s=>[s.date,s.service,s.employee||"غير محدد",money(s.total)]));
}
function modal(title,body,saveFn){
  const m=document.createElement("div");m.className="modal";m.id="modal";
  m.innerHTML=`<div class="modal-card"><h3>${title}</h3>${body}<div class="modal-actions"><button class="primary" id="modalSave">حفظ</button><button class="secondary" onclick="document.getElementById('modal').remove()">إلغاء</button></div></div>`;
  document.body.appendChild(m);$("#modalSave").onclick=async()=>{await saveFn();m.remove();};
}
function employeeModal(){modal("إضافة موظف",`<label>اسم الموظف</label><input id="mName"><label>نوع الأجر</label><select id="mType"><option value="percent">نسبة %</option><option value="fixed">أجر ثابت</option></select><label>القيمة</label><input id="mRate" type="number" min="0">`,async()=>{db.employees.push({id:uid("e"),name:$("#mName").value,rate:Number($("#mRate").value),type:$("#mType").value,active:true});await save();toast("تمت إضافة الموظف");employeesPage();});}
function serviceModal(){modal("إضافة خدمة",`<label>اسم الخدمة</label><input id="mName"><label>السعر</label><input id="mPrice" type="number" min="0"><label>المدة بالدقائق</label><input id="mDuration" type="number" min="1" value="30">`,async()=>{db.services.push({id:uid("s"),name:$("#mName").value,price:Number($("#mPrice").value),duration:Number($("#mDuration").value)});await save();toast("تمت إضافة الخدمة");servicesPage();});}
function saleModal(){modal("تسجيل مبيع",`<label>الخدمة</label><select id="mService">${db.services.map(s=>`<option value="${s.id}">${esc(s.name)} — ${money(s.price)}</option>`).join("")}</select><label>الموظف</label><select id="mEmployee"><option value="">غير محدد</option>${db.employees.map(e=>`<option>${esc(e.name)}</option>`).join("")}</select><label>المبلغ</label><input id="mTotal" type="number" min="0" value="${db.services[0]?.price||0}">`,async()=>{const s=db.services.find(x=>x.id===$("#mService").value);db.sales.push({id:uid("sale"),date:new Date().toISOString().slice(0,10),service:s?s.name:"",employee:$("#mEmployee").value,total:Number($("#mTotal").value)});await save();toast("تم تسجيل المبيع");salesPage();});}
function expenseModal(){modal("إضافة مصروف",`<label>الوصف</label><input id="mDesc"><label>المبلغ</label><input id="mAmount" type="number" min="0">`,async()=>{db.expenses.push({id:uid("x"),description:$("#mDesc").value,amount:Number($("#mAmount").value),date:new Date().toISOString().slice(0,10)});await save();toast("تمت إضافة المصروف");expensesPage();});}
async function removeEmployee(id){if(confirm("حذف الموظف؟")){db.employees=db.employees.filter(x=>x.id!==id);await save();employeesPage();}}
async function removeService(id){if(confirm("حذف الخدمة؟")){db.services=db.services.filter(x=>x.id!==id);await save();servicesPage();}}
async function removeExpense(id){if(confirm("حذف المصروف؟")){db.expenses=db.expenses.filter(x=>x.id!==id);await save();expensesPage();}}
async function saveSettings(){db.shop.name=$("#shopName").value;db.shop.currency=$("#currency").value;await save();toast("تم حفظ الإعدادات");}
async function changePassword(){const r=await window.barberAPI.changePassword({oldPassword:$("#oldPass").value,newPassword:$("#newPass").value});toast(r.ok?"تم تغيير كلمة المرور":r.error||"حدث خطأ");if(r.ok)settingsPage();}
async function backup(){const r=await window.barberAPI.exportBackup();if(r.ok)toast("تم حفظ النسخة الاحتياطية");}
async function restore(){const r=await window.barberAPI.importBackup();if(r.ok){db=await window.barberAPI.getData();toast("تمت الاستعادة");showPage(currentPage)}else if(r.error)toast(r.error);}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
window.showPage=showPage;window.employeeModal=employeeModal;window.serviceModal=serviceModal;window.saleModal=saleModal;window.expenseModal=expenseModal;window.removeEmployee=removeEmployee;window.removeService=removeService;window.removeExpense=removeExpense;window.saveSettings=saveSettings;window.changePassword=changePassword;window.backup=backup;window.restore=restore;
boot();