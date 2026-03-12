import React, { useState, useEffect, useRef } from "react";
import IMG_CAR from "./IMG_CAR.png";
import IMAGE_BG from "./IMAGE_BG.png";
import IMG_DOUBLE from "./IMG_DOUBLE.png";
import IMG_SINGLE_LOCAL from "./IMG_SINGLE.png";

const SINGLE_PIPE_LOCAL_IMAGE = IMG_SINGLE_LOCAL;
const PRODUCTS = [
  { id:1, name:"Single Pipe",  tag:"SINGLE",   img:SINGLE_PIPE_LOCAL_IMAGE, fallbackImg:IMG_DOUBLE, hoses:1, rentalPer4h:200, deposit:900,  desc:"Solo sessions & intimate vibes" },
  { id:2, name:"Double Pipe",  tag:"POPULAR",  img:IMG_DOUBLE, hoses:2, rentalPer4h:380, deposit:1500, desc:"Share the moment with a friend" },
  { id:3, name:"Car Hubbly",   tag:"NEW",     img:IMG_CAR,    hoses:1, rentalPer4h:150, deposit:300,  desc:"Smoke safely in your car" },
];

const COMBO_PACKAGES = [
  {
    id: "party",
    title: "Cloud Party Combo",
    basePrice: 580,
    pipes: 2,
    lines: [
      "2 Hookah pipes",
      "6 prepared heads",
      "1 flavour pack",
      "6 coconut charcoal pieces",
      "4 mouthpieces",
      "Free delivery & collection",
      "4 hour rental",
    ],
  },
  {
    id: "vip",
    title: "Cloud VIP Combo",
    basePrice: 750,
    pipes: 2,
    lines: [
      "2 Hookah pipes",
      "6 prepared heads",
      "2 flavour packs",
      "8 coconut charcoal pieces",
      "6 mouthpieces",
      "Free delivery & collection",
      "4 hour rental",
    ],
  },
  {
    id: "vvip",
    title: "Cloud VVIP Combo",
    basePrice: 1200,
    pipes: 3,
    lines: [
      "3 Hookah pipes",
      "8 prepared heads",
      "3 flavour packs",
      "12 coconut charcoal pieces",
      "8 mouthpieces",
      "Free delivery & collection",
      "4 hour rental",
    ],
  },
];

const COMBO_FLAVOURS = [
  "Double Apple",
  "Mint",
  "Grape",
  "Blueberry",
  "Watermelon",
];
const COMBO_MAX_FLAVOURS = 3;
const COMBO_MIN_HOURS = 4;
const COMBO_HOURS_STEP = 4;

const SI = {
  fb:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  ig:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  tt:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.75a4.85 4.85 0 01-1.02-.06z"/></svg>,
  x:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
};
const CONTACT_EMAIL = "cloud.hubbly@gmail.com";
const WA_LINK = "https://wa.me/27749428500";
const POLICY_ITEMS = [
  { kind:"rental", title:"Rental Fee", text:"Car Hubbly R150 | Single R200 | Double R380 (per 4h)." },
  { kind:"deposit", title:"Deposit", text:"Car Hubbly R300 | Single R900 | Double R1,500. Fully refundable." },
  { kind:"refund", title:"Instant Refund", text:"Return undamaged -> full deposit is refunded immediately." },
  { kind:"damage", title:"Damage", text:"Damage or missing parts are deducted from the deposit." },
  { kind:"delivery", title:"Free Delivery", text:"We deliver and collect every order. Always free." },
  { kind:"time", title:"Extensions", text:"Need extra time? Contact us before rental ends." },
];

function PolicyGlyph({ kind }) {
  const base = { width:18, height:18, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:"1.9", strokeLinecap:"round", strokeLinejoin:"round", "aria-hidden":true };
  if (kind === "rental") {
    return <svg {...base}><path d="M6 4h12v16l-3-2-3 2-3-2-3 2z"/><path d="M9 9h6M9 13h6"/></svg>;
  }
  if (kind === "deposit") {
    return <svg {...base}><path d="M12 3l7 3v6c0 4.4-2.8 7.8-7 9-4.2-1.2-7-4.6-7-9V6z"/><rect x="9" y="10.5" width="6" height="4.5" rx="1"/><path d="M10.5 10.5V9a1.5 1.5 0 013 0v1.5"/></svg>;
  }
  if (kind === "refund") {
    return <svg {...base}><path d="M4 12a8 8 0 0113.7-5.7"/><path d="M18 4v4h-4"/><path d="M20 12a8 8 0 01-13.7 5.7"/><path d="M6 20v-4h4"/></svg>;
  }
  if (kind === "damage") {
    return <svg {...base}><path d="M12 3l9 16H3z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
  }
  if (kind === "delivery") {
    return <svg {...base}><path d="M3 7h11v8H3z"/><path d="M14 10h3l3 3v2h-6z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/></svg>;
  }
  return <svg {...base}><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 1.5"/></svg>;
}

function Smoke() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf, ps = [];
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    class P {
      reset() {
        this.x=Math.random()*c.width; this.y=c.height+30;
        this.r=Math.random()*60+20; this.vx=(Math.random()-.5)*.35;
        this.vy=-(Math.random()*.45+.1); this.life=0;
        this.ml=Math.random()*260+150; this.w=Math.random()*Math.PI*2;
        this.a=Math.random()*.06+.02;
      }
      constructor(){ this.reset(); this.life=Math.random()*this.ml; }
      tick(){
        const p=this.life/this.ml; const a=this.a*(1-p);
        this.x+=this.vx+Math.sin(this.w+this.life*.012)*.25;
        this.y+=this.vy; this.r+=.14; this.life++;
        if(this.life>this.ml) this.reset();
        const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);
        g.addColorStop(0,`rgba(200,180,255,${a})`); g.addColorStop(1,"rgba(200,180,255,0)");
        ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      }
    }
    for(let i=0;i<25;i++) ps.push(new P());
    const loop=()=>{ ctx.clearRect(0,0,c.width,c.height); ps.forEach(p=>p.tick()); raf=requestAnimationFrame(loop); };
    loop();
    return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:2}}/>;
}

function Tip({ text }) {
  const [show,setShow]=useState(false);
  return (
    <span style={{position:"relative",display:"inline-flex",alignItems:"center"}}>
      <span onClick={()=>setShow(s=>!s)} style={{width:14,height:14,border:"1.5px solid #ccc",borderRadius:"50%",
        display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,cursor:"pointer",
        fontStyle:"italic",fontFamily:"Georgia,serif",marginLeft:4,color:"#bbb",flexShrink:0}}>i</span>
      {show&&<span style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",
        background:"#222",color:"#fff",fontSize:10,lineHeight:1.5,padding:"7px 10px",width:180,
        zIndex:9999,pointerEvents:"none",borderRadius:8,boxShadow:"0 6px 20px rgba(0,0,0,.4)"}}>
        {text}
        <span style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
          borderLeft:"4px solid transparent",borderRight:"4px solid transparent",borderTop:"4px solid #222"}}/>
      </span>}
    </span>
  );
}

