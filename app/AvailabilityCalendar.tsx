'use client';
import {useEffect,useMemo,useState} from 'react';

const bookingUrl='https://www.airbnb.com/rooms/1040656905837979838?unique_share_id=1969906b-75c6-4522-9134-bbb38375fb07&viralityEntryPoint=1&s=76';
const key=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

export default function AvailabilityCalendar(){
  const [month,setMonth]=useState(()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1)});
  const [blocked,setBlocked]=useState<string[]>([]);
  const [connected,setConnected]=useState(true);
  useEffect(()=>{fetch('/api/availability').then(r=>r.json()).then(d=>{setBlocked(d.blocked||[]);setConnected(d.connected!==false)}).catch(()=>setConnected(false))},[]);
  const days=useMemo(()=>{const first=new Date(month.getFullYear(),month.getMonth(),1);const count=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();return [...Array(first.getDay()).fill(null),...Array.from({length:count},(_,i)=>new Date(month.getFullYear(),month.getMonth(),i+1))]},[month]);
  const today=new Date();today.setHours(0,0,0,0);
  return <div className="calendar-card">
    <div className="calendar-head"><button aria-label="Previous month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}>←</button><h3>{month.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h3><button aria-label="Next month" onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}>→</button></div>
    <div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=><span key={x}>{x}</span>)}</div>
    <div className="calendar-grid">{days.map((d,i)=>d?<span key={key(d)} className={`${blocked.includes(key(d))?'blocked':'available'} ${d<today?'past':''}`}>{d.getDate()}</span>:<span key={`blank-${i}`}/>)}</div>
    <div className="legend"><span><i className="available-dot"/>Available</span><span><i className="blocked-dot"/>Unavailable</span></div>
    {!connected&&<p className="calendar-note">Calendar synchronization will appear here after the Airbnb export link is connected.</p>}
    <a className="book-airbnb" href={bookingUrl} target="_blank" rel="noopener noreferrer">View dates and book on Airbnb</a>
  </div>
}
