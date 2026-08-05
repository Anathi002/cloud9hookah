import React, { useState, useEffect, useRef } from "react";
import IMG_CAR from "./IMG_CAR.png";
import IMAGE_BG from "./IMAGE_BG.png";
import IMG_DOUBLE from "./IMG_DOUBLE.png";
import IMG_SINGLE_LOCAL from "./IMG_SINGLE.png";
import CLOUD9_LOGO from "./cloud9-hookah-logo.svg";

const SINGLE_PIPE_LOCAL_IMAGE = IMG_SINGLE_LOCAL;
const PRODUCTS = [
  {
    id:1,
    name:"Single Pipe",
    tag:"Popular",
    img:SINGLE_PIPE_LOCAL_IMAGE,
    fallbackImg:IMG_DOUBLE,
    hoses:1,
    rentalPer4h:150,
    rentalBaseHours:1,
    minHours:1,
    hourStep:1,
    deposit:900,
    desc:"Best for solo sessions, couples, hotel stays, and calm nights in.",
    includedItems:[
      "1 pre-packed head",
      "3 coconut coals",
      "Full setup when we arrive",
    ],
  },
  {
    id:2,
    name:"Double Pipe",
    tag:"Best Seller",
    img:IMG_DOUBLE,
    hoses:2,
    rentalPer4h:200,
    rentalBaseHours:1,
    minHours:1,
    hourStep:1,
    deposit:1500,
    desc:"The most-booked setup for friends, couples, and small-group sessions.",
    includedItems:[
      "1 pre-packed head",
      "3 coconut coals",
      "Full setup when we arrive",
    ],
  },
  {
    id:3,
    name:"Car Hubbly",
    tag:"Car Experience",
    img:IMG_CAR,
    hoses:1,
    rentalPer4h:200,
    rentalBaseHours:2,
    minHours:2,
    hourStep:2,
    deposit:300,
    desc:"Made for scenic drives, beach views, and road-trip moments around Cape Town.",
    includedItems:[
      "1 pre-packed head",
      "3 coconut coals",
      "Full setup when we arrive",
    ],
  },
];

const COMBO_PACKAGES = [
  {
    id: "party",
    title: "Cloud Party Combo",
    basePrice: 580,
    tierExtra: 0,
    pipes: 2,
    subtitle: "Best for birthdays, apartments, and easy-host setups.",
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
    tierExtra: 170,
    pipes: 2,
    subtitle: "For elevated hosting with extra flavour and longer-lasting prep.",
    lines: [
      "2 Hookah pipes",
      "8 prepared heads",
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
    tierExtra: 620,
    pipes: 3,
    subtitle: "For premium events that need presence, scale, and convenience.",
    lines: [
      "3 Hookah pipes",
      "10 prepared heads",
      "3 flavour packs",
      "12 coconut charcoal pieces",
      "8 mouthpieces",
      "Free delivery & collection",
      "4 hour rental",
    ],
  },
];

const COMBO_MIN_HOURS = 4;
const COMBO_HOURS_STEP = 4;
const COMBO_DISCOUNT_RATE = 0.10;
const EVENT_SERVICE_RATE = 50;

const SI = {
  fb:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  ig:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  tt:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.75a4.85 4.85 0 01-1.02-.06z"/></svg>,
  x:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
};
const CONTACT_EMAIL = "cloud.hubbly@gmail.com";
const WA_LINK = "https://wa.me/27845642769";
const TRUST_PILLS = [
  "Free delivery & collection in Cape Town",
  "Professionally cleaned before every rental",
  "Available 7 days a week",
];
const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Choose your setup",
    text: "Pick the rental or combo that matches your night, guest count, and vibe.",
  },
  {
    step: "2",
    title: "Send your booking request",
    text: "Choose your preferred date and time, then leave your delivery details.",
  },
  {
    step: "3",
    title: "We confirm and deliver",
    text: "Our team confirms availability, delivers your setup, and collects it after use.",
  },
];
const SERVICE_PROMISES = [
  {
    title: "Delivered and collected by our team",
    text: "Customers do not need to chase transport or setup logistics. We handle the handoff and collection directly.",
  },
  {
    title: "Fast confirmation before the booking day",
    text: "Every request is reviewed by a real person so the customer knows exactly where they stand before delivery.",
  },
  {
    title: "Refundable holds only where risk is higher",
    text: "Deposits are clearly shown before booking and returned in full when the setup comes back safely.",
  },
];
const GUARANTEE_CARDS = [
  {
    title: "Clear pricing before booking",
    text: "Rental, security hold, delivery, and add-ons are shown before the customer submits.",
  },
  {
    title: "No card payment surprise",
    text: "The website captures booking intent first, then the team confirms the next step directly.",
  },
  {
    title: "Real support if plans change",
    text: "Customers can contact the team to adjust timing, confirm availability, or choose the right setup.",
  },
];
const REVIEW_CARDS = [
  {
    name: "Athenkosi",
    area: "Sea Point",
    rating: 5,
    text: "Fast delivery, clean pipe, and the setup was ready for our Airbnb night.",
  },
  {
    name: "Mila",
    area: "Cape Town CBD",
    rating: 5,
    text: "The double pipe was perfect for friends. Smooth smoke and easy collection.",
  },
  {
    name: "Lutho",
    area: "Camps Bay",
    rating: 5,
    text: "Simple booking, premium feel, and the team confirmed everything quickly.",
  },
];
const LEAD_INTEREST_OPTIONS = [
  "Birthday",
  "Date Night",
  "Private House Party",
  "Airbnb / Hotel Stay",
  "Just Browsing",
];
const FAQ_ITEMS = [
  {
    question: "How does booking work?",
    answer: "Choose your setup, submit your delivery details and preferred date, and we confirm availability directly with you.",
  },
  {
    question: "Do you deliver and collect?",
    answer: "Yes. Delivery and collection are included across Cape Town for every confirmed booking.",
  },
  {
    question: "Is there still a deposit?",
    answer: "Yes. Single Pipe has a R900 refundable deposit, Double Pipe has a R1,500 refundable deposit, and Car Hubbly has a R300 refundable deposit.",
  },
  {
    question: "When do I pay?",
    answer: "For the current booking flow, no card payment is taken on the website. We confirm the booking with you first and guide the next step directly.",
  },
  {
    question: "Can I book for a later date or change my time?",
    answer: "Yes. Choose your preferred date and time in the booking step, and contact us early if you need to adjust the slot.",
  },
];
const POLICY_ITEMS = [
  { kind:"rental", title:"Rental Fee", text:"Single Pipe R150 per hour | Double Pipe R200 per hour | Car Hubbly R200 per 2 hours." },
  { kind:"deposit", title:"Security Hold", text:"Single Pipe R900 | Double Pipe R1,500 | Car Hubbly R300. Fully refundable after safe return." },
  { kind:"refund", title:"Refundable", text:"Return the equipment safely and the security hold is refunded in full." },
  { kind:"damage", title:"Damage Policy", text:"Damage, missing parts, or severe misuse may be charged against the refundable hold." },
  { kind:"delivery", title:"Free Delivery", text:"We deliver and collect every order. Always free." },
  { kind:"time", title:"Booking Support", text:"Need more time or help choosing the right setup? Contact us before your rental ends." },
];
const createInitialLeadForm = () => ({
  name: "",
  email: "",
  phone: "",
  interest: LEAD_INTEREST_OPTIONS[0],
});
const createInitialReviewForm = () => ({
  name: "",
  rating: "5",
  productRented: "Single Pipe",
  message: "",
});

