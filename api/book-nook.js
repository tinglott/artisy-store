const SUPABASE_URL="https://lltlbjmurwhnotjegjrz.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdGxiam11cndobm90amVnanJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTA0MTEsImV4cCI6MjA5MDQyNjQxMX0.0GTC6Wf6hdyrWt68NuAJ4EclKZsfji1Fm0getKPo7As";
const clean=(v,n=200)=>String(v||'').trim().slice(0,n);
const emailOk=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)&&e.length<=254;
async function insert(table,data){return fetch(`https://lltlbjmurwhnotjegjrz.supabase.co/rest/v1/${table}`,{method:'POST',headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(data)})}
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','https://shop.artistrystore.com');
 res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS')return res.status(204).end();
 if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed'});
 const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
 if(b.website)return res.status(201).json({ok:true,message:'Thank you.'});
 const email=clean(b.email,254).toLowerCase();
 if(!emailOk(email))return res.status(400).json({ok:false,error:'Please enter a valid email address.'});
 const payload={email,first_name:clean(b.first_name,80)||null,source:clean(b.interest,80)||'book_nook',utm_source:clean(b.utm_source,100)||null,utm_medium:clean(b.utm_medium,100)||null,utm_campaign:clean(b.utm_campaign,100)||null,consent_version:'v1'};
 const r=await insert('book_nook_subscribers',payload);
 if(r.status===409)return res.status(200).json({ok:true,message:"You're already on the Book Nook list!"});
 if(!r.ok)return res.status(500).json({ok:false,error:'Signup could not be saved. Please try again.'});
 return res.status(201).json({ok:true,message:'Welcome to the Book Nook!'});
}
