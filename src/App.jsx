import React, { useState } from 'react';

import {
LayoutDashboard,
Users,
Scissors,
UserRound,
Receipt,
Wallet,
BarChart3,
Settings,
Search,
Bell,
Plus,
TrendingUp,
CircleDollarSign,
} from 'lucide-react';

const menu = [
['لوحة التحكم', LayoutDashboard],
['العملاء', Users],
['الخدمات والأسعار', Scissors],
['العمال', UserRound],
['المصروفات', Receipt],
['الرواتب والأجور', Wallet],
['التقارير', BarChart3],
['الإعدادات', Settings],
];

const initialWorkers = [
{
name: 'أحمد محمد',
services: 14,
revenue: 850,
rate: 40,
},
{
name: 'علي سامي',
services: 11,
revenue: 650,
rate: 50,
},
{
name: 'حسن خالد',
services: 9,
revenue: 500,
rate: 35,
},
{
name: 'وسيم محمد',
services: 7,
revenue: 450,
rate: 45,
},
];

const services = [
{
name: 'قص شعر',
count: 18,
value: 900,
},
{
name: 'لحية',
count: 8,
value: 240,
},
{
name: 'قص شعر + لحية',
count: 7,
value: 350,
},
{
name: 'تنظيف بشرة',
count: 5,
value: 250,
},
];

function StatCard({ icon: Icon, title, value, note }) {
return (
<div className="stat-card">
<div className="stat-icon">
<Icon size={21} />
</div>

<div className="stat-text">
<span>{title}</span>
<strong>{value}</strong>
<small>{note}</small>
</div>
</div>
);
}

