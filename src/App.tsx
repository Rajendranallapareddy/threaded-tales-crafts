import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Search, ShoppingBag, Heart, Menu, User, X, Plus, Check, ShoppingCart, ChevronLeft, ChevronRight, Eye, Home, Sun, Moon } from 'lucide-react';

type Product = { id:string; name:string; category:string; description:string; price:number; image:string; detail:string; };
const initial:Product[] = [
 {id:'p9',name:'Pink Tulip Bouquet',category:'Flowers & Bouquets',description:'A little forever bloom, wrapped with care.',price:0,image:'/products/p9.webp',detail:'A hand-crocheted pink tulip nestled in a soft cream wrap and finished with a delicate bow. A thoughtful keepsake for someone special.'},
 {id:'p8',name:'Golden Sunflower',category:'Crochet Keychains',description:'A bright bloom that never fades.',price:0,image:'/products/p8.webp',detail:'A cheerful sunflower keychain, carefully stitched with rich golden yarn and a warm textured centre.'},
 {id:'p6',name:'Little Red Heart',category:'Crochet Keychains',description:'A small handmade expression of affection.',price:0,image:'/products/p6.webp',detail:'A soft, dimensional crochet heart that makes a sweet everyday companion or thoughtful little gift.'},
 {id:'p4',name:'Smiling Sunshine',category:'Crochet Keychains',description:'A cheerful little burst of sunshine.',price:0,image:'/products/p4.webp',detail:'A happy sunshine with a tiny cloud, handmade to bring a little brightness wherever it goes.'},
 {id:'p7',name:'Dhoni 7 Jersey',category:'Bags & Accessories',description:'A sports-inspired handcrafted keepsake.',price:0,image:'/products/p7.webp',detail:'A miniature yellow jersey keychain with blue DHONI 7 embroidery. A playful handmade keepsake for cricket fans.'},
 {id:'p10',name:'Crimson Rose',category:'Crochet Keychains',description:'A rose that never wilts.',price:0,image:'/products/p10.webp',detail:'A richly textured crochet rose in deep crimson with tiny green leaves, finished with a sturdy keyring and chain.'},
 {id:'p11',name:'Paw Print',category:'Crochet Keychains',description:'For the pet lovers.',price:0,image:'/products/p11.webp',detail:'A tan and chocolate crochet paw print keychain, a sweet keepsake for anyone who loves their furry companion.'},
 {id:'p12',name:'Evil Eye',category:'Crochet Keychains',description:'A little watchful charm.',price:0,image:'/products/p12.webp',detail:'A hand-crocheted evil eye in navy, white and blue, made as a protective charm for your keys or bag.'},
 {id:'p13',name:'Violet Snowflake',category:'Crochet Keychains',description:'Delicate, lacy and bright.',price:0,image:'/products/p13.webp',detail:'An intricate violet crochet snowflake with an open lacework pattern, light enough to carry everywhere.'},
 {id:'p14',name:'Lotus Bloom',category:'Flowers & Bouquets',description:'A blooming lotus in thread.',price:0,image:'/products/p14.webp',detail:'A layered pink and ivory crochet lotus with pearl beads and trailing tassels.'},
 {id:'p15',name:'Daisy Tote Bag',category:'Bags & Accessories',description:'Daisies on a navy field.',price:0,image:'/products/p15.webp',detail:'A hand-crocheted tote in navy with white daisy motifs and a long carrying handle.'},
 {id:'p16',name:'Crochet Clover',category:'Crochet Keychains',description:'Carry a little luck.',price:0,image:'/products/p16.webp',detail:'Two crochet clovers in burgundy and golden yellow on a keyring, made to carry luck wherever you go.'},
 {id:'p17',name:'Santa Charm',category:'Home Decorations',description:'A cheerful festive charm.',price:0,image:'/products/p17.webp',detail:'A handmade crochet Santa with a red hat and a fluffy white beard, made for gifting and decorating.'},
 {id:'p18',name:'Daisy Pot',category:'Flowers & Bouquets',description:'Blooms that stay fresh.',price:0,image:'/products/p18.webp',detail:'Crochet daisies on green stems in a woven pot. A lasting little bouquet for a desk or shelf.'},
 {id:'p19',name:'Name Keychain',category:'Embroidery & Textile',description:'Made with your name.',price:0,image:'/products/p19.webp',detail:'A crochet name keychain with hand-embroidered lettering and a flower accent, personalised on request.'}
];
const rooms = ['All creations','Crochet Keychains','Flowers & Bouquets','Bags & Accessories','Soft Toys & Amigurumi','Embroidery & Textile','Home Decorations'];
const sm=(u:string)=>u.replace('.webp','-s.webp');
const money = (n:number) => n > 0 ? `₹${n.toLocaleString('en-IN')}` : 'Price to be confirmed';
const WA:string = ((import.meta as any).env?.VITE_WHATSAPP_NUMBER||'').replace(/\D/g,'');
const waLink = (m:string)=>`https://wa.me/${WA}?text=${encodeURIComponent(m)}`;
const collections=[
 {n:'Crochet Keychains',img:'/products/p8.webp',cat:'Crochet Keychains'},{n:'Crochet Flowers',img:'/products/p18.webp',cat:'Flowers & Bouquets'},
 {n:'Crochet Bouquets',img:'/products/p9.webp',cat:'Flowers & Bouquets'},{n:'Handmade Accessories',img:'/products/p15.webp',cat:'Bags & Accessories'},
 {n:'Personalised Creations',img:'/products/p19.webp',href:'#personalise'},{n:'Handmade Gifts',img:'/products/p12.webp',cat:'All creations'}];