const formatMoney = (value) => `R${Number(value || 0).toLocaleString()}`;
const getDepositCopy = (amount) => amount > 0 ? formatMoney(amount) : "No deposit";
const getDepositNote = (amount) => amount > 0 ? "Refundable security hold" : "Launch offer: no deposit";
const getProductBaseHours = (product) => Number(product?.rentalBaseHours || 4);
const getProductMinHours = (product) => Number(product?.minHours || getProductBaseHours(product));
const getProductHourStep = (product) => Number(product?.hourStep || getProductBaseHours(product));
const getProductRentalLabel = (product) => `${formatMoney(product?.rentalPer4h)} / ${getProductBaseHours(product)}h`;
const calculateProductRental = (product, hours) => {
  const baseHours = Math.max(1, getProductBaseHours(product));
  return Number(product?.rentalPer4h || 0) * (Number(hours || baseHours) / baseHours);
};

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
  const hours=getProductMinHours(p);
  const rental=calculateProductRental(p, hours);
  const total=rental+p.deposit;
  const tagC={"Popular":"#111","Car Experience":"#166534","Best Seller":"#111","Group":"#166534","Plain Rental":"#4b5563"};

  function handleAdd(){
    onAdd(p,hours,rental,"Any flavour");
    setAdded(true);
    setTimeout(()=>setAdded(false),1800);
  }

  return (
    <article style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,.08)",width:232,flexShrink:0,scrollSnapAlign:"start",border:"1px solid #eee",position:"relative"}}>
      {p.tag&&(
        <div style={{position:"absolute",top:8,left:10,zIndex:2}}>
          <span style={{display:"inline-block",background:tagC[p.tag]||"#555",color:"#fff",fontSize:9,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",padding:"3px 9px",borderRadius:99}}>
            {p.tag}
          </span>
        </div>
      )}
      <button onClick={()=>onOpen(p)} style={{position:"relative",background:"#f2f2f2",height:170,display:"flex",alignItems:"center",justifyContent:"center",border:"none",width:"100%",cursor:"pointer",padding:10}}>
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
        <p style={{fontSize:11,color:"#666",margin:"0 0 5px",lineHeight:1.45,minHeight:34}}>{p.desc}</p>
        <div style={{height:8}}/>

        <div style={{background:"#fafafa",border:"1px solid #f0f0f0",borderRadius:10,padding:10}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",marginBottom:8}}>
            <span>Rental ({hours}h)</span>
            <strong>{formatMoney(rental)}</strong>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#666",marginBottom:5}}>
            <span style={{display:"inline-flex",alignItems:"center",gap:4}}>Security hold <Tip text="A refundable security hold applies only where equipment risk is higher." /></span>
            <strong>{getDepositCopy(p.deposit)}</strong>
          </div>
          <div style={{fontSize:10,color:"#969696",marginBottom:6}}>{getDepositNote(p.deposit)}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #ececec",paddingTop:7}}>
            <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"#999"}}>Total Now</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:17,fontWeight:900,color:"#111"}}>{formatMoney(total)}</span>
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
  const [howItWorksPopupOpen,setHowItWorksPopupOpen]=useState(false);
  const [step,setStep]=useState(1);
  const [paying,setPaying]=useState(false);
  const [paymentState,setPaymentState]=useState("");
  const [paidOrderNumber,setPaidOrderNumber]=useState("");
  const [bookingSubmitting,setBookingSubmitting]=useState(false);
  const [form,setForm]=useState(()=>createInitialCheckoutForm());
  const [toast,setToast]=useState("");
  const [heroBtnHover,setHeroBtnHover]=useState("");
  const [contactForm,setContactForm]=useState({name:"",phone:"",email:"",subject:"",message:""});
  const [leadForm,setLeadForm]=useState(()=>createInitialLeadForm());
  const [leadSubmitting,setLeadSubmitting]=useState(false);
  const [reviewForm,setReviewForm]=useState(()=>createInitialReviewForm());
  const [reviewSubmitting,setReviewSubmitting]=useState(false);
  const [reviewPopupOpen,setReviewPopupOpen]=useState(false);
  const [activeProduct,setActiveProduct]=useState(null);
  const [activeHours,setActiveHours]=useState(1);
  const [activeProductFlavourText,setActiveProductFlavourText]=useState("");
  const [activeProductAnyFlavour,setActiveProductAnyFlavour]=useState(true);
  const [activeCombo,setActiveCombo]=useState(null);
  const [comboFlavourText,setComboFlavourText]=useState("");
  const [comboAnyFlavour,setComboAnyFlavour]=useState(true);
  const [comboHours,setComboHours]=useState(COMBO_MIN_HOURS);
  const [comboPipeTypes,setComboPipeTypes]=useState([]);
  const [comboEventService,setComboEventService]=useState(false);
  const [comboEventPipes,setComboEventPipes]=useState("");
  const [comboEventPipeTypes,setComboEventPipeTypes]=useState("");
  const [comboEventFlavours,setComboEventFlavours]=useState("");
  const [cartHourEditor,setCartHourEditor]=useState(null);
  const [homeTopBarDark,setHomeTopBarDark]=useState(true);
  const [showDesktopNav,setShowDesktopNav]=useState(()=>(
    typeof window !== "undefined" ? window.innerWidth >= 900 : false
  ));
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
  const metaPixelId = String(import.meta.env.VITE_META_PIXEL_ID || "").trim();
  const gtagId = String(import.meta.env.VITE_GTAG_ID || "").trim();
  const minBookingDate = getBookingMinDate();
  const bookingDateLocked = String(form.bookingDate || "") < minBookingDate;
  const sessionIdRef = useRef("");

  const cartRental=cart.reduce((s,i)=>s+i.rentalCost,0);
  const cartDeposit=cart.reduce((s,i)=>s+i.deposit,0);
  const cartTotal=cartRental+cartDeposit;
  const hasCartDeposit = cartDeposit > 0;
  const activeRental=activeProduct?calculateProductRental(activeProduct, activeHours):0;
  const activeTotalNow=activeRental+(activeProduct?.deposit||0);
  const roundMoney = (value) => Number(Number(value).toFixed(2));
  const doublePipeDeposit = PRODUCTS.find(p=>p.name==="Double Pipe")?.deposit || 1500;
  const activeComboPricing = activeCombo
    ? calculateComboPricing(activeCombo, comboPipeTypes, comboHours, comboEventService)
    : {baseRental:0,discount:0,eventServiceFee:0,rentalCost:0,deposit:0,totalNow:0,pipeLabel:""};
  const activeComboBaseRental = activeComboPricing.baseRental;
  const activeComboDiscount = activeComboPricing.discount;
  const comboEventServiceFee = activeComboPricing.eventServiceFee;
  const activeComboRental = activeComboPricing.rentalCost;
  const activeComboDeposit = activeComboPricing.deposit;
  const activeComboTotal = activeComboPricing.totalNow;

  function getComboDefaultPipeTypes(combo){
    return Array.from({length:Number(combo?.pipes || 0)}, () => "Single Pipe");
  }

  function getComboPipeProduct(type){
    return PRODUCTS.find(product=>product.name === type) || PRODUCTS[0];
  }

  function getPipeTypeSummary(types){
    const counts = types.reduce((acc,type)=>{
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },{});
    return Object.entries(counts).map(([type,count])=>`${count}x ${type}`).join(", ");
  }

  function calculateComboPricing(combo,types,hours,withEventService=false){
    const safeTypes = (types?.length ? types : ["Single Pipe"]).map(type=>getComboPipeProduct(type).name);
    const safeHours = Math.max(COMBO_MIN_HOURS, Number(hours || COMBO_MIN_HOURS));
    const baseRental = roundMoney(safeTypes.reduce((sum,type)=>{
      const product = getComboPipeProduct(type);
      return sum + calculateProductRental(product, safeHours);
    },0));
    const discount = roundMoney(baseRental * COMBO_DISCOUNT_RATE);
    const tierExtra = roundMoney(Number(combo?.tierExtra || 0));
    const eventServiceFee = withEventService ? roundMoney(safeHours * EVENT_SERVICE_RATE) : 0;
    const rentalCost = roundMoney(baseRental - discount + tierExtra + eventServiceFee);
    const deposit = roundMoney(safeTypes.reduce((sum,type)=>sum + Number(getComboPipeProduct(type).deposit || 0),0));
    return {
      baseRental,
      discount,
      tierExtra,
      eventServiceFee,
      rentalCost,
      deposit,
      totalNow: roundMoney(rentalCost + deposit),
      pipeLabel: getPipeTypeSummary(safeTypes),
      pipeTypes: safeTypes,
    };
  }

  function toast_(msg){ setToast(msg); clearTimeout(toastTm.current); toastTm.current=setTimeout(()=>setToast(""),2000); }
  function addToCart(p,hours,rentalCost,flavourText="Any flavour"){
    const unitRentalCost = roundMoney(rentalCost);
    const unitDeposit = roundMoney(Number(p.deposit || 0));
    const quantity = 1;
    const nextRental = roundMoney(unitRentalCost * quantity);
    const nextDeposit = roundMoney(unitDeposit * quantity);
    const flavour = String(flavourText || "").trim() || "Any flavour";
    setCart(b=>[...b,{
      ...p,
      hours,
      quantity,
      unitRentalCost,
      unitDeposit,
      flavour,
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
      return calculateComboPricing(item, item.comboPipeTypes || getComboDefaultPipeTypes(item), nextHours, Boolean(item.comboEventService)).rentalCost;
    }
    const baseHours = Math.max(1, Number(item.rentalBaseHours || 4));
    const currentHours = Math.max(baseHours, Number(item.hours || baseHours));
    const fallbackRate = (Number(item.unitRentalCost || 0) * baseHours) / currentHours;
    const rentalRate = Number(item.rentalPer4h || fallbackRate || 0);
    return roundMoney(rentalRate * (nextHours / baseHours));
  }
  function openCartHoursEditor(index){
    const item = cart[index];
    if (!item) return;
    const min = item.isCombo ? COMBO_MIN_HOURS : getProductMinHours(item);
    const step = item.isCombo ? COMBO_HOURS_STEP : getProductHourStep(item);
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
  function openProduct(p){
    setActiveProduct(p);
    setActiveHours(getProductMinHours(p));
    setActiveProductFlavourText("");
    setActiveProductAnyFlavour(true);
  }
  function openCombo(combo){
    setActiveCombo(combo);
    setComboFlavourText("");
    setComboAnyFlavour(true);
    setComboHours(COMBO_MIN_HOURS);
    setComboPipeTypes(getComboDefaultPipeTypes(combo));
    setComboEventService(false);
    setComboEventPipes(String(combo.pipes));
    setComboEventPipeTypes(getPipeTypeSummary(getComboDefaultPipeTypes(combo)));
    setComboEventFlavours("");
  }
  function updateComboPipeType(index,type){
    setComboPipeTypes(current=>current.map((item,idx)=>idx===index ? type : item));
    setComboEventPipeTypes(getPipeTypeSummary(comboPipeTypes.map((item,idx)=>idx===index ? type : item)));
  }
  function comboLine(item){
    const flavourText = item.flavour || "Any flavour";
    const extras = [];
    extras.push(`Flavour: ${flavourText}`);
    if (item.comboPipeSummary) extras.push(`Pipes: ${item.comboPipeSummary}`);
    if (item.comboEventService) extras.push(`Event service +${formatMoney(Number(item.eventServiceFee || 0))}`);
    if (item.eventPipes) extras.push(`Event pipes: ${item.eventPipes}`);
    if (item.eventPipeTypes) extras.push(`Pipe types: ${item.eventPipeTypes}`);
    if (item.eventFlavours) extras.push(`Event flavours: ${item.eventFlavours}`);
    return `${item.name} - ${item.hours}h${extras.length ? ` | ${extras.join(" | ")}` : ""}`;
  }
  function addComboToCart(){
    if (!activeCombo) return;
    const pricing = calculateComboPricing(activeCombo, comboPipeTypes, comboHours, comboEventService);
    const rentalCost = pricing.rentalCost;
    const deposit = pricing.deposit;
    const totalNow = pricing.totalNow;
    const flavourLabel = comboAnyFlavour ? "Any flavour" : (comboFlavourText.trim() || "Any flavour");
    setCart(b=>[...b,{
      id:`combo-${activeCombo.id}-${Date.now()}`,
      name:activeCombo.title,
      img:IMG_DOUBLE,
      fallbackImg:IMG_DOUBLE,
      hoses:activeCombo.pipes,
      desc:"Combo package",
      isCombo:true,
      flavour:flavourLabel,
      comboPipeTypes:pricing.pipeTypes,
      comboPipeSummary:pricing.pipeLabel,
      comboEventService,
      eventServiceFee:pricing.eventServiceFee,
      comboDiscount:pricing.discount,
      comboBaseRental:pricing.baseRental,
      tierExtra:pricing.tierExtra,
      eventPipes: comboEventPipes.trim(),
      eventPipeTypes: comboEventPipeTypes.trim(),
      eventFlavours: comboEventFlavours.trim(),
      comboBasePrice:pricing.baseRental - pricing.discount + pricing.tierExtra,
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
  const updLead=(k,v)=>setLeadForm(f=>({...f,[k]:v}));
  const updReview=(k,v)=>setReviewForm(f=>({...f,[k]:v}));
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

    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, meta);
    }
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, meta);
    }
  }

  function submitLeadCapture(e){
    e.preventDefault();
    const name = leadForm.name.trim();
    const email = leadForm.email.trim();
    const phone = leadForm.phone.trim();
    const interest = leadForm.interest.trim();

    if(!name || !email){
      alert("Please fill your name and email.");
      return;
    }

    setLeadSubmitting(true);
    fetch(`${apiBaseUrl}/engagement/lead`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        name,
        email,
        phone,
        interest,
        source: prelaunchSource,
        page,
      }),
    })
      .then(async res=>{
        const data = await res.json().catch(()=>({}));
        if(!res.ok){
          throw new Error(data?.error || "Could not capture your details");
        }
        toast_("Thanks. We will keep you in the loop.");
        trackEvent("lead_capture_submitted",{ interest, hasPhone: Boolean(phone) });
        setLeadForm(createInitialLeadForm());
      })
      .catch(err=>{
        console.error("Lead capture failed:", err);
        alert(String(err?.message || "Could not capture your details."));
      })
      .finally(()=>setLeadSubmitting(false));
  }

  function submitCustomerReview(e){
    e.preventDefault();
    const name = reviewForm.name.trim();
    const message = reviewForm.message.trim();
    const rating = Number(reviewForm.rating);

    if(!name || !message || rating < 1 || rating > 5){
      alert("Please add your name, rating, and review message.");
      return;
    }

    setReviewSubmitting(true);
    fetch(`${apiBaseUrl}/reviews`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        name,
        rating,
        message,
        productRented: reviewForm.productRented,
        source: "website",
      }),
    })
      .then(async res=>{
        const data = await res.json().catch(()=>({}));
        if(!res.ok){
          throw new Error(data?.details || data?.error || "Could not submit review");
        }
        toast_("Review sent for approval.");
        trackEvent("review_submitted",{ rating, productRented: reviewForm.productRented });
        setReviewForm(createInitialReviewForm());
        setReviewPopupOpen(false);
      })
      .catch(err=>{
        console.error("Review submission failed:", err);
        const msg = String(err?.message || "");
        if (/failed to fetch/i.test(msg)) {
          alert(`Could not reach review server at ${apiBaseUrl}.`);
        } else {
          alert(msg || "Could not submit review.");
        }
      })
      .finally(()=>setReviewSubmitting(false));
  }

  function buildCheckoutItems(){
    return cart.map(item=>{
      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitTotal = roundMoney(Number(item.totalNow || 0) / quantity);
      const flavourText = item.flavours?.length ? item.flavours.join(", ") : (item.flavour || "Any flavour");
      const productName = item.isCombo ? comboLine(item) : `${item.name} - ${item.hours}h | Flavour: ${flavourText}`;
      return {
        product_name: productName,
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
      alert(`Bookings are available from ${minBookingDate} onward.`);
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

  useEffect(()=>{
    const syncViewportNav = ()=>{
      setShowDesktopNav(window.innerWidth >= 900);
    };
    syncViewportNav();
    window.addEventListener("resize", syncViewportNav);
    return ()=>window.removeEventListener("resize", syncViewportNav);
  },[]);

  useEffect(()=>{
    if(showDesktopNav && menuOpen){
      setMenuOpen(false);
    }
  },[showDesktopNav, menuOpen]);

  useEffect(()=>{
    if(typeof window === "undefined") return;

    if(metaPixelId && typeof window.fbq !== "function"){
      window.fbq = function () {
        window.fbq.callMethod
          ? window.fbq.callMethod.apply(window.fbq, arguments)
          : window.fbq.queue.push(arguments);
      };
      window.fbq.queue = [];
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
      window.fbq("init", metaPixelId);
      window.fbq("track", "PageView");
    }

    if(gtagId && typeof window.gtag !== "function"){
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gtagId)}`;
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", gtagId);
    }
  },[metaPixelId, gtagId]);

  const TopBar=({dark=false})=>(
    <div style={{position:"absolute",top:showDesktopNav?"calc(env(safe-area-inset-top, 0px) + 14px)":"calc(env(safe-area-inset-top, 0px) + 4px)",left:0,right:0,height:48,
      display:"flex",alignItems:"center",justifyContent:"space-between",paddingLeft:14,paddingRight:14,zIndex:40,gap:12}}>
      {showDesktopNav ? (
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
          {navItems.map((item)=>(
            <button
              key={item.label}
              onClick={()=>goSection(item.ref)}
              style={{
                background:dark ? "transparent" : "rgba(0,0,0,.28)",
                color:"#fff",
                border:dark ? "none" : "1px solid rgba(255,255,255,.12)",
                borderRadius:999,
                cursor:"pointer",
                padding:"10px 16px",
                fontSize:13,
                fontWeight:800,
                letterSpacing:".12em",
                textTransform:"uppercase",
                whiteSpace:"nowrap",
                backdropFilter:dark ? "none" : "blur(8px)",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : (
        <button onClick={()=>setMenuOpen(true)}
          style={{width:36,height:36,background:dark?"transparent":"rgba(0,0,0,.38)",
            border:"none",borderRadius:10,cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4.5,
            backdropFilter:dark?"none":"blur(8px)"}}>
          {[0,1,2].map(i=><span key={i} style={{width:15,height:1.5,background:"#fff",borderRadius:2,display:"block"}}/>)}
        </button>
      )}
      <button onClick={()=>{ setPage("cart"); setHowItWorksPopupOpen(true); }}
        style={{width:showDesktopNav?42:36,height:showDesktopNav?42:36,background:dark?"transparent":"rgba(0,0,0,.38)",
          border:"none",borderRadius:10,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          backdropFilter:dark?"none":"blur(8px)",position:"relative",flexShrink:0}}>
        <svg width={showDesktopNav?19:17} height={showDesktopNav?19:17} viewBox="0 0 24 24" fill="none"
          stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {cart.length>0&&<span style={{position:"absolute",top:showDesktopNav?-6:-5,right:showDesktopNav?-6:-5,background:"#ef4444",
          color:"#fff",width:showDesktopNav?17:15,height:showDesktopNav?17:15,borderRadius:"50%",fontSize:showDesktopNav?9:8,fontWeight:900,
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
    minWidth: 132,
    padding: "14px 30px",
    background: id === "shop"
      ? (heroBtnHover === id ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.15)")
      : (heroBtnHover === id ? "rgba(255,255,255,.08)" : "transparent"),
    color: "#fff",
    border: id === "shop" ? "1.5px solid #fff" : "1.5px solid rgba(255,255,255,.55)",
    borderRadius: 99,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    cursor: "pointer",
    backdropFilter: id === "shop" ? "blur(4px)" : "none",
    boxShadow: heroBtnHover === id ? "0 6px 24px rgba(0,0,0,.35)" : "none",
    transform: heroBtnHover === id ? "translateY(-1px)" : "translateY(0)",
    transition: "all .25s ease",
  });

  return (
    <div style={{minHeight:"100dvh",
      background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
      fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"}}>
      <style>{`
        input,
        textarea,
        select {
          font-size: 16px !important;
        }
        @keyframes cloud9LogoRollIn {
          0% {
            transform: translateX(170px) rotate(26deg);
            opacity: 0;
          }
          68% {
            transform: translateX(-12px) rotate(-5deg);
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>

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
          {!showDesktopNav && (
            <div onClick={()=>setMenuOpen(false)}
              style={{position:"absolute",inset:0,zIndex:149,
                background:"rgba(0,0,0,.45)",backdropFilter:"blur(2px)",
                opacity:menuOpen?1:0,pointerEvents:menuOpen?"all":"none",
                transition:"opacity .3s"}}/>
          )}

          {/* Drawer panel — slides in from left, only 72% wide */}
          {!showDesktopNav && (
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
          )}

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
              <div ref={heroRef} style={{position:"relative",minHeight:"100svh",overflow:"hidden",flexShrink:0,background:"#000",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <img src={IMAGE_BG} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%",zIndex:0}}/>
                <div style={{position:"absolute",inset:0,zIndex:0,background:"radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, rgba(0,0,0,.45) 100%), linear-gradient(to bottom, rgba(0,0,0,.80) 0%, rgba(0,0,0,.08) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,.52) 70%, rgba(0,0,0,.97) 100%)"}}/>
                <div style={{position:"absolute",inset:0,zIndex:1,opacity:.02,backgroundImage:'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',backgroundSize:"180px",pointerEvents:"none"}}/>

                <div style={{position:"relative",zIndex:10,flex:1,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",textAlign:"center",padding:showDesktopNav?"108px 64px 62px":"88px 24px 86px"}}>
                  <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{fontSize:showDesktopNav?17:10,fontWeight:800,letterSpacing:showDesktopNav?".38em":".24em",textTransform:"uppercase",color:"rgba(255,255,255,.78)",marginBottom:showDesktopNav?58:42,whiteSpace:showDesktopNav?"nowrap":"normal",lineHeight:1.8,maxWidth:showDesktopNav?"none":360}}>
                      CAPE TOWN {"\u2022"} PREMIUM HOOKAH RENTAL
                    </div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:showDesktopNav?104:74,fontWeight:900,letterSpacing:showDesktopNav?".02em":"-.02em",lineHeight:.86,color:"#fff",textShadow:"0 10px 28px rgba(0,0,0,.42)"}}>
                      CLOUD
                    </div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:showDesktopNav?120:88,fontWeight:900,letterSpacing:"-.05em",lineHeight:.82,color:"transparent",WebkitTextStroke:"1.2px rgba(255,255,255,.32)",textShadow:"0 10px 28px rgba(0,0,0,.28)",marginTop:showDesktopNav?2:4}}>
                      9
                    </div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:showDesktopNav?42:31,fontWeight:900,letterSpacing:".04em",color:"#fff",lineHeight:1,marginTop:showDesktopNav?8:6}}>
                      HOOKAH
                    </div>
                    <div style={{fontSize:showDesktopNav?12:10,fontWeight:800,letterSpacing:showDesktopNav?".13em":".09em",textTransform:"uppercase",lineHeight:1.75,color:"rgba(255,255,255,.88)",margin:showDesktopNav?"48px 0 0":"40px 0 0",maxWidth:560,display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap",textShadow:"0 2px 12px rgba(0,0,0,.65)"}}>
                      <span>Premium pipes delivered to your door</span>
                      <span style={{color:"rgba(255,255,255,.72)"}}>{"\u2022"}</span>
                      <span>Free delivery & collection in Cape Town</span>
                      <span style={{color:"rgba(255,255,255,.72)"}}>{"\u2022"}</span>
                      <span>Available 7 days a week</span>
                    </div>
                  </div>

                  <div style={{display:"flex",gap:14,justifyContent:"center",width:"100%",flexWrap:"nowrap"}}>
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
              </div>

              {/* Stats */}
              <div style={{background:"#0a0a0a",padding:"11px 12px",display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:7}}>
                {[["3","Setups"],["1h","From"],["R0","Delivery"],["7","Days"]].map(([n,l])=>(
                  <div key={l} style={{background:"#141414",borderRadius:9,padding:"8px 6px",textAlign:"center",border:"1px solid #1e1e1e",minWidth:0}}>
                    <div style={{fontFamily:"Georgia,serif",fontWeight:900,fontSize:17,color:"#fff"}}>{n}</div>
                    <div style={{fontSize:8,letterSpacing:".12em",textTransform:"uppercase",color:"#444",marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* SHOP */}
              <div ref={shopRef} style={{background:"#f2f2f2",padding:"18px 13px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#bbb",marginBottom:3}}>Available Now</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#111",margin:"0 0 7px"}}>Choose your setup</h2>
                <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory",paddingRight:4}}>
                  {PRODUCTS.map(p=><Card key={p.id} p={p} onAdd={addToCart} onOpen={openProduct}/>)}
                </div>
                <div style={{fontSize:10,color:"#888",marginTop:2,marginBottom:10}}>Swipe left to compare the best fit for your guests, setup, and mood.</div>
                {cart.length>0&&(
                  <button onClick={()=>{ setPage("cart"); setHowItWorksPopupOpen(true); }} style={{width:"100%",padding:"13px",background:"#111",
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
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 6px"}}>Event-ready combos</h2>
                  <div style={{fontSize:10,color:"#777",marginBottom:10}}>
                    Combos keep a refundable security hold of {formatMoney(doublePipeDeposit)} per hookah pipe because event setups carry higher equipment risk.
                  </div>
                  <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                    {COMBO_PACKAGES.map(combo=>{
                      const startingPricing = calculateComboPricing(combo, getComboDefaultPipeTypes(combo), COMBO_MIN_HOURS, false);
                      const rentalNow = startingPricing.rentalCost;
                      const depositNow = startingPricing.deposit;
                      const totalNow = startingPricing.totalNow;
                      return (
                        <article
                          key={combo.id}
                          onClick={()=>openCombo(combo)}
                          style={{background:"#0d0d0d",border:"1px solid #1c1c1c",borderRadius:14,padding:12,width:276,flexShrink:0,scrollSnapAlign:"start",cursor:"pointer"}}
                        >
                          <div style={{fontWeight:900,fontSize:16,color:"#fff",marginBottom:3}}>{combo.title} - {formatMoney(rentalNow)}</div>
                          <div style={{fontSize:10,color:"#b0b0b0",marginBottom:4}}>{combo.subtitle}</div>
                          <div style={{fontSize:10,color:"#777",marginBottom:8}}>4 hour combo rental with 10% off pipe rental</div>
                          <div style={{background:"#111",border:"1px solid #202020",borderRadius:10,padding:10,marginBottom:8}}>
                            {combo.lines.map(line=>(
                              <div key={line} style={{fontSize:11,color:"#d7d7d7",padding:"4px 0",borderBottom:"1px solid #1d1d1d"}}>{line}</div>
                            ))}
                          </div>
                          <div style={{background:"#111",border:"1px solid #202020",borderRadius:10,padding:9}}>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:4}}>
                              <span>Rental after 10%</span><strong style={{color:"#fff"}}>R{rentalNow.toLocaleString()}</strong>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:4}}>
                              <span>Combo saving</span><strong style={{color:"#fff"}}>-{formatMoney(startingPricing.discount)}</strong>
                            </div>
                            {startingPricing.tierExtra > 0&&(
                              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:4}}>
                                <span>{combo.id==="vip" ? "VIP extras" : "VVIP extras"}</span><strong style={{color:"#fff"}}>+{formatMoney(startingPricing.tierExtra)}</strong>
                              </div>
                            )}
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#aaa",marginBottom:5}}>
                              <span>Refundable security hold</span><strong style={{color:"#fff"}}>{formatMoney(depositNow)}</strong>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#fff",borderTop:"1px solid #252525",paddingTop:7,fontWeight:800}}>
                              <span>Due for booking</span><span>{formatMoney(totalNow)}</span>
                            </div>
                            <div style={{fontSize:10,color:"#777",marginTop:4}}>Tap card to choose flavour and add-ons.</div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{background:"#ffffff",padding:"20px 13px 8px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#b0b0b0",marginBottom:3}}>Why Cloud 9</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#111",margin:"0 0 12px"}}>Built to feel premium and reliable</h2>
                <div style={{display:"grid",gap:10}}>
                  {SERVICE_PROMISES.map((item)=>(
                    <article key={item.title} style={{background:"#0f0f0f",borderRadius:14,padding:"14px 13px",border:"1px solid #1e1e1e"}}>
                      <div style={{fontSize:12,fontWeight:800,color:"#fff",marginBottom:4}}>{item.title}</div>
                      <div style={{fontSize:11,color:"#b8b8b8",lineHeight:1.6}}>{item.text}</div>
                    </article>
                  ))}
                </div>
              </div>

              <div style={{background:"#fbfbfb",padding:"12px 13px 20px"}}>
                <div style={{display:"grid",gap:10}}>
                  {GUARANTEE_CARDS.map((item)=>(
                    <article key={item.title} style={{background:"#fff",border:"1px solid #ececec",borderRadius:12,padding:"12px 11px",boxShadow:"0 6px 18px rgba(0,0,0,.04)"}}>
                      <div style={{fontSize:12,fontWeight:800,color:"#111",marginBottom:4}}>{item.title}</div>
                      <div style={{fontSize:11,color:"#666",lineHeight:1.6}}>{item.text}</div>
                    </article>
                  ))}
                </div>
              </div>

              <div style={{background:"#0b0b0b",padding:"20px 13px 18px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#666",marginBottom:3}}>Reviews</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 7px"}}>Customer Feedback</h2>
                <p style={{fontSize:11,color:"#bdbdbd",lineHeight:1.6,margin:"0 0 12px"}}>
                  Approved customer feedback will appear here, while Facebook reviews help visitors verify the brand outside the website.
                </p>
                <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8,scrollSnapType:"x mandatory"}}>
                  {REVIEW_CARDS.map(review=>(
                    <article key={`${review.name}-${review.area}`} style={{background:"#151515",border:"1px solid #252525",borderRadius:14,padding:12,width:250,flexShrink:0,scrollSnapAlign:"start"}}>
                      <div style={{fontSize:13,letterSpacing:".08em",color:"#fff",marginBottom:8}}>{"*****".slice(0, review.rating)}</div>
                      <div style={{fontSize:12,color:"#e8e8e8",lineHeight:1.55,marginBottom:10}}>"{review.text}"</div>
                      <div style={{fontSize:11,fontWeight:800,color:"#fff"}}>{review.name}</div>
                      <div style={{fontSize:10,color:"#777"}}>{review.area}</div>
                    </article>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:9}}>
                  <button
                    type="button"
                    onClick={()=>setReviewPopupOpen(true)}
                    style={{padding:"11px 10px",border:"1px solid #fff",borderRadius:11,color:"#111",background:"#fff",fontSize:10,fontWeight:900,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer"}}
                  >
                    Add Your Review
                  </button>
                  <a
                    href="https://www.facebook.com/profile.php?id=61582266356916"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{textAlign:"center",textDecoration:"none",padding:"11px 10px",border:"1px solid rgba(255,255,255,.35)",borderRadius:11,color:"#fff",background:"transparent",fontSize:10,fontWeight:900,letterSpacing:".08em",textTransform:"uppercase"}}
                  >
                    Facebook
                  </a>
                </div>
              </div>

              {/* POLICY */}
              <div ref={policyRef} style={{background:"linear-gradient(180deg,#f7f7f7 0%,#ffffff 46%)",padding:"20px 13px 16px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#9a9a9a",marginBottom:3}}>Transparency</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:900,color:"#111",margin:"0 0 7px"}}>Booking details</h2>
                <p style={{margin:"0 0 12px",fontSize:11,color:"#6a6a6a",lineHeight:1.6}}>
                  Clear booking terms so customers know exactly what to expect before they submit.
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
                    Cloud 9 is a Cape Town hookah rental service built to make private hosting feel smooth, stylish, and easy to arrange.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    Every pipe is professionally cleaned, checked, and prepared before each booking so the experience feels premium from delivery to collection.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    We focus on convenience: clear booking, free delivery and collection, and direct confirmation from a real team.
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
                    Cloud 9 brings the full hookah atmosphere to your door without the usual setup stress.
                  </p>
                  <p style={{fontSize:11,color:"#c0c0c0",lineHeight:1.8,marginBottom:10}}>
                    For guests on the move, we also offer car hubbly rentals for scenic drives, beach views, and road trips around the city.
                  </p>
                  <p style={{fontSize:11,color:"#bdbdbd",lineHeight:1.8,marginBottom:3}}>Our goal is simple:</p>
                  <p style={{fontSize:12,color:"#fff",fontWeight:800,lineHeight:1.8,marginBottom:4}}>
                    Deliver a premium, reliable hookah experience anywhere in Cape Town.
                  </p>
                </div>
              </div>

              <div style={{background:"#f8f8f8",padding:"20px 13px 22px"}}>
                <div style={{fontSize:9,letterSpacing:".35em",textTransform:"uppercase",color:"#b0b0b0",marginBottom:3}}>FAQ</div>
                <h2 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:"#111",margin:"0 0 12px"}}>Questions customers ask before booking</h2>
                <div style={{display:"grid",gap:10}}>
                  {FAQ_ITEMS.map((item)=>(
                    <article key={item.question} style={{background:"#fff",border:"1px solid #ececec",borderRadius:12,padding:"12px 11px"}}>
                      <div style={{fontSize:12,fontWeight:800,color:"#111",marginBottom:4}}>{item.question}</div>
                      <div style={{fontSize:11,color:"#666",lineHeight:1.65}}>{item.answer}</div>
                    </article>
                  ))}
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
                  <select
                    value={contactForm.subject}
                    onChange={e=>updContact("subject",e.target.value)}
                    style={{width:"100%",padding:"11px 12px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:13,background:"#fff",color:"#111"}}
                  >
                    <option value="">Choose subject</option>
                    <option value="Book in advance">Book in advance</option>
                    <option value="Booking enquiry">Booking enquiry</option>
                    <option value="Combo or event booking">Combo or event booking</option>
                    <option value="Deposit question">Deposit question</option>
                    <option value="Delivery question">Delivery question</option>
                    <option value="Other">Other</option>
                  </select>
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
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:330,background:"#fff",borderRadius:16,overflowY:"auto",maxHeight:"92%",boxShadow:"0 20px 50px rgba(0,0,0,.35)"}}>
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
                    <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:"10px 11px",marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#111",letterSpacing:".05em",textTransform:"uppercase",marginBottom:6}}>What comes with it</div>
                      <div style={{display:"grid",gap:4}}>
                        {(activeProduct.includedItems || []).map((line)=>(
                          <div key={line} style={{fontSize:11,color:"#666",lineHeight:1.5}}>{"\u2022"} {line}</div>
                        ))}
                      </div>
                    </div>

                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:"8px 10px",marginBottom:10}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#444",letterSpacing:".05em",textTransform:"uppercase"}}>Rental Hours</span>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <button onClick={()=>setActiveHours(h=>Math.max(getProductMinHours(activeProduct),h-getProductHourStep(activeProduct)))} style={{width:24,height:24,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>-</button>
                        <span style={{minWidth:38,textAlign:"center",fontSize:12,fontWeight:800,color:"#111"}}>{activeHours}h</span>
                        <button onClick={()=>setActiveHours(h=>h+getProductHourStep(activeProduct))} style={{width:24,height:24,borderRadius:999,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>+</button>
                      </div>
                    </div>

                    <div style={{fontSize:11,fontWeight:800,color:"#444",letterSpacing:".05em",textTransform:"uppercase",marginBottom:6}}>Preferred Flavour</div>
                    <div style={{display:"grid",gap:8,marginBottom:10}}>
                      <input
                        type="text"
                        value={activeProductFlavourText}
                        onChange={e=>{ setActiveProductFlavourText(e.target.value); if(e.target.value.trim()) setActiveProductAnyFlavour(false); }}
                        disabled={activeProductAnyFlavour}
                        placeholder="Type flavour or flavour mix"
                        style={{width:"100%",padding:"10px 11px",border:"1px solid #eee",borderRadius:10,fontSize:12,background:activeProductAnyFlavour?"#f5f5f5":"#fff",color:"#111",boxSizing:"border-box"}}
                      />
                      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#444",cursor:"pointer",fontWeight:700}}>
                        <input
                          type="checkbox"
                          checked={activeProductAnyFlavour}
                          onChange={e=>setActiveProductAnyFlavour(e.target.checked)}
                          style={{appearance:"auto",WebkitAppearance:"checkbox",width:17,height:17,accentColor:"#111",cursor:"pointer"}}
                        />
                        Any flavour
                      </label>
                    </div>

                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Rental ({activeHours}h): <strong style={{color:"#111"}}>R{activeRental.toLocaleString()}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}>Security hold <Tip text="A refundable security hold only applies where the equipment risk is higher." /></span>: <strong style={{color:"#111"}}>{getDepositCopy(activeProduct.deposit)}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Hoses: <strong style={{color:"#111"}}>{activeProduct.hoses}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Due for booking: <strong style={{color:"#111"}}>{formatMoney(activeTotalNow)}</strong></div>
                    </div>
                    <button onClick={()=>{ addToCart(activeProduct,activeHours,activeRental,activeProductAnyFlavour ? "Any flavour" : activeProductFlavourText); setActiveProduct(null); }}
                      style={{width:"100%",padding:"11px",background:"#111",color:"#fff",border:"none",borderRadius:10,fontSize:11,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",marginBottom:7}}>
                      Add {activeHours}h to Cart +
                    </button>
                    <div style={{fontSize:11,color:"#9a9a9a"}}>{activeProduct.deposit > 0 ? "Security hold is refunded after safe return." : "No deposit is required for this setup right now."} If no flavour is chosen, we default to Any flavour.</div>
                  </div>
                </div>
              </div>
            )}
            {activeCombo&&(
              <div onClick={()=>setActiveCombo(null)} style={{position:"absolute",inset:0,zIndex:121,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:332,background:"#fff",borderRadius:16,overflowY:"auto",maxHeight:"92%",boxShadow:"0 20px 50px rgba(0,0,0,.35)"}}>
                  <div style={{padding:"14px 14px 10px",borderBottom:"1px solid #eee",position:"relative"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:23,fontWeight:900,color:"#111",marginBottom:4}}>{activeCombo.title}</div>
                    <div style={{fontSize:11,color:"#777"}}>Add your flavour preference, rental hours, and event details before adding to cart.</div>
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
                    <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:12,padding:"10px 11px",marginBottom:10}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,marginBottom:7}}>
                        <div style={{fontSize:11,fontWeight:800,color:"#111",letterSpacing:".05em",textTransform:"uppercase"}}>Switch pipe types</div>
                        <div style={{fontSize:10,color:"#777"}}>10% combo discount</div>
                      </div>
                      <div style={{display:"grid",gap:7}}>
                        {comboPipeTypes.map((type,index)=>(
                          <label key={`${activeCombo.id}-pipe-${index}`} style={{display:"grid",gridTemplateColumns:"72px 1fr",alignItems:"center",gap:8,fontSize:11,color:"#555"}}>
                            <span style={{fontWeight:800,color:"#222"}}>Pipe {index+1}</span>
                            <select
                              value={type}
                              onChange={e=>updateComboPipeType(index,e.target.value)}
                              style={{width:"100%",padding:"8px 9px",border:"1px solid #e5e5e5",borderRadius:9,fontSize:12,background:"#fff",color:"#111"}}
                            >
                              {PRODUCTS.map(product=>(
                                <option key={product.name} value={product.name}>
                                  {product.name} - {getProductRentalLabel(product)}
                                </option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                      <div style={{fontSize:10,color:"#777",lineHeight:1.45,marginTop:8}}>
                        Before discount: {formatMoney(activeComboBaseRental)} {"\u2022"} Saving: {formatMoney(activeComboDiscount)}{activeComboPricing.tierExtra > 0 ? ` \u2022 ${activeCombo.id==="vip" ? "VIP" : "VVIP"} extras: +${formatMoney(activeComboPricing.tierExtra)}` : ""}
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:800,color:"#444",letterSpacing:".05em",textTransform:"uppercase",marginBottom:6}}>Preferred Flavour</div>
                    <div style={{display:"grid",gap:8,marginBottom:10}}>
                      <input
                        type="text"
                        value={comboFlavourText}
                        onChange={e=>{ setComboFlavourText(e.target.value); if(e.target.value.trim()) setComboAnyFlavour(false); }}
                        disabled={comboAnyFlavour}
                        placeholder="Type flavour or flavour mix"
                        style={{width:"100%",padding:"10px 11px",border:"1px solid #eee",borderRadius:10,fontSize:12,background:comboAnyFlavour?"#f5f5f5":"#fff",color:"#111",boxSizing:"border-box"}}
                      />
                      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#444",cursor:"pointer",fontWeight:700}}>
                        <input
                          type="checkbox"
                          checked={comboAnyFlavour}
                          onChange={e=>setComboAnyFlavour(e.target.checked)}
                          style={{appearance:"auto",WebkitAppearance:"checkbox",width:17,height:17,accentColor:"#111",cursor:"pointer"}}
                        />
                        Any flavour
                      </label>
                    </div>
                    <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:12,padding:"10px 11px",marginBottom:10}}>
                      <div style={{fontSize:11,fontWeight:800,color:"#111",letterSpacing:".05em",textTransform:"uppercase",marginBottom:7}}>Event booking</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <input
                          type="number"
                          min="1"
                          value={comboEventPipes}
                          onChange={e=>setComboEventPipes(e.target.value)}
                          placeholder="How many pipes"
                          style={{width:"100%",padding:"9px 10px",border:"1px solid #eee",borderRadius:9,fontSize:12,background:"#fff",color:"#111",boxSizing:"border-box"}}
                        />
                        <input
                          type="text"
                          value={comboEventPipeTypes}
                          onChange={e=>setComboEventPipeTypes(e.target.value)}
                          placeholder="Types of pipes"
                          style={{width:"100%",padding:"9px 10px",border:"1px solid #eee",borderRadius:9,fontSize:12,background:"#fff",color:"#111",boxSizing:"border-box"}}
                        />
                      </div>
                      <input
                        type="text"
                        value={comboEventFlavours}
                        onChange={e=>setComboEventFlavours(e.target.value)}
                        placeholder="Event flavours, if different"
                        style={{width:"100%",padding:"9px 10px",border:"1px solid #eee",borderRadius:9,fontSize:12,background:"#fff",color:"#111",boxSizing:"border-box",marginBottom:8}}
                      />
                      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#444",cursor:"pointer",fontWeight:700}}>
                        <input
                          type="checkbox"
                          checked={comboEventService}
                          onChange={e=>setComboEventService(e.target.checked)}
                          style={{appearance:"auto",WebkitAppearance:"checkbox",width:17,height:17,accentColor:"#111",cursor:"pointer"}}
                        />
                        Add event service (+R{EVENT_SERVICE_RATE}/hour for the entire event)
                      </label>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Rental after 10% ({comboHours}h): <strong style={{color:"#111"}}>R{activeComboRental.toLocaleString()}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}>Security hold <Tip text="Combo security holds stay in place because event setups carry higher equipment risk." /></span>: <strong style={{color:"#111"}}>{formatMoney(activeComboDeposit)}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Event service: <strong style={{color:"#111"}}>{comboEventService?`+${formatMoney(comboEventServiceFee)}`:"No"}</strong></div>
                      <div style={{background:"#fafafa",border:"1px solid #eee",borderRadius:10,padding:8,fontSize:11,color:"#666"}}>Due for booking: <strong style={{color:"#111"}}>{formatMoney(activeComboTotal)}</strong></div>
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
            {reviewPopupOpen&&(
              <div onClick={()=>setReviewPopupOpen(false)} style={{position:"absolute",inset:0,zIndex:122,background:"rgba(0,0,0,.62)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}>
                <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:332,background:"#fff",borderRadius:16,overflowY:"auto",maxHeight:"92%",boxShadow:"0 20px 50px rgba(0,0,0,.35)"}}>
                  <div style={{padding:"14px 14px 10px",borderBottom:"1px solid #eee",position:"relative"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:23,fontWeight:900,color:"#111",marginBottom:4}}>Add Your Review</div>
                    <div style={{fontSize:11,color:"#777",lineHeight:1.5,paddingRight:28}}>Your review is submitted for approval before it appears on the website.</div>
                    <button onClick={()=>setReviewPopupOpen(false)} style={{position:"absolute",top:9,right:10,width:30,height:30,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.75)",color:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>x</button>
                  </div>
                  <form onSubmit={submitCustomerReview} style={{display:"grid",gap:9,padding:14}}>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={e=>updReview("name",e.target.value)}
                      placeholder="Your name"
                      style={{width:"100%",padding:"10px 11px",border:"1px solid #eee",borderRadius:10,fontSize:12,background:"#fafafa",color:"#111",boxSizing:"border-box"}}
                    />
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <select
                        value={reviewForm.rating}
                        onChange={e=>updReview("rating",e.target.value)}
                        style={{width:"100%",padding:"10px 11px",border:"1px solid #eee",borderRadius:10,fontSize:12,background:"#fafafa",color:"#111"}}
                      >
                        {[5,4,3,2,1].map(rating=><option key={rating} value={rating}>{rating} star{rating>1?"s":""}</option>)}
                      </select>
                      <select
                        value={reviewForm.productRented}
                        onChange={e=>updReview("productRented",e.target.value)}
                        style={{width:"100%",padding:"10px 11px",border:"1px solid #eee",borderRadius:10,fontSize:12,background:"#fafafa",color:"#111"}}
                      >
                        {PRODUCTS.map(product=><option key={product.name} value={product.name}>{product.name}</option>)}
                        {COMBO_PACKAGES.map(combo=><option key={combo.title} value={combo.title}>{combo.title}</option>)}
                      </select>
                    </div>
                    <textarea
                      value={reviewForm.message}
                      onChange={e=>updReview("message",e.target.value)}
                      placeholder="Tell us how your booking went"
                      rows={4}
                      style={{width:"100%",padding:"10px 11px",border:"1px solid #eee",borderRadius:10,fontSize:12,background:"#fafafa",color:"#111",resize:"vertical",fontFamily:"-apple-system,sans-serif",boxSizing:"border-box"}}
                    />
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      style={{width:"100%",padding:"11px",background:"#111",color:"#fff",border:"none",borderRadius:10,fontSize:11,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase",cursor:reviewSubmitting?"default":"pointer",opacity:reviewSubmitting?0.75:1}}
                    >
                      {reviewSubmitting ? "Sending..." : "Send Review"}
                    </button>
                  </form>
                </div>
              </div>
            )}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" style={{position:"absolute",right:20,bottom:28,zIndex:200,textDecoration:"none"}}>
              <span style={{width:52,height:52,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 20px rgba(37,211,102,.4)",animation:"waPulse 3s ease-in-out infinite"}}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
            {howItWorksPopupOpen&&(
              <div
                onClick={()=>setHowItWorksPopupOpen(false)}
                style={{position:"absolute",inset:0,zIndex:119,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",padding:18}}
              >
                <div
                  onClick={e=>e.stopPropagation()}
                  style={{width:"100%",maxWidth:344,background:"#fff",borderRadius:18,overflow:"hidden",boxShadow:"0 22px 55px rgba(0,0,0,.35)"}}
                >
                  <div style={{padding:"15px 15px 11px",borderBottom:"1px solid #efefef",position:"relative"}}>
                    <div style={{fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:"#b0b0b0",marginBottom:4}}>How It Works</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:900,color:"#111",marginBottom:5}}>What happens next</div>
                    <div style={{fontSize:11,color:"#6d6d6d",lineHeight:1.6,paddingRight:28}}>
                      Your setup is in the cart. Review it, edit products if needed, then go ahead and book when you are ready.
                    </div>
                    <button
                      onClick={()=>setHowItWorksPopupOpen(false)}
                      style={{position:"absolute",top:10,right:10,width:30,height:30,borderRadius:"50%",border:"none",background:"rgba(0,0,0,.8)",color:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}
                    >
                      x
                    </button>
                  </div>
                  <div style={{padding:14,display:"grid",gap:10}}>
                    {HOW_IT_WORKS.map((item)=>(
                      <article key={item.step} style={{display:"flex",gap:10,background:"#fafafa",border:"1px solid #ececec",borderRadius:12,padding:"11px 10px"}}>
                        <div style={{width:34,height:34,borderRadius:999,background:"#111",color:"#fff",display:"grid",placeItems:"center",fontWeight:900,fontSize:12,flexShrink:0}}>
                          {item.step}
                        </div>
                        <div>
                          <div style={{fontSize:12,fontWeight:800,color:"#111",marginBottom:3}}>{item.title}</div>
                          <div style={{fontSize:11,color:"#666",lineHeight:1.6}}>{item.text}</div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div style={{padding:"0 14px 15px",fontSize:11,color:"#8a8a8a",lineHeight:1.5}}>
                    Once your cart looks right, continue to booking and leave your preferred date, time, and delivery details.
                  </div>
                </div>
              </div>
            )}
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
                      <span style={{position:"absolute",right:-5,bottom:-5,background:"#111",color:"#fff",borderRadius:999,padding:"1px 5px",fontSize:9,fontWeight:800,lineHeight:1.3}}>{item.hours}h</span>
                    </button>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#111"}}>{item.name}</div>
                      <div style={{fontSize:11,color:"#bbb",marginTop:1}}>{item.hours}h rental {"\u2022"} Qty {item.quantity || 1}</div>
                      <div style={{fontSize:10,color:"#9a9a9a",marginTop:1}}>Tap image to edit hours (+/-)</div>
                      <div style={{fontSize:10,color:"#ddd"}}>Security hold: {getDepositCopy(item.deposit)}</div>
                      {(item.isCombo || item.flavour || item.flavours?.length > 0)&&(
                        <div style={{fontSize:10,color:"#aaa",marginTop:2}}>
                          <div>Flavour: {item.flavours?.length ? item.flavours.join(", ") : (item.flavour || "Any flavour")}</div>
                          {item.comboEventService&&<div>Event service: +{formatMoney(Number(item.eventServiceFee || 0))}</div>}
                          {item.eventPipes&&<div>Event pipes: {item.eventPipes}</div>}
                          {item.eventPipeTypes&&<div>Pipe types: {item.eventPipeTypes}</div>}
                          {item.eventFlavours&&<div>Event flavours: {item.eventFlavours}</div>}
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
                {hasCartDeposit&&(
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb",marginBottom:8}}>
                    <span>Security holds (refundable)</span><span>{formatMoney(cartDeposit)}</span>
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderTop:"2px solid #111",paddingTop:9,marginBottom:3}}>
                  <span style={{fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:".05em",color:"#111"}}>Total</span>
                  <span style={{fontWeight:900,fontSize:24,color:"#111"}}>{formatMoney(cartTotal)}</span>
                </div>
                <div style={{fontSize:10,color:"#ccc",fontStyle:"italic",marginBottom:12}}>
                  {hasCartDeposit ? `${formatMoney(cartDeposit)} security hold refunded on safe return` : "No deposit is required on the items currently in your cart"}
                </div>
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
                      {(item.isCombo || item.flavour || item.flavours?.length > 0)&&(
                        <div style={{fontSize:10,color:"#aaa",marginTop:1}}>
                          Flavour: {item.flavour || "Any flavour"}{item.comboEventService?` | Event service +${formatMoney(Number(item.eventServiceFee || 0))}`:""}
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
                      Booking slots are open from <strong>{minBookingDate}</strong> onward.
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
                      {bookingSubmitting ? "Sending..." : bookingDateLocked ? `Available from ${minBookingDate}` : "Book This Order"}
                    </button>
                    <div style={{fontSize:10,color:"#9d7b43",marginTop:9}}>No payment is required now. We will contact you directly to confirm the booking.</div>
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
                    <div>{hasCartDeposit ? `${formatMoney(cartDeposit)} security hold refunded on safe return` : "No deposit required for the current booking mix"}</div>
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


















