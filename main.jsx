import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  LayoutDashboard, Users, Scissors, UserRound, Wallet, Receipt,
  BarChart3, Settings, Menu, Search, Bell, Plus, Pencil, Trash2,
  X, Save, DollarSign, TrendingUp, CalendarDays, LogOut, Download,
  Database, Moon, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react'
import './styles.css'

const KEY = 'barbershop-management-v1'

const seed = {
  shop: { name: 'محل الحلاقة', currency: 'AUD' },
  workers: [
    { id: 1, name: 'أحمد محمد', phone: '0400 000 001', percentage: 50, active: true },
    { id: 2, name: 'علي سامي', phone: '0400 000 002', percentage: 50, active: true },
    { id: 3, name: 'حسن خالد', phone: '0400 000 003', percentage: 50, active: true },
    { id: 4, name: 'سعيد محمد', phone: '0400 000 004', percentage: 50, active: true }
  ],
  services: [
    { id: 1, name: 'قص شعر', price: 35, duration: 30, active: true },
    { id: 2, name: 'لحية', price: 20, duration: 20, active: true },
    { id: 3, name: 'قص + لحية', price: 50, duration: 45, active: true },
    { id: 4, name: 'تنظيف بشرة', price: 40, duration: 30, active: true }
  ],
  customers: [
    { id: 1, name: 'محمد أحمد', phone: '0411 111 111', visits: 8, spent: 310 },
    { id: 2, name: 'سامر علي', phone: '0422 222 222', visits: 5, spent: 180 },
    { id: 3, name: 'يوسف خالد', phone: '0433 333 333', visits: 12, spent: 490 }
  ],
  transactions: [
    { id: 1, date: '2026-08-11', workerId: 1, serviceId: 1, customerId: 1, amount: 35, payment: 'نقدي' },
    { id: 2, date: '2026-08-11', workerId: 2, serviceId: 3, customerId: 2, amount: 50, payment: 'بطاقة' },
    { id: 3, date: '2026-08-10', workerId: 1, serviceId: 2, customerId: 3, amount: 20, payment: 'بطاقة' },
    { id: 4, date: '2026-08-10', workerId: 3, serviceId: 1, customerId: 1, amount: 35, payment: 'نقدي' },
    { id: 5, date: '2026-08-09', workerId: 4, serviceId: 4, customerId: 3, amount: 40, payment: 'بطاقة' }
  ],
  expenses: [
    { id: 1, date: '2026-08-11', title: 'كهرباء', amount: 120 },
    { id: 2, date: '2026-08-09', title: 'منتجات حلاقة', amount: 85 },
    { id: 3, date: '2026-08-05', title: 'تنظيف', amount: 60 }
  ],
  payments: [
    { id: 1, date: '2026-08-11', workerId: 1, amount: 200, note: 'دفعة' },
    { id: 2, date: '2026-08-10', workerId: 2, amount: 150, note: 'دفعة' }
  ]
}

const nav = [
  ['dashboard', 'لوحة التحكم', LayoutDashboard],
  ['workers', 'العمال', Users],
  ['services', 'الخدمات والأسعار', Scissors],
  ['customers', 'الزبائن', UserRound],
  ['transactions', 'الخدمات المسجلة', CalendarDays],
  ['expenses', 'المصاريف', Receipt],
  ['payments', 'الرواتب والدفعات', Wallet],
  ['reports', 'التقارير', BarChart3],
  ['settings', 'الإعدادات', Settings]
]

function load() {
  try {
    const x = JSON.parse(localStorage.getItem(KEY))
    return x || seed
  } catch { return seed }
}
function save(data) { localStorage.setItem(KEY, JSON.stringify(data)) }
function money(n) { return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Number(n || 0)) }
function today() { return new Date().toISOString().slice(0, 10) }