const details=[['100% Handmade','Every piece is crocheted by hand. No machines, no shortcuts.'],['Thoughtfully Designed','Colour, shape and finish are considered stitch by stitch.'],['Personalised Creations','Colours and details chosen around your story.'],['Unique Gifts','Small pieces that feel personal, never mass-produced.'],['Attention to Detail','Every knot and hardware fitting is checked by eye.'],['Carefully Packaged','Wrapped like the keepsake it is meant to be.']];
const steps=[['Idea','A colour, a memory, an occasion.'],['Design','The thread finds its shape on paper first.'],['Crochet','Hours become days; every knot is intentional.'],['Quality Check','Inspected stitch by stitch.'],['Packaging','Wrapped with care and a handwritten feel.'],['Delivery','Sent on its way to your doorstep.']];
const faqs=[['How do I order and pay?','Add pieces to your bag and continue to checkout. Online payment is being connected; until then, orders and payment details are confirmed with you directly.'],['Can I customise a piece?','Yes. Choose colours, designs and occasions, then send us a custom order request.'],['How long does delivery take?','Each piece is made to order, so timing depends on the design. We confirm the estimate before you pay.'],['Do you ship across India and abroad?','Shipping options and charges are confirmed per order. Ask us about your location.'],['What is the returns and refunds policy?','Because pieces are handmade and often personalised, we review each request individually. Contact us promptly if anything arrives damaged.'],['How do I care for my crochet?','Spot clean gently, air dry flat, and keep away from sharp or rough surfaces.'],['How are orders packaged?','Every order is wrapped carefully so it arrives gift-ready.']];
const marquee=['Handmade with love','Stitched one loop at a time','Made to be treasured','Gifts with a story','Crafted in small batches','Personalised just for you'];