function Card({ p, onAdd, onOpen }) {
  const [added,setAdded]=useState(false);
  const hours=4;
  const rental=p.rentalPer4h;
  const total=rental+p.deposit;
  const tagC={"NEW":"#7c3aed","POPULAR":"#111","Popular":"#111","Group":"#166534"};

  function handleAdd(){
    onAdd(p,hours,rental,total);
    setAdded(true);
    setTimeout(()=>setAdded(false),1800);
  }

  return (
    <article style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,.08)",width:232,flexShrink:0,scrollSnapAlign:"start",border:"1px solid #eee"}}>
      {p.tag&&(
        <div style={{padding:"10px 12px 0"}}>
          <span style={{display:"inline-block",background:tagC[p.tag]||"#555",color:"#fff",fontSize:9,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",padding:"3px 9px",borderRadius:99}}>
            {p.tag}
          </span>
        </div>
      )}
      <button onClick={()=>onOpen(p)} style={{position:"relative",background:"#f2f2f2",height:172,display:"flex",alignItems:"center",justifyContent:"center",border:"none",width:"100%",cursor:"pointer",padding:10}}>
        <img
          src={p.img}
          alt={p.name}
          onError={e=>{
            if (p.fallbackImg && e.currentTarget.src !== p.fallbackImg) {
              e.currentTarget.src = p.fallbackImg;
            }
          }}
          style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center",filter:"drop-shadow(0 4px 10px rgba(0,0,0,.12))"}}
        />
      </button>
      <div style={{padding:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
          <span style={{fontWeight:800,fontSize:15,color:"#111"}}>{p.name}</span>
          <span style={{fontSize:9,color:"#ccc"}}>{p.hoses} hose{p.hoses>1?"s":""}</span>
        </div>
        <p style={{fontSize:11,color:"#aaa",margin:"0 0 10px",lineHeight:1.4,minHeight:30}}>{p.desc}</p>

        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",marginBottom:8}}>
          <span>Rental (4h)</span>
          <strong>R{rental.toLocaleString()}</strong>
        </div>

        <div style={{background:"#fafafa",border:"1px solid #f0f0f0",borderRadius:10,padding:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",marginBottom:5}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:4}}>Deposit <Tip text="Full deposit is refunded when the pipe is returned undamaged." /></span>
            <strong>R{p.deposit.toLocaleString()}</strong>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #ececec",paddingTop:7}}>
            <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"#999"}}>Total now</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:17,fontWeight:900,color:"#111"}}>R{total.toLocaleString()}</span>
              <button onClick={handleAdd} aria-label={`Add ${p.name}`} style={{width:29,height:29,borderRadius:"50%",border:"none",background:added?"#166834":"#111",color:"#fff",fontSize:21,lineHeight:1,cursor:"pointer",display:"grid",placeItems:"center"}}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function DeliveryField({ label, value, onChange, type="text", ph="", inputProps={} }) {
  return (
    <div style={{marginBottom:11}}>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#aaa",marginBottom:4}}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={ph}
        {...inputProps}
        style={{width:"100%",padding:"10px 11px",border:"1.5px solid #eee",borderRadius:9,
          fontSize:13,fontFamily:"-apple-system,sans-serif",outline:"none",
          boxSizing:"border-box",background:"#fafafa",color:"#111"}}
        onFocus={e=>e.target.style.borderColor="#111"}
        onBlur={e=>e.target.style.borderColor="#eee"}
      />
    </div>
  );
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTimeInputValue(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const BOOKING_AVAILABLE_FROM = "2026-03-16";
const BOOKING_REQUEST_TIMEOUT_MS = 20000;

function getBookingMinDate() {
  const today = formatDateInputValue(new Date());
  return today > BOOKING_AVAILABLE_FROM ? today : BOOKING_AVAILABLE_FROM;
}

function createInitialCheckoutForm() {
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  soon.setMinutes(0, 0, 0);
  const bookingMinDate = getBookingMinDate();
  return {
    name: "",
    phone: "",
    email: "",
    address: "",
    suburb: "",
    notes: "",
    bookingDate: bookingMinDate,
    bookingTime: formatTimeInputValue(soon),
  };
}

export default function App() {
  const [cart,setCart]=useState([]);
  const [page,setPage]=useState("home");
  const [menuOpen,setMenuOpen]=useState(false);
  const [step,setStep]=useState(1);
  const [paying,setPaying]=useState(false);
  const [paymentState,setPaymentState]=useState("");
  const [paidOrderNumber,setPaidOrderNumber]=useState("");
  const [bookingSubmitting,setBookingSubmitting]=useState(false);
  const [form,setForm]=useState(()=>createInitialCheckoutForm());
  const [toast,setToast]=useState("");
  const [heroBtnHover,setHeroBtnHover]=useState("");
  const [contactForm,setContactForm]=useState({name:"",phone:"",email:"",subject:"",message:""});
  const [activeProduct,setActiveProduct]=useState(null);
  const [activeHours,setActiveHours]=useState(4);
  const [activeCombo,setActiveCombo]=useState(null);
  const [comboFlavours,setComboFlavours]=useState([]);
  const [comboHours,setComboHours]=useState(COMBO_MIN_HOURS);
  const [comboWeed,setComboWeed]=useState(false);
  const [cartHourEditor,setCartHourEditor]=useState(null);
  const [homeTopBarDark,setHomeTopBarDark]=useState(true);
  const toastTm=useRef(null);
  const mainRef=useRef(null);
  const heroRef=useRef(null);
  const shopRef=useRef(null);
  const combosRef=useRef(null);
  const policyRef=useRef(null);
  const aboutRef=useRef(null);
  const contactRef=useRef(null);
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000").replace(/\/+$/,"");
  const checkoutEnabled = String(import.meta.env.VITE_CHECKOUT_ENABLED || "false").toLowerCase() === "true";
  const engagementEnabled = String(import.meta.env.VITE_ENGAGEMENT_ENABLED || "true").toLowerCase() === "true";
  const prelaunchSource = String(import.meta.env.VITE_PRELAUNCH_SOURCE || "ads-prelaunch");
  const minBookingDate = getBookingMinDate();
  const bookingDateLocked = String(form.bookingDate || "") < minBookingDate;
  const sessionIdRef = useRef("");

  const cartRental=cart.reduce((s,i)=>s+i.rentalCost,0);
  const cartDeposit=cart.reduce((s,i)=>s+i.deposit,0);
  const cartTotal=cartRental+cartDeposit;
  const activeRental=activeProduct?activeProduct.rentalPer4h*(activeHours/4):0;
  const activeTotalNow=activeRental+(activeProduct?.deposit||0);
  const doublePipeDeposit = PRODUCTS.find(p=>p.name==="Double Pipe")?.deposit || 1500;
  const comboAddOnPrice = 105;
  const activeComboAddOn = comboWeed ? comboAddOnPrice : 0;
  const activeComboBaseRental = activeCombo ? activeCombo.basePrice * (comboHours / COMBO_MIN_HOURS) : 0;
  const activeComboRental = activeComboBaseRental + activeComboAddOn;
  const activeComboDeposit = activeCombo ? activeCombo.pipes * doublePipeDeposit : 0;
  const activeComboTotal = activeComboRental + activeComboDeposit;
  const roundMoney = (value) => Number(Number(value).toFixed(2));

  function toast_(msg){ setToast(msg); clearTimeout(toastTm.current); toastTm.current=setTimeout(()=>setToast(""),2000); }
  function addToCart(p,hours,rentalCost){
    const unitRentalCost = roundMoney(rentalCost);
    const unitDeposit = roundMoney(Number(p.deposit || 0));
    const quantity = 1;
    const nextRental = roundMoney(unitRentalCost * quantity);
    const nextDeposit = roundMoney(unitDeposit * quantity);
    setCart(b=>[...b,{
      ...p,
      hours,
      quantity,
      unitRentalCost,
      unitDeposit,
      rentalCost: nextRental,
      deposit: nextDeposit,
      totalNow: roundMoney(nextRental + nextDeposit),
    }]);
    toast_(`${p.name} added!`);
    trackEvent("add_to_cart",{ productName: p.name, hours, cartSize: cart.length + 1 });
  }
  function removeCartItem(index){
    const removed = cart[index];
    setCart(c=>c.filter((_,idx)=>idx!==index));
    setCartHourEditor(null);
    if(removed){
      trackEvent("remove_from_cart",{ productName: removed.name });
    }
  }
  function changeCartQuantity(index,delta){
    setCart(current=>current.map((item,idx)=>{
      if(idx!==index) return item;
      const currentQty = Math.max(1, Number(item.quantity || 1));
      const nextQty = Math.max(1, currentQty + delta);
      const unitRentalCost = roundMoney(Number(item.unitRentalCost ?? item.rentalCost ?? 0));
      const unitDeposit = roundMoney(Number(item.unitDeposit ?? item.deposit ?? 0));
      const rentalCost = roundMoney(unitRentalCost * nextQty);
      const deposit = roundMoney(unitDeposit * nextQty);
      return {
        ...item,
        quantity: nextQty,
        unitRentalCost,
        unitDeposit,
        rentalCost,
        deposit,
        totalNow: roundMoney(rentalCost + deposit),
      };
    }));
  }
  function calcUnitRentalCostForHours(item,nextHours){
    if (item.isCombo) {
      const addOn = item.weedBag ? comboAddOnPrice : 0;
      const currentHours = Math.max(COMBO_MIN_HOURS, Number(item.hours || COMBO_MIN_HOURS));
      const fallbackBase = (Number(item.unitRentalCost || 0) - addOn) * (COMBO_MIN_HOURS / currentHours);
      const comboBasePrice = Number(item.comboBasePrice || fallbackBase || 0);
      return roundMoney((comboBasePrice * (nextHours / COMBO_MIN_HOURS)) + addOn);
    }
    const currentHours = Math.max(4, Number(item.hours || 4));
    const fallbackRate = (Number(item.unitRentalCost || 0) * 4) / currentHours;
    const rentalPer4h = Number(item.rentalPer4h || fallbackRate || 0);
    return roundMoney(rentalPer4h * (nextHours / 4));
  }
  function openCartHoursEditor(index){
    const item = cart[index];
    if (!item) return;
    const min = item.isCombo ? COMBO_MIN_HOURS : 4;
    const step = item.isCombo ? COMBO_HOURS_STEP : 4;
    setCartHourEditor({
      index,
      min,
      step,
      hours: Math.max(min, Number(item.hours || min)),
      name: item.name,
    });
  }
  function changeCartHourDraft(delta){
    setCartHourEditor(curr=>{
      if (!curr) return curr;
      return {
        ...curr,
        hours: Math.max(curr.min, Number(curr.hours || curr.min) + delta),
      };
    });
  }
  function applyCartHourDraft(){
    if (!cartHourEditor) return;
    const { index, hours } = cartHourEditor;
    setCart(current=>current.map((item,idx)=>{
      if(idx!==index) return item;
      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitRentalCost = calcUnitRentalCostForHours(item, hours);
      const unitDeposit = roundMoney(Number(item.unitDeposit ?? item.deposit ?? 0));
      const rentalCost = roundMoney(unitRentalCost * quantity);
      const deposit = roundMoney(unitDeposit * quantity);
      return {
        ...item,
        hours,
        unitRentalCost,
        unitDeposit,
        rentalCost,
        deposit,
        totalNow: roundMoney(rentalCost + deposit),
      };
    }));
    setCartHourEditor(null);
    toast_("Rental hours updated.");
  }
  function openProduct(p){ setActiveProduct(p); setActiveHours(4); }
  function openCombo(combo){
    setActiveCombo(combo);
    setComboFlavours([]);
    setComboHours(COMBO_MIN_HOURS);
    setComboWeed(false);
  }
  function toggleComboFlavour(flavour){
    setComboFlavours(curr=>{
      if (curr.includes(flavour)) return curr.filter(f=>f!==flavour);
      if (curr.length >= COMBO_MAX_FLAVOURS) {
        toast_(`Select up to ${COMBO_MAX_FLAVOURS} flavours.`);
        return curr;
      }
      return [...curr, flavour];
    });
  }
  function comboLine(item){
    const flavourText = item.flavours?.length ? item.flavours.join(", ") : (item.flavour || "Any flavour");
    const extras = [];
    extras.push(`Flavour: ${flavourText}`);
    if (item.weedBag) extras.push(`Weed bag +R${comboAddOnPrice}`);
    return `${item.name} - ${item.hours}h${extras.length ? ` | ${extras.join(" | ")}` : ""}`;
  }
  function addComboToCart(){
    if (!activeCombo) return;
    const rentalCost = activeCombo.basePrice * (comboHours / COMBO_MIN_HOURS) + (comboWeed ? comboAddOnPrice : 0);
    const deposit = activeCombo.pipes * doublePipeDeposit;
    const totalNow = rentalCost + deposit;
    const selectedFlavours = comboFlavours.slice(0, COMBO_MAX_FLAVOURS);
    const flavourLabel = selectedFlavours.length ? selectedFlavours.join(", ") : "Any flavour";
    setCart(b=>[...b,{
      id:`combo-${activeCombo.id}-${Date.now()}`,
      name:activeCombo.title,
      img:IMG_DOUBLE,
      fallbackImg:IMG_DOUBLE,
      hoses:activeCombo.pipes,
      desc:"Combo package",
      isCombo:true,
      flavour:flavourLabel,
      flavours:selectedFlavours,
      weedBag:comboWeed,
      comboBasePrice:activeCombo.basePrice,
      quantity:1,
      unitRentalCost:rentalCost,
      unitDeposit:deposit,
      hours:comboHours,
      rentalCost,
      deposit,
      totalNow,
    }]);
    toast_(`${activeCombo.title} added!`);
    trackEvent("add_to_cart",{ productName: activeCombo.title, hours: comboHours, isCombo: true });
    setActiveCombo(null);
  }
  function goSection(ref){ setMenuOpen(false); setTimeout(()=>{ setPage("home"); setTimeout(()=>ref?.current?.scrollIntoView({behavior:"smooth",block:"start"}),80); },300); }
  const upd=(k,v)=>setForm(f=>({...f,[k]:v}));
  const updContact=(k,v)=>setContactForm(f=>({...f,[k]:v}));
  function getSessionId(){
    if(sessionIdRef.current) return sessionIdRef.current;
    try {
      const existing = localStorage.getItem("cloud9_session_id");
      if(existing){
        sessionIdRef.current = existing;
        return existing;
      }
      const created = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;
      localStorage.setItem("cloud9_session_id", created);
      sessionIdRef.current = created;
      return created;
    } catch {
      const fallback = `sess_${Date.now().toString(36)}`;
      sessionIdRef.current = fallback;
      return fallback;
    }
  }

  function trackEvent(eventName, meta={}){
    if(!engagementEnabled) return;
    const payload = {
      sessionId: getSessionId(),
      eventName,
      page,
      meta,
    };
    fetch(`${apiBaseUrl}/engagement/event`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload),
      keepalive:true,
    }).catch(()=>{});
  }

  function buildCheckoutItems(){
    return cart.map(item=>{
      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitTotal = roundMoney(Number(item.totalNow || 0) / quantity);
      return {
        product_name: item.name,
        quantity,
        hours: Number(item.hours || 0),
        price: unitTotal,
        totalNow: roundMoney(unitTotal * quantity),
      };
    });
  }

  function submitBookingRequest(){
    if(!form.name || !form.phone || !form.address || !form.bookingDate || !form.bookingTime){
      alert("Please fill Name, Phone, Address, Booking Date & Booking Time.");
      setStep(1);
      return;
    }
    if(bookingDateLocked){
      alert("Bookings are available from 16 March 2026 onward.");
      return;
    }
    if(cart.length===0){
      alert("Your cart is empty.");
      return;
    }

    const items = buildCheckoutItems();
    const currentTotal = cartTotal;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), BOOKING_REQUEST_TIMEOUT_MS);
    setBookingSubmitting(true);

    fetch(`${apiBaseUrl}/book-now`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      signal: controller.signal,
      body:JSON.stringify({
        customer:{
          name:form.name,
          phone:form.phone,
          email:form.email || "",
          address:form.address,
          suburb:form.suburb || "",
          notes:form.notes || "",
          bookingDate: form.bookingDate,
          bookingTime: form.bookingTime,
        },
        items,
        totalAmount: currentTotal,
        source: prelaunchSource,
      }),
    })
      .then(async res=>{
        const data = await res.json().catch(()=>({}));
        if(!res.ok){
          throw new Error(data?.details || data?.error || "Could not submit booking request");
        }
        const reference = data.bookingReference || (data.bookingId ? `BK-${String(data.bookingId).padStart(5, "0")}` : "");
        setPaidOrderNumber(reference);
        setPaymentState("booking");
        setStep(3);
        setCart([]);
        toast_("Booking request sent.");
        trackEvent("booking_submitted",{ bookingReference: reference, total: currentTotal, cartItems: items.length });
      })
      .catch(err=>{
        console.error("Booking request failed:", err);
        const msg = String(err?.message || "");
        if (err?.name === "AbortError") {
          alert(
            "Booking request timed out. Please try again in a few seconds. " +
            "If this keeps happening, check backend status and Render logs."
          );
          return;
        }
        if (/failed to fetch/i.test(msg)) {
          alert(
            `Could not reach booking server at ${apiBaseUrl}.\n` +
            `Start backend and make sure CORS allows ${window.location.origin}.`
          );
        } else {
          alert(msg || "Could not submit booking request.");
        }
      })
      .finally(()=>{
        window.clearTimeout(timeoutId);
        setBookingSubmitting(false);
      });
  }

  function sendContactMessage(e){
    e.preventDefault();
    const name = contactForm.name.trim();
    const phone = contactForm.phone.trim();
    const email = contactForm.email.trim();
    const subject = contactForm.subject.trim();
    const message = contactForm.message.trim();
    if(!name || !phone || !email || !subject || !message){
      alert("Please fill all Contact fields.");
      return;
    }
    const body = [
      `Name: ${name}`,
      `Number: ${phone}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast_("Opening your email app...");
    setContactForm({name:"",phone:"",email:"",subject:"",message:""});
  }

  function startPayfastCheckout(){
    if(!checkoutEnabled){
      submitBookingRequest();
      return;
    }
    if(!form.name || !form.phone || !form.address){
      alert("Please fill Name, Phone & Address.");
      setStep(1);
      return;
    }
    if(cart.length===0){
      alert("Your cart is empty.");
      return;
    }

    setPaymentState("");
    setPaying(true);
    const items = buildCheckoutItems();
    trackEvent("checkout_payment_started",{ cartItems: items.length, total: cartTotal });

    fetch(`${apiBaseUrl}/create-order`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        customer:{
          name:form.name,
          phone:form.phone,
          email:form.email || "",
          address:[form.address,form.suburb].filter(Boolean).join(", "),
          notes:[form.notes || "", `Preferred booking: ${form.bookingDate} ${form.bookingTime}`].filter(Boolean).join(" | "),
          bookingDate: form.bookingDate,
          bookingTime: form.bookingTime,
        },
        items,
        currency:"ZAR",
      }),
    })
      .then(async res=>{
        const data = await res.json().catch(()=>({}));
        if(!res.ok){
          throw new Error(data?.details || data?.error || "Could not create order");
        }
        if(!data?.payfastUrl || !data?.payload){
          throw new Error("Invalid Payfast payload from server");
        }
        setPaidOrderNumber(data.orderNumber || "");
        try {
          localStorage.setItem("cloud9_last_order_number", data.orderNumber || "");
        } catch {}

        const pfForm = document.createElement("form");
        pfForm.method = "POST";
        pfForm.action = data.payfastUrl;
        pfForm.style.display = "none";
        Object.entries(data.payload).forEach(([key,value])=>{
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value == null ? "" : String(value);
          pfForm.appendChild(input);
        });
        document.body.appendChild(pfForm);
        pfForm.submit();
      })
      .catch(err=>{
        console.error("Payfast checkout init failed:", err);
        const msg = String(err?.message || "");
        if (/failed to fetch/i.test(msg)) {
          alert(
            `Could not reach payment server at ${apiBaseUrl}.\n` +
            `Start backend and make sure CORS allows ${window.location.origin}.`
          );
        } else {
          alert(msg || "Could not start Payfast checkout.");
        }
        setPaying(false);
      });
  }

  useEffect(()=>{
    const sessionId = getSessionId();
    trackEvent("session_started",{
      sessionId,
      path: window.location.pathname,
      checkoutEnabled,
    });
  },[]);

  useEffect(()=>{
    trackEvent("page_view",{ page });
  },[page]);

  useEffect(()=>{
    if(page==="checkout" && step===2){
      trackEvent(checkoutEnabled ? "payment_step_viewed" : "booking_step_viewed",{
        cartItems: cart.length,
        total: cartTotal,
      });
    }
  },[page,step,checkoutEnabled,cart.length,cartTotal]);

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const orderNo = params.get("order_number") || "";
    if(payment === "success"){
      setPaymentState("success");
      setPaidOrderNumber(orderNo || (localStorage.getItem("cloud9_last_order_number") || ""));
      setPage("checkout");
      setStep(3);
      setCart([]);
      setPaying(false);
      toast_("Payment successful.");
    } else if (payment === "cancel"){
      setPaymentState("cancel");
      setPage("checkout");
      setStep(2);
      setPaying(false);
      toast_("Payment cancelled.");
    } else if (payment === "failed"){
      setPaymentState("failed");
      setPage("checkout");
      setStep(2);
      setPaying(false);
      toast_("Payment failed.");
    }
    if(payment){
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  },[]);

  useEffect(()=>{
    if(page!=="home"){
      setHomeTopBarDark(false);
      return;
    }
    const scroller = mainRef.current;
    if(!scroller) return;
    const updateTopBarTone = ()=>{
      const heroHeight = heroRef.current?.offsetHeight || 680;
      const cutoff = Math.max(140, heroHeight - 170);
      setHomeTopBarDark(scroller.scrollTop < cutoff);
    };
    updateTopBarTone();
    scroller.addEventListener("scroll", updateTopBarTone, { passive:true });
    window.addEventListener("resize", updateTopBarTone);
    return ()=>{
      scroller.removeEventListener("scroll", updateTopBarTone);
      window.removeEventListener("resize", updateTopBarTone);
    };
  },[page]);

  const TopBar=({dark=false})=>(
    <div style={{position:"absolute",top:"calc(env(safe-area-inset-top, 0px) + 8px)",left:0,right:0,height:48,
      display:"grid",gridTemplateColumns:"48px 1fr 48px",
      alignItems:"center",paddingLeft:14,paddingRight:14,zIndex:40}}>
      <button onClick={()=>setMenuOpen(true)}
        style={{width:36,height:36,background:dark?"transparent":"rgba(0,0,0,.38)",
          border:"none",borderRadius:10,cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4.5,
          backdropFilter:dark?"none":"blur(8px)"}}>
        {[0,1,2].map(i=><span key={i} style={{width:15,height:1.5,background:"#fff",borderRadius:2,display:"block"}}/>)}
      </button>
      <span style={{textAlign:"center",fontFamily:"Georgia,serif",fontWeight:900,
        fontSize:16,color:dark?"#fff":"#111",letterSpacing:".2em",userSelect:"none",cursor:"pointer"}}
        onClick={()=>{setPage("home");setTimeout(()=>mainRef.current?.scrollTo({top:0,behavior:"smooth"}),60);}}>
        CLOUD 9
      </span>
      <button onClick={()=>setPage("cart")}
        style={{width:36,height:36,background:dark?"transparent":"rgba(0,0,0,.38)",
          border:"none",borderRadius:10,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          backdropFilter:dark?"none":"blur(8px)",position:"relative",justifySelf:"end"}}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {cart.length>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#ef4444",
          color:"#fff",width:15,height:15,borderRadius:"50%",fontSize:8,fontWeight:900,
          display:"flex",alignItems:"center",justifyContent:"center"}}>{cart.length}</span>}
      </button>
    </div>
  );

  const navItems=[
    {label:"Rentals", ref:shopRef},
    {label:"Combos",  ref:combosRef},
    {label:"Policy",  ref:policyRef},
    {label:"About",   ref:aboutRef},
    {label:"Contact", ref:contactRef},
  ];

  const heroButtonStyle = (id) => ({
    flex: 1,
    minWidth: 0,
    padding: "11px 0",
    background: heroBtnHover === id ? "#fff" : "transparent",
    color: heroBtnHover === id ? "#000" : "#fff",
    border: "1px solid rgba(255,255,255,.72)",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: ".1em",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: heroBtnHover === id ? "0 0 18px rgba(255,255,255,.75), 0 0 36px rgba(255,255,255,.42)" : "none",
    transition: "all .22s ease",
  });

  return (
    <div style={{minHeight:"100dvh",
      background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
      fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"}}>

      <div style={{position:"relative",width:"100%",minHeight:"100dvh"}}>
        {/* Screen */}
        <div style={{position:"relative",zIndex:2,background:"#f2f2f2",
          overflow:"hidden",height:"100dvh",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.08)"}}>
          {/* Toast */}
          <div style={{position:"absolute",bottom:24,left:"50%",zIndex:500,
            transform:`translateX(-50%) translateY(${toast?"0":"50px"})`,
            background:"rgba(0,0,0,.86)",color:"#fff",padding:"8px 16px",
            borderRadius:99,fontSize:11,fontWeight:700,whiteSpace:"nowrap",
            pointerEvents:"none",transition:"transform .3s",
            boxShadow:"0 4px 14px rgba(0,0,0,.3)"}}>
            {toast}
          </div>

          {/* ══════════════════════════════════════ */}
          {/* SIDE DRAWER MENU — overlays home page  */}
          {/* ══════════════════════════════════════ */}

          {/* Dim overlay — only covers the right part (not the drawer itself) */}
          <div onClick={()=>setMenuOpen(false)}
            style={{position:"absolute",inset:0,zIndex:149,
              background:"rgba(0,0,0,.45)",backdropFilter:"blur(2px)",
              opacity:menuOpen?1:0,pointerEvents:menuOpen?"all":"none",
              transition:"opacity .3s"}}/>

          {/* Drawer panel — slides in from left, only 72% wide */}
          <div style={{
            position:"absolute",top:0,left:0,bottom:0,
            width:"72%",
            background:"rgba(10,10,10,.93)",
            backdropFilter:"blur(20px)",
            zIndex:150,
            transform:menuOpen?"translateX(0)":"translateX(-100%)",
            transition:"transform .35s cubic-bezier(.4,0,.2,1)",
            display:"flex",flexDirection:"column",
            borderRight:"1px solid rgba(255,255,255,.07)",
          }}>
            {/* Drawer header */}
            <div style={{paddingTop:"calc(env(safe-area-inset-top, 0px) + 20px)",paddingRight:20,paddingBottom:20,paddingLeft:20,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
              <span style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:18,
                color:"#fff",letterSpacing:".18em"}}>CLOUD 9</span>
              <div style={{fontSize:9,letterSpacing:".3em",textTransform:"uppercase",
                color:"rgba(255,255,255,.3)",marginTop:4}}>
                {"Cape Town \u2022 Hookah Rentals"}
              </div>
            </div>

            {/* Nav items — no icons, white dividers */}
            <div style={{flex:1,overflowY:"auto"}}>
              {navItems.map((item,i)=>(
                <button key={item.label} onClick={()=>goSection(item.ref)}
                  style={{width:"100%",padding:"17px 22px",
                    background:"transparent",border:"none",
                    borderBottom:"none",
                    textAlign:"left",cursor:"pointer",
                    fontSize:15,fontWeight:600,color:"rgba(255,255,255,.85)",
                    letterSpacing:".04em",
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  {item.label}
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            {/* Socials at bottom of drawer */}
            <div style={{padding:"8px 0 36px"}}>
              <div style={{padding:"0 22px 10px",fontSize:10,fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.42)",textAlign:"center"}}>
                FOLLOW US
              </div>
              <div style={{display:"flex",justifyContent:"space-around",alignItems:"center",paddingLeft:22,paddingRight:22}}>
                {[{ic:SI.fb,url:"https://www.facebook.com/profile.php?id=61582266356916",c:"#1877f2"},
                  {ic:SI.ig,url:"https://www.instagram.com/cloud.hubbly/?hl=en",c:"#e1306c"},
                  {ic:SI.tt,url:"https://www.tiktok.com/@cloud9_hookah",c:"#fff"},
                  {ic:SI.x,url:"https://x.com",c:"rgba(255,255,255,.7)"}].map((s,i)=>(
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"center",justifyContent:"center",
                      color:s.c,textDecoration:"none",padding:"6px"}}>{s.ic}</a>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════ */}
          {/* PAGE: HOME                          */}
          {/* ══════════════════════════════════ */}
          <div style={{position:"absolute",inset:0,
            transform:page==="home"?"translateX(0)":"translateX(-100%)",
            transition:"transform .35s cubic-bezier(.4,0,.2,1)",
            background:"#f2f2f2",display:"flex",flexDirection:"column"}}>
            <TopBar dark={homeTopBarDark}/>
            <div ref={mainRef} style={{flex:1,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch"}} id="mainScroll">

                            {/* HERO */}
              <div ref={heroRef} style={{position:"relative",height:"100svh",minHeight:"min(680px, 100svh)",overflow:"hidden",flexShrink:0,background:"#000"}}>
                <img src={IMAGE_BG} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"62% center",opacity:.66,transform:"scale(1.02)"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(0,0,0,.9) 0%,rgba(0,0,0,.7) 36%,rgba(0,0,0,.28) 64%,rgba(0,0,0,.58) 100%)"}}/>
                <Smoke/>

                <div style={{position:"absolute",top:"clamp(108px, 16vw, 132px)",left:0,right:0,padding:"0 18px",zIndex:5,textAlign:"center"}}>
                  <div style={{fontSize:10,letterSpacing:".34em",textTransform:"uppercase",color:"rgba(255,255,255,.64)"}}>
                    {"CAPE TOWN \u2022 PREMIUM HOOKAH RENTAL"}
                  </div>
                </div>

                <div style={{position:"absolute",left:0,right:0,top:"clamp(150px, 26vw, 182px)",zIndex:5,padding:"0 18px"}}>
                  <div style={{width:"min(340px, 90vw)",margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"clamp(44px, 12vw, 80px)"}}>
                    <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:"clamp(56px, 15vw, 70px)",color:"#fff",lineHeight:.8,letterSpacing:".02em"}}>
                      CLOUD
                      <br/>
                      <span style={{fontSize:"clamp(118px, 30vw, 160px)",color:"transparent",WebkitTextStroke:"1px rgba(255,255,255,.25)"}}>9</span>
                      <br/>
                      <span style={{fontSize:"clamp(21px, 6vw, 25px)",color:"#fff",letterSpacing:".04em"}}>HOOKAH</span>
                    </div>
                    <p style={{fontSize:"clamp(14px, 4vw, 16px)",color:"rgba(255,255,255,.66)",lineHeight:1.55,maxWidth:280,margin:0}}>Premium pipes delivered to your door</p>
                  </div>
                </div>

                <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",bottom:"clamp(150px, 34vw, 270px)",zIndex:6,width:"min(320px, 86vw)",display:"flex",gap:10,flexWrap:"nowrap"}}>
                  <button onClick={()=>shopRef.current?.scrollIntoView({behavior:"smooth"})}
                    style={heroButtonStyle("shop")}
                    onMouseEnter={()=>setHeroBtnHover("shop")}
                    onMouseLeave={()=>setHeroBtnHover("")}>
                    Rent Now
                  </button>
                  <button onClick={()=>combosRef.current?.scrollIntoView({behavior:"smooth"})}
                    style={heroButtonStyle("combos")}
                    onMouseEnter={()=>setHeroBtnHover("combos")}
                    onMouseLeave={()=>setHeroBtnHover("")}>
                    Combos
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div style={{background:"#0a0a0a",padding:"11px 12px",display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:7}}>
                {[["3","Pipes"],["4h","Min"],["R0","Delivery"],["100%","Dep. Back"]].map(([n,l])=>(
                  <div key={l} style={{background:"#141414",borderRadius:9,padding:"8px 6px",textAlign:"center",border:"1px solid #1e1e1e",minWidth:0}}>
                    <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:17,color:"#fff"}}>{n}</div>
                    <div style={{fontSize:8,letterSpacing:".12em",textTransform:"uppercase",color:"#444",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* SHOP */}
              <div ref={shopRef} style={{background:"#f2f2f2",padding:"18px 13px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#bbb",marginBottom:3}}>Available Now</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#111",margin:"0 0 14px"}}>Rentals</h2>
                <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory",paddingRight:4}}>
                  {PRODUCTS.map(p=><Card key={p.id} p={p} onAdd={addToCart} onOpen={openProduct}/>)}
                </div>
                <div style={{fontSize:10,color:"#aaa",marginTop:2,marginBottom:10}}>Swipe left to see more pipes</div>
                {cart.length>0&&(
                  <button onClick={()=>setPage("cart")} style={{width:"100%",padding:"13px",background:"#111",
                    color:"#fff",border:"none",borderRadius:11,fontSize:12,fontWeight:800,
                    letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",marginTop:2,
                    boxShadow:"0 4px 14px rgba(0,0,0,.16)"}}>
                    View Cart ({cart.length}) {"\u2022"} R{cart.reduce((s,i)=>s+i.totalNow,0).toLocaleString()} {"\u2192"}
                  </button>
                )}
              </div>

              {/* COMBOS */}
              <div ref={combosRef} style={{background:"#000",padding:"18px 13px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"relative",zIndex:3}}>
                  <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#444",marginBottom:3}}>Packages</div>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 14px"}}>Combos</h2>
                  <div style={{fontSize:10,color:"#777",marginBottom:10}}>
                    Deposit rule: combos use Double Pipe deposit at R{doublePipeDeposit.toLocaleString()} per hookah pipe. Deposit is fully refundable.
                  </div>
                  <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                    {COMBO_PACKAGES.map(combo=>{
                      const rentalNow = combo.basePrice;
                      const depositNow = combo.pipes * doublePipeDeposit;
                      const totalNow = rentalNow + depositNow;
                      return (
                        <article
                          key={combo.id}
                          onClick={()=>openCombo(combo)}
                          style={{background:"#0d0d0d",border:"1px solid #1c1c1c",borderRadius:14,padding:12,width:276,flexShrink:0,scrollSnapAlign:"start",cursor:"pointer"}}
                        >
                          <div style={{fontWeight:900,fontSize:16,color:"#fff",marginBottom:3}}>{combo.title} - R{combo.basePrice.toLocaleString()}</div>
                          <div style={{fontSize:10,color:"#777",marginBottom:8}}>Combo rental for 4 hours</div>
                          <div style={{background:"#111",border:"1px solid #202020",borderRadius:10,padding:10,marginBottom:8}}>
                            {combo.lines.map(line=>(
                              <div key={line} style={{fontSize:11,color:"#d7d7d7",padding:"4px 0",borderBottom:"1px solid #1d1d1d"}}>{line}</div>
                            ))}
                          </div>
                          <div style={{background:"#111",border:"1px solid #202020",borderRadius:10,padding:9}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:4}}>
                              <span>Rental</span><strong style={{color:"#fff"}}>R{rentalNow.toLocaleString()}</strong>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:5}}>
                              <span>Refundable deposit</span><strong style={{color:"#fff"}}>R{depositNow.toLocaleString()}</strong>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#fff",borderTop:"1px solid #252525",paddingTop:7,fontWeight:800}}>
                              <span>Total now</span><span>R{totalNow.toLocaleString()}</span>
                            </div>
                            <div style={{fontSize:10,color:"#777",marginTop:4}}>Tap card to choose flavour and add-ons.</div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* POLICY */}
              <div ref={policyRef} style={{background:"linear-gradient(180deg,#f7f7f7 0%,#ffffff 46%)",padding:"20px 13px 16px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#9a9a9a",marginBottom:3}}>Transparency</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:900,color:"#111",margin:"0 0 7px"}}>Policy</h2>
                <p style={{margin:"0 0 12px",fontSize:11,color:"#6a6a6a",lineHeight:1.6}}>
                  Clear, simple terms so every booking is smooth and fair.
                </p>
                <div style={{display:"grid",gap:9}}>
                  {POLICY_ITEMS.map(item=>(
                    <article key={item.title} style={{background:"#fff",border:"1px solid #ececec",borderRadius:12,padding:"11px 10px",display:"flex",gap:9,alignItems:"flex-start",boxShadow:"0 6px 18px rgba(0,0,0,.04)"}}>
                      <div style={{width:34,height:34,borderRadius:9,border:"1.5px solid #111",display:"grid",placeItems:"center",color:"#111",flexShrink:0}}>
                        <PolicyGlyph kind={item.kind}/>
                      </div>
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:800,fontSize:12,color:"#111",marginBottom:2,letterSpacing:".02em"}}>{item.title}</div>
                        <div style={{fontSize:11,color:"#666",lineHeight:1.55}}>{item.text}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* ABOUT */}
              <div ref={aboutRef} style={{background:"#000",padding:"18px 13px",position:"relative",overflow:"hidden"}}>
                <Smoke/>
                <div style={{position:"relative",zIndex:3}}>
                  <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#444",marginBottom:3}}>Our Story</div>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 11px"}}>About Cloud 9</h2>
                  <p style={{fontSize:11,color:"#d0d0d0",lineHeight:1.8,marginBottom:10}}>
                    Cloud 9 is a black-owned hookah rental company established in February 2026, created to bring a smooth, premium hubbly experience directly to you.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    Every pipe is professionally cleaned, prepared, and inspected before each rental to ensure the highest quality smoke and hygiene standards.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    We specialize in on-demand hookah delivery across Cape Town, making it easy to enjoy premium pipes wherever you are.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    Location: Cape Town, South Africa. We operate 7 days a week.
                  </p>
                  <div style={{background:"#0d0d0d",border:"1px solid #1c1c1c",borderRadius:10,padding:".8rem",marginBottom:10}}>
                    <div style={{fontSize:11,color:"#fff",fontWeight:700,marginBottom:6}}>Whether you are:</div>
                    {[
                      "Hosting a private house party",
                      "Staying in an Airbnb",
                      "Relaxing at a hotel",
                      "Visiting Cape Town on holiday",
                      "Or simply enjoying a night with friends",
                    ].map(line=>(
                      <div key={line} style={{fontSize:11,color:"#bdbdbd",padding:"3px 0"}}>{"\u2022"} {line}</div>
                    ))}
                  </div>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    Cloud 9 delivers the full experience to your door.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    For guests on the move, we also offer car hubbly rentals, perfect for scenic drives, beach views, and road trips around the city.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    We partner with trusted local herbal suppliers to offer optional mix add-ons for customers who want to customize their experience.
                  </p>
                  <p style={{fontSize:11,color:"#bdbdbd",lineHeight:1.8,marginBottom:3}}>Our goal is simple:</p>
                  <p style={{fontSize:12,color:"#fff",fontWeight:800,lineHeight:1.8,marginBottom:4}}>
                    Deliver a luxury, hassle-free hookah experience anywhere in Cape Town.
                  </p>
                </div>
              </div>

              {/* CONTACT */}
              <div ref={contactRef} style={{background:"#f2f2f2",padding:"18px 13px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#bbb",marginBottom:3,textAlign:"center"}}>Contact Us</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#111",margin:"0 0 14px"}}>Contact</h2>
                <form onSubmit={sendContactMessage} style={{display:"grid",gap:10}}>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={e=>updContact("name",e.target.value)}
                    placeholder="Your name"
                    style={{width:"100%",padding:"11px 12px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:13,background:"#fff",color:"#111"}}
                  />
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={e=>updContact("phone",e.target.value)}
                    placeholder="Your number"
                    style={{width:"100%",padding:"11px 12px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:13,background:"#fff",color:"#111"}}
                  />
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={e=>updContact("email",e.target.value)}
                    placeholder="Your email"
                    style={{width:"100%",padding:"11px 12px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:13,background:"#fff",color:"#111"}}
                  />
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={e=>updContact("subject",e.target.value)}
                    placeholder="Subject"
                    style={{width:"100%",padding:"11px 12px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:13,background:"#fff",color:"#111"}}
                  />
                  <textarea
                    value={contactForm.message}
                    onChange={e=>updContact("message",e.target.value)}
                    placeholder="Message"
                    rows={5}
                    style={{width:"100%",padding:"11px 12px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:13,background:"#fff",color:"#111",resize:"vertical",fontFamily:"-apple-system,sans-serif"}}
                  />
                  <button
                    type="submit"
                    style={{width:"100%",padding:"13px",background:"#111",color:"#fff",border:"none",borderRadius:11,fontSize:12,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer"}}
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* FOOTER */}
              <div style={{background:"#080808",padding:"16px 18px 40px",textAlign:"center",borderTop:"1px solid #111"}}>
                <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:15,color:"#fff",letterSpacing:".2em",marginBottom:3}}>CLOUD 9</div>
                <div style={{fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color:"#333",marginBottom:9}}>Premium Hookah Rentals - Cape Town</div>
                <div style={{display:"flex",justifyContent:"center",gap:13,marginBottom:9}}>
                  {[{ic:SI.fb,url:"https://www.facebook.com/profile.php?id=61582266356916",c:"#1877f2"},{ic:SI.ig,url:"https://www.instagram.com/cloud.hubbly/?hl=en",c:"#e1306c"},{ic:SI.tt,url:"https://www.tiktok.com/@cloud9_hookah",c:"#fff"},{ic:SI.x,url:"https://x.com",c:"#fff"}].map((s,i)=>(
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{color:s.c,textDecoration:"none"}}>{s.ic}</a>
                  ))}
                </div>
                <div style={{fontSize:8,color:"#222"}}>(c) 2026 Cloud 9 Hookah Rentals</div>
              </div>
            </div>
            {activeProduct&&(
              <div onClick={()=>setActiveProduct(null)} style={{position:"absolute",inset:0,zIndex:120,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:330,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,.35)"}}>
                  <div style={{position:"relative",background:"#f2f2f2",height:210,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img
                      src={activeProduct.img}
                      alt={activeProduct.name}
                      onError={e=>{
                        if (activeProduct.fallbackImg && e.currentTarget.src !== activeProduct.fallbackImg) {
                          e.currentTarget.src = activeProduct.fallbackImg;
                        }
                      }}
                      style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center",padding:16}}
                    />
                    <button onClick={()=>setActiveProduct(null)} style={{position:"absolute",top:10,right:10,width:30,height:30,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.75)",color:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>x</button>
                  </div>
                  <div style={{padding:14}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:23,fontWeight:900,color:"#111",marginBottom:4}}>{activeProduct.name}</div>
                    <p style={{margin:"0 0 10px",fontSize:12,color:"#777",lineHeight:1.5}}>{activeProduct.desc}</p>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:"8px 10px",marginBottom:10}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#444",letterSpacing:".05em",textTransform:"uppercase"}}>Rental Hours</span>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <button onClick={()=>setActiveHours(h=>Math.max(4,h-4))} style={{width:24,height:24,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>-</button>
                        <span style={{minWidth:38,textAlign:"center",fontSize:12,fontWeight:800,color:"#111"}}>{activeHours}h</span>
                        <button onClick={()=>setActiveHours(h=>h+4)} style={{width:24,height:24,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>+</button>
                      </div>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Rental ({activeHours}h): <strong style={{color:"#111"}}>R{activeRental.toLocaleString()}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}>Deposit <Tip text="Full deposit is refunded when the pipe is returned undamaged." /></span>: <strong style={{color:"#111"}}>R{activeProduct.deposit.toLocaleString()}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Hoses: <strong style={{color:"#111"}}>{activeProduct.hoses}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Total now: <strong style={{color:"#111"}}>R{activeTotalNow.toLocaleString()}</strong></div>
                    </div>
                    <button onClick={()=>{ addToCart(activeProduct,activeHours,activeRental,activeTotalNow); setActiveProduct(null); }}
                      style={{width:"100%",padding:"11px",background:"#111",color:"#fff",border:"none",borderRadius:10,fontSize:11,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",marginBottom:7}}>
                      Add {activeHours}h to Cart +
                    </button>
                    <div style={{fontSize:11,color:"#9a9a9a"}}>Deposit is fully refunded after safe return.</div>
                  </div>
                </div>
              </div>
            )}
            {activeCombo&&(
              <div onClick={()=>setActiveCombo(null)} style={{position:"absolute",inset:0,zIndex:121,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:332,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,.35)"}}>
                  <div style={{padding:"14px 14px 10px",borderBottom:"1px solid #eee",position:"relative"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:23,fontWeight:900,color:"#111",marginBottom:4}}>{activeCombo.title}</div>
                    <div style={{fontSize:11,color:"#777"}}>Choose your flavour and extras before adding to cart.</div>
                    <button onClick={()=>setActiveCombo(null)} style={{position:"absolute",top:9,right:10,width:30,height:30,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.75)",color:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>x</button>
                  </div>
                  <div style={{padding:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:"8px 10px",marginBottom:10}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#444",letterSpacing:".05em",textTransform:"uppercase"}}>Rental Hours</span>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <button onClick={()=>setComboHours(h=>Math.max(COMBO_MIN_HOURS,h-COMBO_HOURS_STEP))} style={{width:24,height:24,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>-</button>
                        <span style={{minWidth:38,textAlign:"center",fontSize:12,fontWeight:800,color:"#111"}}>{comboHours}h</span>
                        <button onClick={()=>setComboHours(h=>h+COMBO_HOURS_STEP)} style={{width:24,height:24,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>+</button>
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:800,color:"#444",letterSpacing:".05em",textTransform:"uppercase",marginBottom:6}}>Choose Your Flavour</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                      {COMBO_FLAVOURS.map(flavour=>{
                        const selected = comboFlavours.includes(flavour);
                        return (
                          <label
                            key={flavour}
                            style={{
                              display:"flex",
                              alignItems:"center",
                              gap:7,
                              fontSize:11,
                              color:selected?"#fff":"#444",
                              background:selected?"#111":"#fafafa",
                              border:selected?"1px solid #111":"1px solid #eee",
                              borderRadius:8,
                              padding:"7px 8px",
                              cursor:"pointer",
                              fontWeight:selected?800:600
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={()=>toggleComboFlavour(flavour)}
                              style={{appearance:"auto",WebkitAppearance:"checkbox",width:16,height:16,accentColor:"#111",cursor:"pointer"}}
                            />
                            {flavour}
                          </label>
                        );
                      })}
                    </div>
                    <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#444",marginBottom:10,cursor:"pointer",fontWeight:700}}>
                      <input
                        type="checkbox"
                        checked={comboWeed}
                        onChange={e=>setComboWeed(e.target.checked)}
                        style={{appearance:"auto",WebkitAppearance:"checkbox",width:17,height:17,accentColor:"#111",cursor:"pointer"}}
                      />
                      Add small bag of weed (+R{comboAddOnPrice})
                    </label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Rental ({comboHours}h): <strong style={{color:"#111"}}>R{activeComboRental.toLocaleString()}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}>Deposit <Tip text="Full deposit is refunded when the pipe is returned undamaged." /></span>: <strong style={{color:"#111"}}>R{activeComboDeposit.toLocaleString()}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Weed add-on: <strong style={{color:"#111"}}>{comboWeed?`+R${comboAddOnPrice}`:"No"}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Total now: <strong style={{color:"#111"}}>R{activeComboTotal.toLocaleString()}</strong></div>
                    </div>
                    <button onClick={addComboToCart}
                      style={{width:"100%",padding:"11px",background:"#111",color:"#fff",border:"none",borderRadius:10,fontSize:11,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",marginBottom:7}}>
                      Add Combo to Cart +
                    </button>
                    <div style={{fontSize:11,color:"#9a9a9a"}}>If no flavour is chosen, we default to Any flavour.</div>
                  </div>
                </div>
              </div>
            )}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{position:"absolute",right:18,bottom:56,zIndex:90,textDecoration:"none"}}>
              <span style={{width:86,height:86,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent",borderRadius:0,boxShadow:"none"}}>
                <svg viewBox="0 0 24 24" width="66" height="66" fill="none" stroke="#25D366" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 11.5a8.2 8.2 0 0 1-12.4 7l-3.1.9.9-3A8.2 8.2 0 1 1 20 11.5Z"/>
                  <path d="M9 8.9c.2-.5.4-.5.7-.5h.6c.2 0 .4 0 .6.5l.4 1c.1.3 0 .6-.2.8l-.4.6c.2.7 1 1.8 2.4 2.4l.6-.4c.2-.1.6-.2.8 0l1 .4c.5.2.5.4.5.6v.6c0 .3 0 .5-.5.7-.7.2-1.6.2-2.6-.3-1.1-.5-2.2-1.4-3-2.4-.7-.8-1.3-1.8-1.5-2.7-.2-.8-.1-1.4.1-1.9Z"/>
                </svg>
              </span>
            </a>
          </div>

          {/* PAGE: CART */}
          <div style={{position:"absolute",inset:0,
            transform:page==="cart"?"translateX(0)":"translateX(100%)",
            transition:"transform .35s cubic-bezier(.4,0,.2,1)",
            background:"#fff",display:"flex",flexDirection:"column"}}>
            <div style={{position:"absolute",top:"calc(env(safe-area-inset-top, 0px) + 8px)",left:0,right:0,height:48,
              display:"flex",alignItems:"center",padding:"0 14px",
              zIndex:40,borderBottom:"1px solid #f0f0f0",background:"#fff"}}>
              <button onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:5,
                background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,color:"#111"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Back
              </button>
              <span style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:15,color:"#111",
                position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
                Cart {cart.length>0&&<span style={{background:"#111",color:"#fff",borderRadius:99,fontSize:10,fontWeight:700,padding:"1px 6px",marginLeft:3}}>{cart.length}</span>}
              </span>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"12px 14px",marginTop:"calc(env(safe-area-inset-top, 0px) + 56px)"}}>
              {cart.length===0
                ?<div style={{textAlign:"center",padding:"3rem 1rem"}}>
                  <div style={{marginBottom:12,opacity:.15,display:"flex",justifyContent:"center"}}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  </div>
                  <div style={{fontWeight:700,fontSize:15,color:"#ccc"}}>Cart is empty</div>
                  <button onClick={()=>setPage("home")} style={{marginTop:14,padding:"9px 22px",background:"#111",color:"#fff",border:"none",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer"}}>Browse Pipes</button>
                </div>
                :cart.map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:11,padding:"11px 0",borderBottom:"1px solid #f8f8f8",alignItems:"center"}}>
                    <button
                      onClick={()=>openCartHoursEditor(i)}
                      aria-label={`Edit rental hours for ${item.name}`}
                      style={{width:58,height:58,background:"#f5f5f5",borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",padding:4,border:"1px solid #eee",cursor:"pointer",position:"relative"}}
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        onError={e=>{
                          if (item.fallbackImg && e.currentTarget.src !== item.fallbackImg) {
                            e.currentTarget.src = item.fallbackImg;
                          }
                        }}
                        style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}
                      />
                      <span style={{position:"absolute",right:-5,bottom:-5,background:"#111",color:"#fff",borderRadius:999,padding:"1px 5px",fontSize:9,fontWeight:800,lineHeight:1.3}}>+{item.isCombo ? COMBO_HOURS_STEP : 4}h</span>
                    </button>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#111"}}>{item.name}</div>
                      <div style={{fontSize:11,color:"#bbb",marginTop:1}}>{item.hours}h rental {"\u2022"} Qty {item.quantity || 1}</div>
                      <div style={{fontSize:10,color:"#9a9a9a",marginTop:1}}>Tap image to edit hours (+/-)</div>
                      <div style={{fontSize:10,color:"#ddd"}}>Deposit: R{item.deposit.toLocaleString()}</div>
                      {item.isCombo&&(
                        <div style={{fontSize:10,color:"#aaa",marginTop:2}}>
                          <div>Flavour: {item.flavours?.length ? item.flavours.join(", ") : (item.flavour || "Any flavour")}</div>
                          {item.weedBag&&<div>Weed bag: +R{comboAddOnPrice}</div>}
                        </div>
                      )}
                      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                        <div style={{display:"inline-flex",alignItems:"center",border:"1px solid #e5e5e5",borderRadius:999,padding:"2px 4px",background:"#fafafa"}}>
                          <button
                            onClick={()=>changeCartQuantity(i,-1)}
                            style={{width:22,height:22,border:"none",background:"transparent",cursor:"pointer",fontSize:14,fontWeight:800,color:"#222",borderRadius:999}}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            -
                          </button>
                          <span style={{minWidth:24,textAlign:"center",fontSize:11,fontWeight:800,color:"#111"}}>{item.quantity || 1}</span>
                          <button
                            onClick={()=>changeCartQuantity(i,1)}
                            style={{width:22,height:22,border:"none",background:"transparent",cursor:"pointer",fontSize:14,fontWeight:800,color:"#222",borderRadius:999}}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={()=>removeCartItem(i)}
                          aria-label={`Remove ${item.name}`}
                          style={{width:28,height:28,border:"none",borderRadius:8,background:"#ef4444",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M8 6v-2h8v2"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div style={{fontWeight:800,fontSize:15,color:"#111",flexShrink:0}}>R{item.totalNow.toLocaleString()}</div>
                  </div>
                ))
              }
            </div>
            {cart.length>0&&(
              <div style={{padding:"12px 14px 32px",borderTop:"1px solid #f0f0f0",background:"#fafafa",flexShrink:0}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb",marginBottom:2}}>
                  <span>Rental</span><span>R{cartRental.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb",marginBottom:8}}>
                  <span>Deposits (refundable)</span><span>R{cartDeposit.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderTop:"2px solid #111",paddingTop:9,marginBottom:3}}>
                  <span style={{fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:".05em",color:"#111"}}>Total</span>
                  <span style={{fontWeight:900,fontSize:24,color:"#111"}}>R{cartTotal.toLocaleString()}</span>
                </div>
                <div style={{fontSize:10,color:"#ccc",fontStyle:"italic",marginBottom:12}}>R{cartDeposit.toLocaleString()} refunded on return</div>
                <button onClick={()=>{
                  setPage("checkout");
                  setStep(1);
                  trackEvent("checkout_opened",{ cartItems: cart.length, total: cartTotal });
                }} style={{width:"100%",padding:"14px",background:"#111",color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer"}}>Checkout {"\u2192"}</button>
              </div>
            )}
            {cartHourEditor&&(
              <div onClick={()=>setCartHourEditor(null)} style={{position:"absolute",inset:0,zIndex:170,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:320,background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,.35)"}}>
                  <div style={{padding:"14px 14px 10px",borderBottom:"1px solid #eee"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:21,fontWeight:900,color:"#111",marginBottom:4}}>Edit Rental Hours</div>
                    <div style={{fontSize:11,color:"#777",lineHeight:1.5}}>{cartHourEditor.name} {"\u2022"} Adjust safely if you tapped by mistake.</div>
                  </div>
                  <div style={{padding:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa",border:"1px solid #eee",borderRadius:12,padding:"9px 10px",marginBottom:10}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#444",letterSpacing:".05em",textTransform:"uppercase"}}>Rental Hours</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <button onClick={()=>changeCartHourDraft(-cartHourEditor.step)} style={{width:28,height:28,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:17,lineHeight:1}}>-</button>
                        <span style={{minWidth:44,textAlign:"center",fontSize:13,fontWeight:900,color:"#111"}}>{cartHourEditor.hours}h</span>
                        <button onClick={()=>changeCartHourDraft(cartHourEditor.step)} style={{width:28,height:28,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:17,lineHeight:1}}>+</button>
                      </div>
                    </div>
                    <div style={{fontSize:10,color:"#9a9a9a",marginBottom:12}}>Minimum {cartHourEditor.min}h. Step is {cartHourEditor.step}h.</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <button onClick={()=>setCartHourEditor(null)} style={{padding:"10px",background:"#f3f3f3",color:"#111",border:"1px solid #e7e7e7",borderRadius:10,fontSize:11,fontWeight:800,letterSpacing:".05em",textTransform:"uppercase",cursor:"pointer"}}>Cancel</button>
                      <button onClick={applyCartHourDraft} style={{padding:"10px",background:"#111",color:"#fff",border:"none",borderRadius:10,fontSize:11,fontWeight:800,letterSpacing:".05em",textTransform:"uppercase",cursor:"pointer"}}>Save Hours</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PAGE: CHECKOUT */}
          <div style={{position:"absolute",inset:0,
            transform:page==="checkout"?"translateX(0)":"translateX(100%)",
            transition:"transform .35s cubic-bezier(.4,0,.2,1)",
            background:"#fff",display:"flex",flexDirection:"column"}}>
            <div style={{position:"absolute",top:"calc(env(safe-area-inset-top, 0px) + 8px)",left:0,right:0,height:48,
              display:"flex",alignItems:"center",padding:"0 14px",
              zIndex:40,borderBottom:"1px solid #f0f0f0",background:"#fff"}}>
              {step<3&&<button onClick={()=>step===1?setPage("cart"):setStep(1)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:700,color:"#111"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>Back
              </button>}
              <span style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:15,color:"#111",position:"absolute",left:"50%",transform:"translateX(-50%)",whiteSpace:"nowrap"}}>
                {step===1?"Delivery":step===2?(checkoutEnabled?"Payment":"Booking"):"Confirmed!"}
              </span>
              {step<3&&<span style={{marginLeft:"auto",fontSize:10,color:"#ccc"}}>{step}/2</span>}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"12px 14px 32px",marginTop:"calc(env(safe-area-inset-top, 0px) + 56px)"}}>
              {step<3&&(
                <div style={{background:"#f8f8f8",border:"1px solid #f0f0f0",borderRadius:11,padding:"10px 11px",marginBottom:14,fontSize:11}}>
                  {cart.map((item,i)=>(
                    <div key={i} style={{borderBottom:"1px solid #f0f0f0",padding:"4px 0"}}>
                      <div style={{display:"flex",justifyContent:"space-between",color:"#888"}}>
                        <span>{item.name} - {item.hours}h x{item.quantity || 1}</span>
                        <span style={{fontWeight:700,color:"#111"}}>R{item.totalNow.toLocaleString()}</span>
                      </div>
                      {item.isCombo&&(
                        <div style={{fontSize:10,color:"#aaa",marginTop:1}}>
                          Flavour: {item.flavours?.length ? item.flavours.join(", ") : (item.flavour || "Any flavour")}{item.weedBag?` | Weed bag +R${comboAddOnPrice}`:""}
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:7,paddingTop:6,borderTop:"2px solid #111",fontWeight:800,fontSize:13,color:"#111"}}>
                    <span>Total</span><span>R{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}
              {step===1&&(
                <>
                  <DeliveryField label="Full Name *" value={form.name} onChange={v=>upd("name",v)} ph="Your name"/>
                  <DeliveryField label="Phone *" value={form.phone} onChange={v=>upd("phone",v)} type="tel" ph="082 000 0000"/>
                  <DeliveryField label="Email" value={form.email} onChange={v=>upd("email",v)} type="email" ph="you@email.com"/>
                  <DeliveryField label="Street Address *" value={form.address} onChange={v=>upd("address",v)} ph="123 Main Street"/>
                  <DeliveryField label="Suburb" value={form.suburb} onChange={v=>upd("suburb",v)} ph="Sea Point, Cape Town"/>
                  <DeliveryField label="Notes" value={form.notes} onChange={v=>upd("notes",v)} ph="Gate code, preferred time..."/>
                  <button onClick={()=>{
                    if(!form.name||!form.phone||!form.address){alert("Please fill Name, Phone & Address.");return;}
                    setStep(2);
                    trackEvent("delivery_details_completed",{ cartItems: cart.length, total: cartTotal });
                  }}
                    style={{width:"100%",padding:"13px",background:"#111",color:"#fff",border:"none",borderRadius:11,fontSize:12,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",marginTop:5}}>
                    {checkoutEnabled ? "Continue to Payment" : "Continue to Booking"} {"\u2192"}
                  </button>
                </>
              )}
              {step===2&&(
                checkoutEnabled ? (
                  <div style={{background:"linear-gradient(135deg,#e8f4ff,#eef0ff)",border:"1px solid #d0e0ff",borderRadius:14,padding:"1.4rem 1rem",textAlign:"center"}}>
                    {paymentState==="cancel"&&(
                      <div style={{background:"#fff3cd",border:"1px solid #ffe69c",color:"#8a6d1f",padding:"8px 10px",borderRadius:9,fontSize:11,marginBottom:10}}>
                        Payment was cancelled. You can try again.
                      </div>
                    )}
                    {paymentState==="failed"&&(
                      <div style={{background:"#fde2e2",border:"1px solid #f7b0b0",color:"#8b1d1d",padding:"8px 10px",borderRadius:9,fontSize:11,marginBottom:10}}>
                        Payment failed. Please try again.
                      </div>
                    )}
                    <div style={{fontWeight:900,fontSize:24,color:"#0055cc",letterSpacing:".05em",marginBottom:7}}>PAYFAST</div>
                    <div style={{fontSize:12,color:"#666",lineHeight:1.6,marginBottom:16}}>
                      You will be redirected to the Payfast hosted checkout page.<br/>
                      Enter card details securely on Payfast only.
                    </div>
                    <button onClick={startPayfastCheckout} disabled={paying}
                      style={{width:"100%",padding:"13px",background:paying?"#9ab8e8":"#0055cc",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",cursor:paying?"wait":"pointer"}}>
                      {paying?"Redirecting...":`Pay R${cartTotal.toLocaleString()} with Payfast`}
                    </button>
                    <div style={{fontSize:10,color:"#aaa",marginTop:9}}>Secure hosted checkout. We never capture card numbers, CVV, or expiry dates.</div>
                  </div>
                ) : (
                  <div style={{background:"linear-gradient(135deg,#fff4dc,#ffe9c3)",border:"1px solid #ffd89a",borderRadius:14,padding:"1.4rem 1rem",textAlign:"center"}}>
                    <div style={{fontWeight:900,fontSize:20,color:"#7a4a00",letterSpacing:".04em",marginBottom:7}}>BOOKING MODE</div>
                    <div style={{fontSize:12,color:"#7a5b25",lineHeight:1.6,marginBottom:14}}>
                      Hookah stock is currently unavailable for instant checkout.<br/>
                      Leave your booking request and we will contact you to confirm availability.
                    </div>
                    <div style={{fontSize:11,color:"#8d6a2f",marginBottom:10}}>
                      Booking slots are available from <strong>16 March 2026</strong> onward.
                    </div>
                    <div style={{textAlign:"left",marginBottom:10}}>
                      <DeliveryField
                        label="Preferred Booking Date *"
                        value={form.bookingDate}
                        onChange={v=>upd("bookingDate",v)}
                        type="date"
                        inputProps={{ min:minBookingDate }}
                      />
                      <DeliveryField
                        label="Preferred Booking Time *"
                        value={form.bookingTime}
                        onChange={v=>upd("bookingTime",v)}
                        type="time"
                      />
                    </div>
                    <button onClick={submitBookingRequest} disabled={bookingSubmitting || bookingDateLocked}
                      style={{width:"100%",padding:"13px",background:(bookingSubmitting||bookingDateLocked)?"#b7b7b7":"#7a4a00",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",cursor:(bookingSubmitting||bookingDateLocked)?"not-allowed":"pointer"}}>
                      {bookingSubmitting ? "Sending..." : bookingDateLocked ? "Available from 16 Mar" : "Book This Order"}
                    </button>
                    <div style={{fontSize:10,color:"#9d7b43",marginTop:9}}>No payment is required now. We will contact you via phone/WhatsApp.</div>
                  </div>
                )
              )}
              {step===3&&(
                <div style={{textAlign:"center",paddingTop:16}}>
                  <div style={{fontSize:56,marginBottom:12}}>{"\u2713"}</div>
                  <div style={{fontWeight:900,fontSize:21,color:"#111",marginBottom:7}}>
                    {paymentState==="booking" ? "Booking Received!" : "Order Confirmed!"}
                  </div>
                  {paidOrderNumber&&<p style={{color:"#999",fontSize:11,marginBottom:6}}>{paymentState==="booking" ? "Booking Reference" : "Order Number"}: {paidOrderNumber}</p>}
                  <p style={{color:"#777",fontSize:13,marginBottom:3}}>Thanks, <strong>{form.name}</strong>!</p>
                  <p style={{color:"#bbb",fontSize:11,marginBottom:16}}>{form.address}{form.suburb?`, ${form.suburb}`:""}</p>
                  <p style={{color:"#9a9a9a",fontSize:11,marginTop:-10,marginBottom:14}}>Preferred booking: {form.bookingDate} {form.bookingTime}</p>
                  <div style={{display:"flex",alignItems:"flex-start",gap:9,background:"#f0fff4",border:"1px solid #b2f0cb",borderRadius:11,padding:".9rem",margin:"0 0 12px",textAlign:"left"}}>
                    <span style={{fontSize:18,flexShrink:0}}>i</span>
                    <span style={{fontSize:12,color:"#1a7a40",lineHeight:1.6}}>
                      {paymentState==="booking"
                        ? "Your booking request has been saved. We will contact you shortly to confirm next steps."
                        : "Your order has been received. We will confirm your delivery window shortly."}
                    </span>
                  </div>
                  <div style={{background:"#f8f8f8",borderRadius:9,padding:".75rem",fontSize:11,color:"#aaa",marginBottom:16,textAlign:"left"}}>
                    <div style={{marginBottom:3}}>Free delivery & collection included</div>
                    <div>R{cartDeposit.toLocaleString()} deposit refunded on safe return</div>
                  </div>
                  <button onClick={()=>{setPage("home");setStep(1);setForm(createInitialCheckoutForm());setTimeout(()=>mainRef.current?.scrollTo({top:0,behavior:"smooth"}),60);}}
                    style={{padding:"11px 26px",background:"#111",color:"#fff",border:"none",borderRadius:11,fontSize:12,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer"}}>
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>{/* end screen */}
      </div>{/* end phone */}

      <style>{`
        * { box-sizing: border-box; }
        input, button { -webkit-appearance: none; appearance: none; }
        #mainScroll::-webkit-scrollbar { display: none; }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}