function App() {
  const [data, setData] = useState(load)
  const [page, setPage] = useState('dashboard')
  const [mobile, setMobile] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => { save(data) }, [data])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const update = (key, value) => setData(d => ({ ...d, [key]: value }))
  const add = (key, item) => update(key, [...data[key], { id: Date.now(), ...item }])
  const edit = (key, item) => update(key, data[key].map(x => x.id === item.id ? item : x))
  const remove = (key, id) => update(key, data[key].filter(x => x.id !== id))

  const totals = useMemo(() => {
    const revenue = data.transactions.reduce((s, x) => s + Number(x.amount), 0)
    const expenses = data.expenses.reduce((s, x) => s + Number(x.amount), 0)
    const paid = data.payments.reduce((s, x) => s + Number(x.amount), 0)
    return { revenue, expenses, paid, profit: revenue - expenses }
  }, [data])

  const workersToday = data.workers.map(w => ({
    ...w,
    count: data.transactions.filter(t => t.workerId === w.id && t.date === today()).length,
    revenue: data.transactions.filter(t => t.workerId === w.id && t.date === today()).reduce((s, t) => s + Number(t.amount), 0)
  }))

  const title = nav.find(x => x[0] === page)?.[1] || 'لوحة التحكم'

  const reset = () => {
    if (confirm('هل تريد إعادة البيانات التجريبية؟')) {
      setData(seed); setToast({ type: 'ok', text: 'تمت إعادة البيانات التجريبية' })
    }
  }
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `barbershop-backup-${today()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setToast({ type: 'ok', text: 'تم تنزيل النسخة الاحتياطية' })
  }

  return <div className="app">
    <aside className={`sidebar ${mobile ? 'open' : ''}`}>
      <div className="brand">
        <div className="brandIcon"><Scissors size={24}/></div>
        <div><b>{data.shop.name}</b><small>الإدارة والمحاسبة</small></div>
      </div>
      <nav>{nav.map(([id, label, Icon]) =>
        <button key={id} className={page === id ? 'active' : ''} onClick={() => { setPage(id); setMobile(false); setSearch('') }}>
          <Icon size={19}/><span>{label}</span>
        </button>
      )}</nav>
      <div className="sideBottom"><span className="online"></span><div><b>النظام يعمل</b><small>البيانات محفوظة محلياً</small></div></div>
    </aside>

    {mobile && <div className="overlay" onClick={() => setMobile(false)} />}

    <main className="main">
      <header className="topbar">
        <button className="iconBtn mobileBtn" onClick={() => setMobile(true)}><Menu size={22}/></button>
        <div><h1>{title}</h1><p>{page === 'dashboard' ? 'نظرة عامة على أداء المحل' : 'إدارة بيانات المحل بسهولة'}</p></div>
        <div className="topActions">
          <div className="search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." /></div>
          <button className="iconBtn"><Bell size={18}/></button>
          <div className="avatar">خ</div>
        </div>
      </header>

      <section className="content">
        {page === 'dashboard' && <Dashboard data={data} totals={totals} workers={workersToday} onAdd={() => setModal({ type: 'transaction' })} />}
        {page === 'workers' && <CrudPage title="العمال" subtitle="إدارة العمال ونسبهم ودفعاتهم" button="إضافة عامل" icon={Users} search={search} items={data.workers} columns={['name','phone','percentage']} labels={{name:'الاسم',phone:'الهاتف',percentage:'النسبة'}} onAdd={() => setModal({type:'worker'})} onEdit={x => setModal({type:'worker', item:x})} onDelete={id => {remove('workers',id); setToast({type:'ok',text:'تم حذف العامل'})}} render={x => <><b>{x.name}</b><span>{x.phone}</span><span>{x.percentage}%</span></>} />}
        {page === 'services' && <CrudPage title="الخدمات والأسعار" subtitle="إدارة قائمة الخدمات والأسعار والمدة" button="إضافة خدمة" icon={Scissors} search={search} items={data.services} columns={['name','price','duration']} labels={{name:'الخدمة',price:'السعر',duration:'المدة'}} onAdd={() => setModal({type:'service'})} onEdit={x => setModal({type:'service', item:x})} onDelete={id => {remove('services',id); setToast({type:'ok',text:'تم حذف الخدمة'})}} render={x => <><b>{x.name}</b><span>{money(x.price)}</span><span>{x.duration} دقيقة</span></>} />}
        {page === 'customers' && <CrudPage title="الزبائن" subtitle="سجل العملاء والزيارات والمبالغ" button="إضافة زبون" icon={UserRound} search={search} items={data.customers} columns={['name','phone','visits','spent']} labels={{name:'الاسم',phone:'الهاتف',visits:'الزيارات',spent:'الإنفاق'}} onAdd={() => setModal({type:'customer'})} onEdit={x => setModal({type:'customer', item:x})} onDelete={id => {remove('customers',id); setToast({type:'ok',text:'تم حذف الزبون'})}} render={x => <><b>{x.name}</b><span>{x.phone}</span><span>{x.visits}</span><span>{money(x.spent)}</span></>} />}
        {page === 'transactions' && <Transactions data={data} search={search} onAdd={() => setModal({type:'transaction'})} onDelete={id => {remove('transactions',id); setToast({type:'ok',text:'تم حذف الخدمة'})}} />}
        {page === 'expenses' && <Expenses data={data} search={search} onAdd={() => setModal({type:'expense'})} onDelete={id => {remove('expenses',id); setToast({type:'ok',text:'تم حذف المصروف'})}} />}
        {page === 'payments' && <Payments data={data} search={search} onAdd={() => setModal({type:'payment'})} onDelete={id => {remove('payments',id); setToast({type:'ok',text:'تم حذف الدفعة'})}} />}
        {page === 'reports' && <Reports data={data} totals={totals} />}
        {page === 'settings' && <SettingsPage data={data} update={update} exportData={exportData} reset={reset} />}
      </section>
    </main>

    {modal && <Modal type={modal.type} item={modal.item} data={data} onClose={() => setModal(null)} onSave={(key, item) => { modal.item ? edit(key,item) : add(key,item); setModal(null); setToast({type:'ok',text:'تم الحفظ بنجاح'}) }} />}
    {toast && <div className={`toast ${toast.type}`}><CheckCircle2 size={18}/>{toast.text}</div>}
  </div>
}

function Dashboard({ data, totals, workers, onAdd }) {
  const max = Math.max(...workers.map(x => x.revenue), 1)
  return <div>
    <div className="welcome"><div><h2>أهلاً بك 👋</h2><p>هذه نظرة سريعة على المحل اليوم.</p></div><button className="primary" onClick={onAdd}><Plus size={18}/> تسجيل خدمة</button></div>
    <div className="stats">
      <Stat icon={DollarSign} label="إجمالي الإيرادات" value={money(totals.revenue)} note="كل الخدمات المسجلة"/>
      <Stat icon={Scissors} label="عدد الخدمات" value={data.transactions.length} note="خدمات مسجلة"/>
      <Stat icon={Users} label="عدد العمال" value={data.workers.length} note="عامل مسجل"/>
      <Stat icon={TrendingUp} label="صافي الربح" value={money(totals.profit)} note="بعد المصاريف"/>
    </div>
    <div className="grid2">
      <section className="panel">
        <div className="panelHead"><div><h3>أداء العمال اليوم</h3><small>الإيرادات حسب العامل</small></div></div>
        <div className="bars">
          {workers.map(w => <div className="barRow" key={w.id}><div className="barName"><span>{w.name}</span><b>{money(w.revenue)}</b></div><div className="barTrack"><i style={{width:`${Math.max(4,(w.revenue/max)*100)}%`}}/></div><small>{w.count} خدمات</small></div>)}
        </div>
      </section>
      <section className="panel">
        <div className="panelHead"><div><h3>ملخص مالي</h3><small>كل البيانات المسجلة</small></div></div>
        <div className="financeList">
          <div><span>الإيرادات</span><b className="green">{money(totals.revenue)}</b></div>
          <div><span>المصاريف</span><b className="red">{money(totals.expenses)}</b></div>
          <div><span>الدفعات للعمال</span><b>{money(totals.paid)}</b></div>
          <div className="total"><span>صافي الربح</span><b>{money(totals.profit)}</b></div>
        </div>
      </section>
    </div>
    <section className="panel">
      <div className="panelHead"><div><h3>آخر الخدمات</h3><small>آخر العمليات المسجلة</small></div></div>
      <TransactionTable data={data} limit={6}/>
    </section>
  </div>
}

function Stat({icon:Icon,label,value,note}) {
  return <div className="stat"><div className="statIcon"><Icon size={21}/></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>
}

function CrudPage({title,subtitle,button,icon:Icon,items,search,onAdd,onEdit,onDelete,render}) {
  const q = search.toLowerCase()
  const filtered = items.filter(x => JSON.stringify(x).toLowerCase().includes(q))
  return <div><div className="pageHead"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="primary" onClick={onAdd}><Plus size={18}/>{button}</button></div>
    <section className="panel"><div className="tableTitle"><div className="bigIcon"><Icon size={20}/></div><b>{filtered.length} سجل</b></div>
      <div className="table">
        {filtered.map(x => <div className="row" key={x.id}><div className="rowMain">{render(x)}</div><div className="rowActions"><button onClick={()=>onEdit(x)}><Pencil size={16}/></button><button className="danger" onClick={()=>confirm('حذف هذا السجل؟')&&onDelete(x.id)}><Trash2 size={16}/></button></div></div>)}
        {!filtered.length && <Empty/>}
      </div>
    </section>
  </div>
}

function Transactions({data,search,onAdd,onDelete}) {
  const list = data.transactions.filter(t => {
    const w=data.workers.find(x=>x.id===t.workerId)?.name||''
    const s=data.services.find(x=>x.id===t.serviceId)?.name||''
    return `${w} ${s} ${t.date}`.toLowerCase().includes(search.toLowerCase())
  })
  return <div><div className="pageHead"><div><h2>الخدمات المسجلة</h2><p>كل عمليات الحلاقة والدخل</p></div><button className="primary" onClick={onAdd}><Plus size={18}/> تسجيل خدمة</button></div><section className="panel"><TransactionTable data={data} list={list} onDelete={onDelete}/></section></div>
}
function TransactionTable({data,list,limit,onDelete}) {
  const rows=(list||data.transactions).slice(0,limit)
  return <div className="table transactionTable">
    <div className="thead"><span>التاريخ</span><span>الزبون</span><span>العامل</span><span>الخدمة</span><span>المبلغ</span><span></span></div>
    {rows.map(t => <div className="thead body" key={t.id}>
      <span>{t.date}</span><span>{data.customers.find(x=>x.id===t.customerId)?.name||'—'}</span><span>{data.workers.find(x=>x.id===t.workerId)?.name||'—'}</span><span>{data.services.find(x=>x.id===t.serviceId)?.name||'—'}</span><b>{money(t.amount)}</b>{onDelete?<button className="miniDanger" onClick={()=>confirm('حذف الخدمة؟')&&onDelete(t.id)}><Trash2 size={14}/></button>:<span/>}
    </div>)}
    {!rows.length&&<Empty/>}
  </div>
}
function Expenses({data,search,onAdd,onDelete}) {
  const list=data.expenses.filter(x=>`${x.title} ${x.date}`.toLowerCase().includes(search.toLowerCase()))
  return <div><div className="pageHead"><div><h2>المصاريف</h2><p>سجل مصاريف المحل</p></div><button className="primary" onClick={onAdd}><Plus size={18}/> إضافة مصروف</button></div><section className="panel"><div className="expenseCards">{list.map(x=><div className="expense" key={x.id}><div><small>{x.date}</small><b>{x.title}</b></div><strong>{money(x.amount)}</strong><button onClick={()=>confirm('حذف المصروف؟')&&onDelete(x.id)}><Trash2 size={15}/></button></div>)}</div>{!list.length&&<Empty/>}</section></div>
}
function Payments({data,search,onAdd,onDelete}) {
  const list=data.payments.filter(x=>(data.workers.find(w=>w.id===x.workerId)?.name||'').toLowerCase().includes(search.toLowerCase()))
  return <div><div className="pageHead"><div><h2>الرواتب والدفعات</h2><p>متابعة مستحقات العمال والدفعات</p></div><button className="primary" onClick={onAdd}><Plus size={18}/> تسجيل دفعة</button></div><section className="panel"><div className="expenseCards">{list.map(x=><div className="expense" key={x.id}><div><small>{x.date}</small><b>{data.workers.find(w=>w.id===x.workerId)?.name||'—'}</b><small>{x.note}</small></div><strong>{money(x.amount)}</strong><button onClick={()=>confirm('حذف الدفعة؟')&&onDelete(x.id)}><Trash2 size={15}/></button></div>)}</div>{!list.length&&<Empty/>}</section></div>
}
function Reports({data,totals}) {
  const serviceMap=data.services.map(s=>({...s,count:data.transactions.filter(t=>t.serviceId===s.id).length,total:data.transactions.filter(t=>t.serviceId===s.id).reduce((a,t)=>a+Number(t.amount),0)}))
  return <div><div className="pageHead"><div><h2>التقارير</h2><p>ملخص مالي وتشغيلي للمحل</p></div></div>
    <div className="stats"><Stat icon={DollarSign} label="الإيرادات" value={money(totals.revenue)} note="الإجمالي"/><Stat icon={Receipt} label="المصاريف" value={money(totals.expenses)} note="الإجمالي"/><Stat icon={Wallet} label="الدفعات" value={money(totals.paid)} note="للعمال"/><Stat icon={TrendingUp} label="الربح" value={money(totals.profit)} note="صافي"/></div>
    <section className="panel"><div className="panelHead"><div><h3>الخدمات حسب الأداء</h3><small>عدد الخدمات وإيراداتها</small></div></div><div className="reportRows">{serviceMap.map(s=><div key={s.id}><span>{s.name}</span><i><em style={{width:`${Math.min(100, s.count*8+4)}%`}}/></i><b>{s.count} • {money(s.total)}</b></div>)}</div></section>
    <section className="panel"><div className="panelHead"><div><h3>معلومات التقرير</h3><small>يمكنك أخذ نسخة احتياطية من الإعدادات</small></div></div><div className="noteBox"><AlertCircle size={18}/><span>الأرقام هنا مبنية على العمليات المسجلة داخل النظام. عند إضافة قاعدة بيانات سحابية لاحقاً يمكن مزامنتها بين الأجهزة.</span></div></section>
  </div>
}
function SettingsPage({data,update,exportData,reset}) {
  const [name,setName]=useState(data.shop.name)
  return <div><div className="pageHead"><div><h2>الإعدادات</h2><p>تخصيص بيانات النظام</p></div></div>
    <section className="panel settings">
      <div className="setting"><div><b>اسم المحل</b><small>الاسم الذي يظهر في النظام</small></div><input value={name} onChange={e=>setName(e.target.value)}/><button className="primary small" onClick={()=>update('shop',{...data.shop,name})}><Save size={16}/> حفظ</button></div>
      <div className="setting"><div><b>العملة</b><small>عملة عرض الأسعار والتقارير</small></div><select value={data.shop.currency} onChange={e=>update('shop',{...data.shop,currency:e.target.value})}><option>AUD</option><option>USD</option><option>EUR</option></select></div>
      <div className="setting"><div><b>نسخة احتياطية</b><small>تنزيل جميع بيانات النظام كملف JSON</small></div><button className="secondary" onClick={exportData}><Download size={16}/> تنزيل النسخة</button></div>
      <div className="setting"><div><b>إعادة البيانات التجريبية</b><small>ترجع النظام للحالة الأولية</small></div><button className="dangerBtn" onClick={reset}>إعادة الضبط</button></div>
    </section>
    <div className="noteBox"><Database size={18}/><span>حالياً البيانات تُحفظ في هذا المتصفح تلقائياً. هذه النسخة جاهزة كواجهة ونظام تشغيل محلي، ويمكن ربطها بقاعدة بيانات سحابية في المرحلة التالية.</span></div>
  </div>
}
function Modal({type,item,data,onClose,onSave}) {
  const [form,setForm]=useState(item||initial(type,data))
  const set=(k,v)=>setForm(f=>({...f,[k]:v}))
  const cfg={
    worker:['عامل','workers',[['name','الاسم','text'],['phone','الهاتف','text'],['percentage','نسبة العامل','number']]],
    service:['خدمة','services',[['name','اسم الخدمة','text'],['price','السعر','number'],['duration','المدة بالدقائق','number']]],
    customer:['زبون','customers',[['name','الاسم','text'],['phone','الهاتف','text']]],
    expense:['مصروف','expenses',[['date','التاريخ','date'],['title','اسم المصروف','text'],['amount','المبلغ','number']]],
    payment:['دفعة','payments',[['date','التاريخ','date'],['workerId','العامل','worker'],['amount','المبلغ','number'],['note','ملاحظة','text']]],
    transaction:['تسجيل خدمة','transactions',[['date','التاريخ','date'],['customerId','الزبون','customer'],['workerId','العامل','worker'],['serviceId','الخدمة','service'],['amount','المبلغ','number'],['payment','طريقة الدفع','payment']]]
  }[type]
  const [title,key,fields]=cfg
  function submit(e) {
    e.preventDefault()
    const normalized={...form}
    if(type==='worker'||type==='service'||type==='customer'||type==='expense'||type==='payment'||type==='transaction') {
      for(const k of Object.keys(normalized)) if(['price','duration','percentage','visits','spent','amount','workerId','serviceId','customerId'].includes(k)) normalized[k]=Number(normalized[k])
    }
    onSave(key,normalized)
  }
  return <div className="modalBack" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={submit}><div className="modalHead"><div><h3>{item?'تعديل':'إضافة'} {title}</h3><small>أدخل البيانات ثم احفظ</small></div><button type="button" onClick={onClose}><X/></button></div>
    <div className="formGrid">{fields.map(([k,l,t])=><label key={k}>{l}
      {t==='worker'?<select value={form[k]??''} onChange={e=>set(k,e.target.value)} required><option value="">اختر العامل</option>{data.workers.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>:
       t==='service'?<select value={form[k]??''} onChange={e=>{const id=Number(e.target.value);const s=data.services.find(x=>x.id===id);setForm(f=>({...f,serviceId:id,amount:s?.price||f.amount}))}} required><option value="">اختر الخدمة</option>{data.services.map(x=><option key={x.id} value={x.id}>{x.name} - {money(x.price)}</option>)}</select>:
       t==='customer'?<select value={form[k]??''} onChange={e=>set(k,e.target.value)}><option value="">بدون زبون</option>{data.customers.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>:
       t==='payment'?<select value={form[k]??''} onChange={e=>set(k,e.target.value)}><option>نقدي</option><option>بطاقة</option><option>تحويل</option></select>:
       <input type={t} value={form[k]??''} onChange={e=>set(k,e.target.value)} required />}
    </label>)}</div>
    <div className="modalActions"><button type="button" className="secondary" onClick={onClose}>إلغاء</button><button className="primary"><Save size={17}/> حفظ</button></div>
  </form></div>
}
function initial(type,data) {
  const d=today()
  if(type==='worker') return {name:'',phone:'',percentage:50,active:true}
  if(type==='service') return {name:'',price:0,duration:30,active:true}
  if(type==='customer') return {name:'',phone:'',visits:0,spent:0}
  if(type==='expense') return {date:d,title:'',amount:0}
  if(type==='payment') return {date:d,workerId:data.workers[0]?.id||'',amount:0,note:'دفعة'}
  if(type==='transaction') return {date:d,customerId:'',workerId:data.workers[0]?.id||'',serviceId:data.services[0]?.id||'',amount:data.services[0]?.price||0,payment:'نقدي'}
}
function Empty(){return <div className="empty">لا توجد بيانات لعرضها</div>}

createRoot(document.getElementById('root')).render(<App />)
