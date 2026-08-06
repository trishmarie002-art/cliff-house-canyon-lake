import {NextResponse} from 'next/server';

function format(d:Date){return d.toISOString().slice(0,10)}
export async function GET(){
  const url=process.env.AIRBNB_ICAL_URL;
  if(!url)return NextResponse.json({blocked:[],connected:false});
  try{
    const text=await fetch(url,{next:{revalidate:900}}).then(r=>{if(!r.ok)throw new Error('Calendar unavailable');return r.text()});
    const blocked=new Set<string>();
    for(const event of text.split('BEGIN:VEVENT').slice(1)){
      const start=event.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/)?.[1];
      const end=event.match(/DTEND(?:;VALUE=DATE)?:(\d{8})/)?.[1];
      if(!start||!end)continue;
      const parse=(v:string)=>new Date(Date.UTC(Number(v.slice(0,4)),Number(v.slice(4,6))-1,Number(v.slice(6,8))));
      for(let d=parse(start),last=parse(end);d<last;d=new Date(d.getTime()+86400000))blocked.add(format(d));
    }
    return NextResponse.json({blocked:[...blocked],connected:true});
  }catch{return NextResponse.json({blocked:[],connected:false},{status:200})}
}