/* Scroll reveal: observes [data-reveal], staggers siblings, also watches dynamically rendered cards. */
function useReveal(){
 const root=useRef<HTMLDivElement|null>(null);
 useEffect(()=>{
  const host=root.current;if(!host)return;
  const show=(n:Element)=>n.classList.add('is-visible');
  if(!('IntersectionObserver' in window)){host.querySelectorAll('[data-reveal]').forEach(show);return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting||e.boundingClientRect.top<0){show(e.target);io.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px 10% 0px'});
  let pars:HTMLElement[]=[];const amb=host.querySelector<HTMLElement>('.ambient'),prog=host.querySelector<HTMLElement>('.progress');
  const scan=()=>{pars=Array.from(host.querySelectorAll<HTMLElement>('[data-parallax]'));host.querySelectorAll<HTMLElement>('[data-reveal]:not([data-seen])').forEach(n=>{n.dataset.seen='1';const sib=Array.from(n.parentElement?.children||[]).filter(c=>c.hasAttribute('data-reveal'));n.style.setProperty('--d',`${Math.min(sib.indexOf(n),5)*90}ms`);io.observe(n)})};
  scan();const mo=new MutationObserver(scan);mo.observe(host,{childList:true,subtree:true});
  /* light parallax on [data-parallax], transform only, rAF-throttled */
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;let raf=0;
  const par=()=>{raf=0;const sp=(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)).toFixed(4);amb?.style.setProperty('--sp',sp);prog?.style.setProperty('--sp',sp);if(still)return;pars.forEach(n=>{const r=n.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;n.style.setProperty('--py',`${((r.top+r.height/2-innerHeight/2)*-.06).toFixed(1)}px`)})};
  const onS=()=>{if(!raf)raf=requestAnimationFrame(par)};
  addEventListener('scroll',onS,{passive:true});
  return()=>{io.disconnect();mo.disconnect();removeEventListener('scroll',onS);if(raf)cancelAnimationFrame(raf)};
 },[]);
 return root;
}
const Lines=({lines,tag:T='h2'}:{lines:string[];tag?:'h1'|'h2'})=><T className="lines" data-reveal>{lines.map((l,i)=><span className="ln" key={i}><span style={{'--i':i} as CSSProperties}>{l}</span></span>)}</T>;
const Words=({text,tag:T='h2'}:{text:string;tag?:'h1'|'h2'|'p'})=><T className="words" data-reveal aria-label={text}>{text.split(' ').map((w,i)=><span className="wd" aria-hidden key={i}><span style={{'--i':i} as CSSProperties}>{w}</span>{' '}</span>)}</T>;
const Chars=({text}:{text:string})=><span className="chars" aria-label={text}>{text.split('').map((c,i)=><span aria-hidden key={i} style={{'--i':i} as CSSProperties}>{c===' '?'\u00A0':c}</span>)}</span>;
function ProductModal({product,onClose,onAdd}:{product:Product;onClose:()=>void;onAdd:()=>void}){
 const closeRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;const y=window.scrollY;const body=document.body;const oldOverflow=body.style.overflow;const oldPadding=body.style.paddingRight;
  const gap=window.innerWidth-document.documentElement.clientWidth;body.style.overflow='hidden';if(gap>0)body.style.paddingRight=`${gap}px`;
  closeRef.current?.focus();
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const root=document.querySelector<HTMLElement>('[role="dialog"]');if(!root)return;const items=Array.from(root.querySelectorAll<HTMLElement>('button,[href],input,[tabindex]:not([tabindex="-1"])')).filter(x=>!x.hasAttribute('disabled'));if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};
  document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('keydown',key);body.style.overflow=oldOverflow;body.style.paddingRight=oldPadding;window.scrollTo(0,y);previous?.focus?.()};
 },[onClose]);
 return createPortal(<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><section className="product-modal" role="dialog" aria-modal="true" aria-label={`${product.name} quick view`}><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close product details"><X/></button><div className="modal-photo"><img src={product.image} alt={product.name}/></div><div className="modal-info"><p className="eyebrow">{product.category}</p><h2>{product.name}</h2><p className="modal-price">{money(product.price)}</p><p className="modal-description">{product.detail}</p><div className="availability"><span/> Handmade with care · Made to order</div><button className="cta modal-add" onClick={onAdd}>Add to bag <ShoppingBag size={16}/></button><p className="modal-note">A little piece of handmade happiness, made especially for you.</p></div></section></div>,document.body);
}
export default function App(){
 const [products,setProducts]=useState<Product[]>(initial),[category,setCategory]=useState('All creations'),[query,setQuery]=useState(''),
  [cart,setCart]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('tt-cart')||'[]')}catch{return[]}}),
  [wishlist,setWishlist]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('tt-wishlist')||'[]')}catch{return[]}}),
  [savedOnly,setSavedOnly]=useState(false),[menu,setMenu]=useState(false),[searchOpen,setSearchOpen]=useState(false),[scrolled,setScrolled]=useState(false),
  [selected,setSelected]=useState<Product|null>(null),[cartOpen,setCartOpen]=useState(false),[toast,setToast]=useState(''),[faq,setFaq]=useState(0),
  [lightbox,setLightbox]=useState<number|null>(null),[email,setEmail]=useState(''),[added,setAdded]=useState(''),[active,setActive]=useState(''),[sort,setSort]=useState('featured'),[wishOpen,setWishOpen]=useState(false),[form,setForm]=useState({name:'',contact:'',msg:''}),[formNote,setFormNote]=useState<{ok:boolean;t:string}|null>(null);
 useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-45% 0px -50% 0px'});document.querySelectorAll('section[id]').forEach(n=>io.observe(n));return()=>io.disconnect()},[]);
 const revealRoot=useReveal();
 const [theme,setTheme]=useState<'light'|'dark'>(()=>{try{const t=localStorage.getItem('tt-theme');if(t==='dark'||t==='light')return t}catch{}return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'});
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('tt-theme',theme)}catch{}document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#17110e':'#f7f1e7')},[theme]);
 const flip=()=>{const d=document.documentElement;d.classList.add('theming');window.setTimeout(()=>d.classList.remove('theming'),700);setTheme(t=>t==='dark'?'light':'dark')};
 useEffect(()=>{fetch('/api/products').then(r=>r.ok?r.json():[]).then((d:Product[])=>{if(Array.isArray(d)&&d.length)setProducts(d.map((p:any)=>({...p,image:p.image||initial.find(x=>x.id===p.id)?.image||initial[0].image})))}).catch(()=>{})},[]);
 useEffect(()=>{localStorage.setItem('tt-cart',JSON.stringify(cart))},[cart]);
 useEffect(()=>{localStorage.setItem('tt-wishlist',JSON.stringify(wishlist))},[wishlist]);
 useEffect(()=>{if(!toast)return;const t=window.setTimeout(()=>setToast(''),2600);return()=>window.clearTimeout(t)},[toast]);
 useEffect(()=>{const f=()=>setScrolled(scrollY>40);f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
 const lock=wishOpen||cartOpen||searchOpen||lightbox!==null||menu;
 useEffect(()=>{if(!lock)return;const b=document.body,o=b.style.overflow;b.style.overflow='hidden';const k=(e:KeyboardEvent)=>{if(e.key==='Escape'){setCartOpen(false);setWishOpen(false);setSearchOpen(false);setLightbox(null);setMenu(false)}};document.addEventListener('keydown',k);return()=>{document.removeEventListener('keydown',k);b.style.overflow=o}},[lock]);
 const shown=useMemo(()=>products.filter(p=>(category==='All creations'||p.category===category)&&(!savedOnly||wishlist.includes(p.id))&&`${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='az'?a.name.localeCompare(b.name):sort==='za'?b.name.localeCompare(a.name):0),[products,category,query,savedOnly,wishlist,sort]);
 const add=(id:string)=>{setCart(c=>[...c,id]);setToast('Added to your bag');setSelected(null);setAdded(id);window.setTimeout(()=>setAdded(''),1400)};
 const closeProduct=useCallback(()=>setSelected(null),[]);
 const toggleWish=(id:string)=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
 const go=(cat:string)=>{setCategory(cat);setQuery('');setSavedOnly(false);document.getElementById('boutique')?.scrollIntoView({behavior:'smooth'})};
 const cartProducts=cart.map(id=>products.find(p=>p.id===id)).filter(Boolean) as Product[];
 const priced=cartProducts.length>0&&cartProducts.every(p=>p.price>0),subtotal=cartProducts.reduce((t,p)=>t+p.price,0),saved=wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean) as Product[];
 const gallery=['p9','p15','p10','p12','p18'].map(id=>initial.find(p=>p.id===id)!);
 const subscribe=(e:React.FormEvent)=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setToast('Please enter a valid email address');return}localStorage.setItem('tt-newsletter',email);setEmail('');setToast('Saved on this device. Email delivery starts once the newsletter service is connected.')};
 const custom=()=>{setMenu(false);document.getElementById('personalise')?.scrollIntoView({behavior:'smooth'})};
 const sendCustom=(e:React.FormEvent)=>{e.preventDefault();if(!form.name.trim()||!form.msg.trim()){setFormNote({ok:false,t:'Please add your name and what you have in mind.'});return}
  if(!WA){setFormNote({ok:false,t:'Enquiries are not connected yet, so nothing was sent. The shop owner needs to set a WhatsApp number (VITE_WHATSAPP_NUMBER).'});return}
  window.open(waLink(`Hi Threaded Tales Crafts, I'm ${form.name.trim()}${form.contact.trim()?` (${form.contact.trim()})`:''}. ${form.msg.trim()}`),'_blank','noopener');setFormNote({ok:true,t:'WhatsApp has opened with your message. Your enquiry is sent once you press send there.'})};
 const sendBag=()=>{const lines=[...new Set(cart)].map(id=>`${cart.filter(x=>x===id).length} x ${products.find(p=>p.id===id)?.name}`).join(', ');if(!WA){setToast('Checkout and enquiries are not connected yet');return}window.open(waLink(`Hi Threaded Tales Crafts, I'd like to order: ${lines}`),'_blank','noopener')};
 const nav=(h:string,l:string)=><a href={h} className={active===h.slice(1)?'on':''} onClick={()=>setMenu(false)}>{l}</a>;
 return <div className="site" ref={revealRoot}>
  <a className="skip" href="#top">Skip to content</a><div className="progress" aria-hidden/><div className="ambient" aria-hidden><i/><i/><i/><svg viewBox="0 0 100 1000" preserveAspectRatio="none"><path pathLength="1" d="M60 0C10 120 100 220 40 340S90 560 30 680 80 880 50 1000"/></svg></div>
  <div className="announcement"><div className="track">{[0,1].map(k=><span key={k} aria-hidden={k>0}>{[...marquee.slice(0,3),'Handcrafted in India'].map(m=><i key={m}>{m.toUpperCase()}</i>)}</span>)}</div></div>
  <header className={`header${scrolled?' scrolled':''}${menu?' mo':''}`}>
   <button className="icon mobile" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation" aria-expanded={menu}><span className={`burger${menu?' x':''}`}><i/><i/></span><span className="blabel">{menu?'Close':'Menu'}</span></button>
   <a className="brand" href="#top"><span className="brand-mark">tt</span><span>Threaded Tales<small>CRAFTS</small></span></a>
   <div className={`scrim${menu?' on':''}`} onClick={()=>setMenu(false)} aria-hidden/><nav className={menu?'nav open':'nav'} aria-label="Main"><div className="nav-top"><span>Menu</span><button className="icon" onClick={()=>setMenu(false)} aria-label="Close menu"><X/></button></div>{nav('#top','Home')}{nav('#boutique','Shop')}
    <div className="dd"><a href="#collections" onClick={()=>setMenu(false)}>Collections</a><div className="dd-menu">{collections.slice(0,4).map(c=><button key={c.n} onClick={()=>{setMenu(false);c.cat?go(c.cat):location.hash='personalise'}}>{c.n}</button>)}</div></div>
    {nav('#story','Our Story')}{nav('#personalise','Custom Orders')}{nav('#contact','Contact')}<a href="/gallery/">Virtual Gallery</a><div className="nav-foot"><button className="cta" onClick={()=>{setMenu(false);custom()}}>Start a Custom Order <ArrowRight size={16}/></button><small>HANDMADE IN INDIA · EVERY STITCH TELLS A STORY</small></div></nav>
   <div className="actions">
    <button className="icon theme" aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`} aria-pressed={theme==='dark'} onClick={flip}><span key={theme} className="ti">{theme==='dark'?<Sun/>:<Moon/>}</span></button>
    <button className="icon" aria-label="Search" onClick={()=>setSearchOpen(true)}><Search/></button>
        <button className={`icon${savedOnly?' on':''}`} aria-label={`Wishlist, ${wishlist.length} items`} aria-pressed={savedOnly} onClick={()=>{if(!wishlist.length){setToast('Tap the heart on any piece to save it');return}setSavedOnly(s=>!s);setCategory('All creations');document.getElementById('boutique')?.scrollIntoView({behavior:'smooth'})}}><Heart fill={wishlist.length?'currentColor':'none'}/></button>
    <button className="icon cart" aria-label={`Shopping bag, ${cart.length} items`} onClick={()=>setCartOpen(true)}><ShoppingBag/>{cart.length>0&&<b>{cart.length}</b>}</button>
   </div>
  </header>
  <main id="top">
   <section className="hero" data-reveal>
    <div className="hero-copy">
     <p className="eyebrow"><Chars text="HANDCRAFTED · SMALL BATCH · INDIA"/></p>
     <Lines tag="h1" lines={['Every Stitch','Tells a Story.']}/>
     <p className="intro">Handcrafted crochet creations, thoughtfully made with love, patience and imagination. Little treasures, woven to make every moment special.</p>
     <div className="btns"><a className="cta" href="#collections">Explore Collection <ArrowRight size={16}/></a><a className="cta ghost" href="#personalise">Custom Order</a></div>
     <p className="hero-note">HANDMADE · MADE WITH LOVE · ONE OF A KIND</p>
    </div>
    <div className="hero-art"><div className="mask" data-parallax><img src="/products/p9.webp" alt="Pink crochet tulip bouquet keychain" fetchPriority="high"/></div><div className="tag"><small>SIGNATURE</small>Pink Tulip<a href="#boutique">View</a></div></div>
   </section>
   <div className="marquee" aria-hidden><div className="track">{[0,1].map(k=><span key={k}>{marquee.map(m=><i key={m+k}>{m}</i>)}</span>)}</div></div>
   <section id="story" className="split story">
    <div className="imgs"><div className="mask" data-reveal><img src="/products/p8.webp" alt="Handmade crochet sunflower" loading="lazy"/></div><div className="mask small" data-reveal><img src="/products/p10.webp" alt="Crochet rose keychain" loading="lazy"/></div></div>
    <div className="copy"><p className="eyebrow" data-reveal>OUR STORY</p><Lines lines={['A little world','made of threads.']}/>
     <p data-reveal>Threaded Tales Crafts began with a ball of yarn and a lot of patience. Every keychain, bloom and keepsake is crocheted by hand, one stitch at a time, with close attention to colour, shape and finish.</p>
     <p data-reveal>No two pieces are ever exactly alike, which is what makes each one worth giving.</p></div>
   </section>
   <section id="philosophy" className="split philosophy rev">
    <div className="copy"><p className="eyebrow" data-reveal>OUR PHILOSOPHY</p><Words text="Handmade with purpose."/>
     <ul className="pillars">{['Thoughtfully Handmade','Personal and Unique','Crafted with Patience','Made for Meaningful Moments'].map(t=><li data-reveal key={t}>{t}</li>)}</ul></div>
    <div className="imgs one"><div className="mask tall" data-reveal><img src="/products/p14.webp" alt="Crochet lotus bloom" loading="lazy" data-parallax/></div></div>
   </section>
   <section id="collections" className="pad"><div className="head"><div><p className="eyebrow" data-reveal>FEATURED COLLECTIONS</p><Words text="Made slowly. Loved forever."/></div></div>
    <div className="cols">{collections.map(c=><button key={c.n} className="col" data-reveal onClick={()=>c.cat?go(c.cat):(location.hash='personalise')}><span className="ph"><img src={sm(c.img)} alt="" loading="lazy" decoding="async"/></span><span className="nm">{c.n}<ArrowRight size={15}/></span></button>)}</div></section>
   <section id="boutique" className="pad tint"><div className="head"><div><p className="eyebrow" data-reveal>THE BOUTIQUE</p><Words text="Shop the collection"/></div></div>
    <div className="filters" data-reveal>{rooms.map(r=><button key={r} onClick={()=>{setCategory(r);setSavedOnly(false)}} className={category===r&&!savedOnly?'selected':''}>{r}</button>)}{savedOnly&&<button className="selected" onClick={()=>setSavedOnly(false)}>Saved only ✕</button>}</div>
    <div className="tools" data-reveal><span>{shown.length} {shown.length===1?'piece':'pieces'}</span><label>Sort <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option></select></label></div>
    <div className="grid">{shown.map(p=><article className="product" key={p.id} data-reveal>
     <div className="product-image"><img src={sm(p.image)} alt={p.name} loading="lazy" decoding="async"/><span className="handmade">HANDMADE</span>
      <button className={`heart${wishlist.includes(p.id)?' active':''}`} onClick={()=>toggleWish(p.id)} aria-pressed={wishlist.includes(p.id)} aria-label={wishlist.includes(p.id)?'Remove from wishlist':'Add to wishlist'}><Heart size={18} fill={wishlist.includes(p.id)?'currentColor':'none'}/></button>
      <button className="quick-view" onClick={()=>setSelected(p)}><Eye size={14}/> Quick view</button></div>
     <div className="product-meta"><div><p className="category">{p.category}</p><h3>{p.name}</h3></div><span className="price">{money(p.price)}</span></div>
     <button className={`add${added===p.id?' done':''}`} onClick={()=>add(p.id)}>{added===p.id?<>Added <Check size={14}/></>:<>Add to bag <Plus size={14}/></>}</button></article>)}</div>
    {shown.length===0&&<p className="empty">No creations found. Try another search or filter.</p>}</section>
   <section className="pad why"><div className="head"><div><p className="eyebrow" data-reveal>WHY THREADED TALES</p><Lines lines={['The little details','make all the difference.']}/></div></div>
    <div className="feat">{details.map(([t,d],i)=><div data-reveal key={t}><b>0{i+1}</b><h3>{t}</h3><p>{d}</p></div>)}</div></section>
   <section id="personalise" className="personal"><div className="copy"><p className="eyebrow" data-reveal>PERSONALISATION</p><Lines lines={['Made just','for you.']}/>
     <p data-reveal>Custom colours and designs, personalised keychains, handmade flower bouquets and gifts for special occasions. Tell us what you have in mind.</p>
     <div className="chips" data-reveal>{['Custom colours','Custom designs','Personalised keychains','Flower bouquets','Occasion gifts'].map(c=><span key={c}>{c}</span>)}</div>
     <form className="cform" data-reveal onSubmit={sendCustom} noValidate><input aria-label="Your name" placeholder="Your name" autoComplete="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input aria-label="Phone or email" placeholder="Phone or email (optional)" autoComplete="email" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/><textarea aria-label="Your idea" rows={3} placeholder="Colours, design, occasion..." value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})}/><button className="cta light">Start a Custom Order <ArrowRight size={16}/></button>{formNote&&<p className={`note${formNote.ok?' ok':''}`} role={formNote.ok?'status':'alert'}>{formNote.t}</p>}</form></div>
    <div className="mask" data-reveal><img src="/products/p19.webp" alt="Personalised crochet name keychain" loading="lazy" data-parallax/></div></section>
   <section id="process" className="pad"><div className="head"><div><p className="eyebrow" data-reveal>THE CRAFT PROCESS</p><Words text="From thread to treasure."/></div></div>
    <ol className="steps">{steps.map(([t,d],i)=><li data-reveal key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol></section>
   <section className="pad tint"><div className="head"><div><p className="eyebrow" data-reveal>KIND WORDS</p><Words text="Loved by the people who receive them."/></div></div>
    <blockquote className="quote" data-reveal>Customer words will appear here as genuine reviews come in.<cite>We only publish real feedback.</cite></blockquote></section>
   <section className="gbanner" data-reveal><div className="copy"><p className="eyebrow">VIRTUAL GALLERY</p><Lines lines={['Wander through','our little world.']}/><p>Step inside the immersive 3D gallery and explore every room.</p><a className="cta light" href="/gallery/">Explore Gallery <ArrowRight size={16}/></a></div>
    <div className="gprev"><img src="/products/p10-s.webp" alt="" loading="lazy" decoding="async"/><img src="/products/p12-s.webp" alt="" loading="lazy" decoding="async"/><img src="/products/p13-s.webp" alt="" loading="lazy" decoding="async"/></div></section>
   <section id="gallery" className="pad"><div className="head"><div><p className="eyebrow" data-reveal>GALLERY</p><Words text="Woven moments."/></div></div>
    <div className="gal">{gallery.map((p,i)=><button key={p.id} className="m" data-reveal onClick={()=>setLightbox(i)} aria-label={`Open ${p.name}`}><img src={p.image} alt={p.name} loading="lazy"/><span className="cap"><em>0{i+1}</em>{p.name}</span></button>)}</div></section>
   <section id="faq" className="pad tint narrow"><div className="head"><div><p className="eyebrow" data-reveal>FAQ</p><Words text="Little questions, honest answers."/></div></div>
    <div className="faq">{faqs.map(([q,a],i)=><div className={`qa${faq===i?' open':''}`} data-reveal key={q}><button aria-expanded={faq===i} onClick={()=>setFaq(faq===i?-1:i)}>{q}<Plus size={18}/></button><div className="ans"><p>{a}</p></div></div>)}</div></section>
   <section className="news" data-reveal><Lines lines={['Stay in the loop.']}/><p>New creations, little stories and handmade moments, delivered occasionally.</p>
    <form onSubmit={subscribe} noValidate><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address"/><button className="cta light">Subscribe</button></form></section>
  </main>
  <footer id="contact"><div className="fgrid"><div><a className="brand" href="#top"><span className="brand-mark">tt</span><span>Threaded Tales<small>CRAFTS</small></span></a><p>Handcrafted crochet, woven with love. Every stitch tells a story.</p></div>
   <div><h4>Shop</h4><a href="#boutique">All creations</a><a href="#collections">Collections</a><a href="#personalise">Custom orders</a></div>
   <div><h4>Studio</h4><a href="#story">Our story</a><a href="#process">Process</a><a href="/gallery/">Virtual gallery</a></div>
   <div><h4>Support</h4><a href="#faq">FAQ</a><a href="#faq">Shipping &amp; returns</a>{WA&&<a href={waLink('Hi Threaded Tales Crafts!')} target="_blank" rel="noopener">WhatsApp</a>}</div></div>
   <p className="copy-line">© {new Date().getFullYear()} Threaded Tales Crafts. Handmade in India.</p></footer>
  {selected&&<ProductModal product={selected} onClose={closeProduct} onAdd={()=>add(selected.id)}/>}
  {searchOpen&&createPortal(<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSearchOpen(false)}}><form className="searchbox" onSubmit={e=>{e.preventDefault();setSearchOpen(false);go('All creations');setQuery(query)}}><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search creations" aria-label="Search creations"/><button className="icon" aria-label="Search"><Search/></button><button type="button" className="icon" aria-label="Close search" onClick={()=>setSearchOpen(false)}><X/></button></form></div>,document.body)}
  {lightbox!==null&&createPortal(<div className="overlay dark" role="dialog" aria-modal="true" aria-label="Product image" onMouseDown={e=>{if(e.target===e.currentTarget)setLightbox(null)}}><button className="icon lb-x" aria-label="Close" onClick={()=>setLightbox(null)}><X/></button><button className="icon lb-p" aria-label="Previous" onClick={()=>setLightbox((lightbox+gallery.length-1)%gallery.length)}><ChevronLeft/></button><img className="lb-img" src={gallery[lightbox].image} alt={gallery[lightbox].name}/><button className="icon lb-n" aria-label="Next" onClick={()=>setLightbox((lightbox+1)%gallery.length)}><ChevronRight/></button></div>,document.body)}
  {cartOpen&&createPortal(<div className="drawer-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setCartOpen(false)}}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="drawer-head"><div><p className="eyebrow">YOUR LITTLE TREASURES</p><h2>Shopping bag <span>({cart.length})</span></h2></div><button className="icon" onClick={()=>setCartOpen(false)} aria-label="Close shopping bag"><X/></button></div>{cartProducts.length?<><div className="drawer-items">{[...new Set(cart)].map(id=>{const p=products.find(x=>x.id===id);if(!p)return null;const n=cart.filter(x=>x===id).length;return <div className="drawer-item" key={id}><img src={sm(p.image)} alt="" decoding="async"/><div><h3>{p.name}</h3><p>{money(p.price)}</p><div className="qty"><button aria-label="Fewer" onClick={()=>setCart(c=>{const k=c.indexOf(id);return c.filter((_,j)=>j!==k)})}>−</button><span>{n}</span><button aria-label="More" onClick={()=>setCart(c=>[...c,id])}>+</button></div></div></div>})}</div><div className="drawer-foot"><div className="subtotal"><span>Subtotal</span><b>{priced?money(subtotal):'To be confirmed'}</b></div><p>Delivery and final prices are confirmed with you before payment.</p><button className="cta" onClick={sendBag}>Enquire about this bag <ArrowRight size={16}/></button></div></>:<div className="cart-empty"><ShoppingCart size={32}/><h3>Your bag is waiting for a little love.</h3><p>Explore our handmade creations and find a favourite.</p><button className="cta" onClick={()=>setCartOpen(false)}>Continue shopping <ArrowRight size={16}/></button></div>}</aside></div>,document.body)}
  <nav className="tabbar" aria-label="Quick navigation"><a href="#top" className={active===''?'on':''}><Home/>Home</a><button onClick={()=>setSearchOpen(true)}><Search/>Search</button><button onClick={()=>{if(!wishlist.length){setToast('Tap the heart on any piece to save it');return}setSavedOnly(true);setCategory('All creations');document.getElementById('boutique')?.scrollIntoView({behavior:'smooth'})}}><Heart/>Saved</button><button onClick={()=>setCartOpen(true)}><ShoppingBag/>Bag{cart.length>0&&<b>{cart.length}</b>}</button></nav>
  <button className={`totop${scrolled?' show':''}`} aria-label="Back to top" onClick={()=>scrollTo({top:0,behavior:'smooth'})}><ChevronRight/></button>
  {wishOpen&&createPortal(<div className="drawer-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setWishOpen(false)}}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Wishlist"><div className="drawer-head"><div><p className="eyebrow">YOUR FAVOURITES</p><h2>Wishlist <span>({saved.length})</span></h2></div><button className="icon" onClick={()=>setWishOpen(false)} aria-label="Close wishlist"><X/></button></div>{saved.length?<div className="drawer-items">{saved.map(p=><div className="drawer-item" key={p.id}><img src={sm(p.image)} alt="" decoding="async"/><div><h3>{p.name}</h3><p>{p.category}</p><div className="rowbtns"><button onClick={()=>add(p.id)}>Add to bag</button><button onClick={()=>toggleWish(p.id)}>Remove</button></div></div></div>)}</div>:<div className="cart-empty"><Heart size={32}/><h3>Nothing saved yet.</h3><p>Tap the heart on any piece to keep it here.</p><button className="cta" onClick={()=>{setWishOpen(false);go('All creations')}}>Browse creations <ArrowRight size={16}/></button></div>}</aside></div>,document.body)}
  {toast&&<div className="toast" role="status"><Check size={16}/>{toast}</div>}
 </div>
}