export default function App() {
const [workers, setWorkers] = useState(initialWorkers);
const [activePage, setActivePage] = useState('لوحة التحكم');

const totalRevenue = workers.reduce(
(sum, worker) => sum + worker.revenue,
0
);

const totalWorkerShare = workers.reduce(
(sum, worker) =>
sum + (worker.revenue * worker.rate) / 100,
0
);

const totalShopShare =
totalRevenue - totalWorkerShare;

function updateRate(index, value) {
let rate = Number(value);

if (Number.isNaN(rate)) {
rate = 0;
}

if (rate < 0) {
rate = 0;
}

if (rate > 100) {
rate = 100;
}

setWorkers((currentWorkers) =>
currentWorkers.map((worker, workerIndex) =>
workerIndex === index
? {
...worker,
rate: rate,
}
: worker
)
);
}

return (
<div className="app-shell" dir="rtl">

<aside className="sidebar">

<div className="brand">

<div className="brand-mark">
<Scissors size={23} />
</div>

<div>
<strong>محل الحلاقة</strong>
<span>نظام الإدارة والمحاسبة</span>
</div>

</div>

<nav>
{menu.map(([label, Icon]) => (
<button
key={label}
className={`nav-item ${
activePage === label ? 'active' : ''
}`}
onClick={() => setActivePage(label)}
>
<Icon size={19} />
<span>{label}</span>
</button>
))}
</nav>

<div className="sidebar-footer">

<div className="status-dot"></div>

<div>
<strong>النظام يعمل</strong>
<span>آخر مزامنة منذ لحظات</span>
</div>

</div>

</aside>

<main className="main">

<header className="topbar">

<div>
<h1>{activePage}</h1>
<p>
إدارة سريعة لكل تفاصيل العمل اليومي
</p>
</div>

<div className="top-actions">

<button className="icon-button">
<Search size={19} />
</button>

<button className="icon-button">
<Bell size={19} />
</button>

<button className="profile">
خ
</button>

</div>

</header>

{activePage === 'لوحة التحكم' && (

<section className="content">

<div className="welcome-row">

<div>
<h2>أهلاً بك 👋</h2>

<p>
هنا نظرة سريعة على حركة المحل وأداء العمال.
</p>
</div>

<button className="primary-button">
<Plus size={18} />
تسجيل عملية
</button>

</div>

<div className="stats-grid">

<StatCard
icon={CircleDollarSign}
title="إجمالي الإيرادات"
value={`$${totalRevenue.toFixed(2)}`}
note="إجمالي مبيعات العمال"
/>

<StatCard
icon={Scissors}
title="الخدمات"
value={services.reduce(
(sum, service) =>
sum + service.count,
0
)}
note="خدمة مسجلة"
/>

<StatCard
icon={Users}
title="العمال"
value={workers.length}
note="عامل نشط"
/>

<StatCard
icon={TrendingUp}
title="حصة المحل"
value={`$${totalShopShare.toFixed(2)}`}
note="بعد خصم حصص العمال"
/>

</div>

<div className="dashboard-grid">

<section className="panel">

<div className="panel-head">

<div>
<h3>حساب العمال والمحل</h3>

<span>
نسبة كل عامل وحصته من المبيعات
</span>
</div>

</div>

<div className="worker-table">

<div className="table-head">

<span>العامل</span>
<span>الخدمات</span>
<span>المبيعات</span>
<span>النسبة</span>
<span>للعامل</span>
<span>للمحل</span>

</div>

{workers.map((worker, index) => {

const workerShare =
(worker.revenue * worker.rate) / 100;

const shopShare =
worker.revenue - workerShare;

return (

<div
className="worker-row"
key={worker.name}
>

<div className="worker-name">

<div>
{worker.name.charAt(0)}
</div>

<span>
{worker.name}
</span>

</div>

<span>
{worker.services}
</span>

<strong>
${worker.revenue.toFixed(2)}
</strong>

<div>

<input
type="number"
min="0"
max="100"
value={worker.rate}
onChange={(event) =>
updateRate(
index,
event.target.value
)
}
style={{
width: '65px',
padding: '6px',
borderRadius: '8px',
border: '1px solid #555',
background: 'transparent',
color: 'inherit',
textAlign: 'center',
}}
/>

<span> %</span>

</div>

<strong>
${workerShare.toFixed(2)}
</strong>

<strong>
${shopShare.toFixed(2)}
</strong>

</div>

);
})}

</div>

</section>

</div>

<div className="lower-grid">

<section className="panel">

<div className="panel-head">

<div>
<h3>ملخص الأرباح</h3>
<span>توزيع المبيعات</span>
</div>

</div>

<div className="summary-box">

<div className="summary-item">
<span>إجمالي المبيعات</span>

<strong>
${totalRevenue.toFixed(2)}
</strong>
</div>

<div className="summary-item">
<span>إجمالي حصة العمال</span>

<strong>
${totalWorkerShare.toFixed(2)}
</strong>
</div>

<div className="summary-item">
<span>إجمالي حصة المحل</span>

<strong>
${totalShopShare.toFixed(2)}
</strong>
</div>

</div>

</section>

<section className="panel">

<div className="panel-head">

<div>
<h3>الخدمات</h3>
<span>أكثر الخدمات طلباً</span>
</div>

</div>

<div className="service-list">

{services.map((service) => (

<div
className="service-row"
key={service.name}
>

<div className="service-info">

<span>
{service.name}
</span>

<small>
{service.count} عملية
</small>

</div>

<strong>
${service.value.toFixed(2)}
</strong>

</div>

))}

</div>

</section>

</div>

</section>

)}

{activePage === 'العمال' && (

<section className="content">

<div className="welcome-row">

<div>

<h2>العمال 👤</h2>

<p>
غيّر نسبة أي عامل وسيتم حساب حصته
وحصة المحل تلقائياً.
</p>

</div>

</div>

<section className="panel">

<div className="panel-head">

<div>

<h3>نسب العمال</h3>

<span>
النسبة قابلة للتغيير في أي وقت
</span>

</div>

</div>

<div className="worker-table">

<div className="table-head">

<span>العامل</span>
<span>المبيعات</span>
<span>نسبة العامل</span>
<span>حصة العامل</span>
<span>حصة المحل</span>

</div>

{workers.map((worker, index) => {

const workerShare =
(worker.revenue * worker.rate) / 100;

const shopShare =
worker.revenue - workerShare;

return (

<div
className="worker-row"
key={worker.name}
>

<div className="worker-name">

<div>
{worker.name.charAt(0)}
</div>

<span>
{worker.name}
</span>

</div>

<strong>
${worker.revenue.toFixed(2)}
</strong>

<div>

<input
type="number"
min="0"
max="100"
value={worker.rate}
onChange={(event) =>
updateRate(
index,
event.target.value
)
}
style={{
width: '70px',
padding: '7px',
borderRadius: '8px',
border: '1px solid #555',
background: 'transparent',
color: 'inherit',
textAlign: 'center',
}}
/>

<span> %</span>

</div>

<strong>
${workerShare.toFixed(2)}
</strong>

<strong>
${shopShare.toFixed(2)}
</strong>

</div>

);
})}

</div>

</section>

</section>

)}

{activePage !== 'لوحة التحكم' &&
activePage !== 'العمال' && (

<section className="content">

<div className="welcome-row">

<div>

<h2>{activePage}</h2>

<p>
هذه الصفحة موجودة في النظام،
وسنضيف وظائفها بالتدريج.
</p>

</div>

</div>

</section>

)}

</main>

</div>
);
}

