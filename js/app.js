
const PRODUCTS = window.TABLEFORGE_PRODUCTS || [];
const CART_KEY = "tableforge-cart-v1";
const money = v => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(v);
const rootPrefix = () => location.pathname.includes("/pages/") ? "../" : "";
const img = f => rootPrefix()+"assets/images/products/"+f;
const getCart = () => { try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return[]} };
const saveCart = c => {localStorage.setItem(CART_KEY,JSON.stringify(c));updateCount();renderCart()};
function updateCount(){const e=document.getElementById("cartCount");if(e)e.textContent=getCart().reduce((n,x)=>n+x.qty,0)}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===id);if(!p)return;const c=getCart();const i=c.find(x=>x.id===id);if(i)i.qty++;else c.push({id,qty:1});saveCart(c);openCart()}
function removeFromCart(id){saveCart(getCart().filter(x=>x.id!==id))}
function openCart(){document.getElementById("cartDrawer")?.classList.add("open");document.getElementById("scrim")?.classList.add("show")}
function closeCart(){document.getElementById("cartDrawer")?.classList.remove("open");document.getElementById("scrim")?.classList.remove("show")}
function quickView(id){
 const p=PRODUCTS.find(x=>x.id===id), modal=document.getElementById("productModal"), box=document.getElementById("modalContent");if(!p||!modal||!box)return;
 box.innerHTML=`<div class="modal-product"><img src="${img(p.image)}" alt="${p.name}"><div class="modal-copy"><small>${p.category} · ${p.experience}</small><h2>${p.name}</h2><p>${p.desc}</p><p><strong>Players:</strong> ${p.players}<br><strong>Play time:</strong> ${p.time}<br><strong>Complexity:</strong> ${p.complexity}</p><div class="modal-price">${money(p.price)}</div><button class="btn primary" onclick="addToCart(${p.id});closeModal()">Add to bag</button></div></div>`;
 modal.classList.add("open")
}
function closeModal(){document.getElementById("productModal")?.classList.remove("open")}
function card(p){return `<article class="product-card">
      <div class="product-image"><img src="${img(p.image)}" alt="${p.name}" loading="lazy"><span class="badge">${p.tag}</span></div>
      <div class="product-info">
        <div class="product-meta"><span>${p.category}</span><span>${p.players} players</span></div>
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-specs"><span>⏱ ${p.time}</span><span>◈ ${p.complexity}</span></div>
        <div class="product-bottom"><strong>${money(p.price)}</strong><div><button class="ghost" onclick="quickView(${p.id})">View</button><button class="add" onclick="addToCart(${p.id})">Add</button></div></div>
      </div>
    </article>`}
function renderFeatured(){const g=document.getElementById("featuredGrid");if(g)g.innerHTML=PRODUCTS.slice(0,8).map(card).join("")}
function timeBucket(p,v){if(v==="Quick")return p.time.includes("20")||p.time.includes("25")||p.time.includes("35")||p.time.includes("40")||p.time.includes("45");if(v==="Standard")return p.time.includes("45")||p.time.includes("60")||p.time.includes("75");if(v==="Long")return p.time.includes("90")||p.time.includes("100")||p.time.includes("120");return true}
function playersMatch(p,v){if(v==="All")return true;if(v==="2")return p.players==="2"||p.players==="1–2"||p.players==="2–4";if(v==="3–4")return p.players.includes("3")||p.players.includes("4");if(v==="5+")return p.players.includes("5")||p.players.includes("6")||p.players.includes("8")||p.players.includes("10");return true}
function queryParam(key){return new URLSearchParams(location.search).get(key)}
function renderShop(){
 const g=document.getElementById("shopGrid");if(!g)return;
 const search=(document.getElementById("searchFilter")?.value||"").toLowerCase();
 const cat=document.getElementById("categoryFilter")?.value||"All";
 const players=document.getElementById("playersFilter")?.value||"All";
 const time=document.getElementById("timeFilter")?.value||"All";
 const complexity=document.getElementById("complexityFilter")?.value||"All";
 const experience=document.getElementById("experienceFilter")?.value||"All";
 const sort=document.getElementById("sortFilter")?.value||"featured";
 let list=PRODUCTS.filter(p=>(!search||(p.name+" "+p.desc+" "+p.category+" "+p.experience).toLowerCase().includes(search))&&(cat==="All"||p.category===cat)&&playersMatch(p,players)&&timeBucket(p,time)&&(complexity==="All"||p.complexity===complexity)&&(experience==="All"||p.experience===experience));
 if(sort==="price-low")list.sort((a,b)=>a.price-b.price);if(sort==="price-high")list.sort((a,b)=>b.price-a.price);if(sort==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
 g.innerHTML=list.length?list.map(card).join(""):`<div class="empty">No games match these filters. Try clearing one or two choices.</div>`;
 const c=document.getElementById("resultCount");if(c)c.textContent=`${list.length} products`;
}
function applyQueryFilters(){
 const category=queryParam("category"), experience=queryParam("experience");
 if(category&&document.getElementById("categoryFilter"))document.getElementById("categoryFilter").value=category;
 if(experience&&document.getElementById("experienceFilter"))document.getElementById("experienceFilter").value=experience;
}
function renderCart(){
 const box=document.getElementById("cartItems"),totalEl=document.getElementById("cartTotal");if(!box)return;
 const c=getCart();if(!c.length){box.innerHTML='<div class="empty">Your bag is empty. Pick a game and bring it to the table.</div>';if(totalEl)totalEl.textContent="$0.00";return}
 let total=0;box.innerHTML=c.map(i=>{const p=PRODUCTS.find(x=>x.id===i.id);if(!p)return"";total+=p.price*i.qty;return `<div class="cart-row"><img src="${img(p.image)}" alt="${p.name}"><div><h4>${p.name}</h4><small>${i.qty} × ${money(p.price)}</small><br><button onclick="removeFromCart(${p.id})">Remove</button></div><strong>${money(p.price*i.qty)}</strong></div>`}).join("");if(totalEl)totalEl.textContent=money(total)
}
function setup(){
 document.getElementById("navToggle")?.addEventListener("click",()=>document.getElementById("navLinks")?.classList.toggle("open"));
 document.getElementById("cartButton")?.addEventListener("click",openCart);
 document.getElementById("closeCart")?.addEventListener("click",closeCart);
 document.getElementById("scrim")?.addEventListener("click",closeCart);
 document.getElementById("modalClose")?.addEventListener("click",closeModal);
 document.getElementById("productModal")?.addEventListener("click",e=>{if(e.target.id==="productModal")closeModal()});
 document.getElementById("checkoutButton")?.addEventListener("click",()=>alert("Demo checkout. Connect this action to your payment provider before launch."));
 document.getElementById("filterToggle")?.addEventListener("click",()=>document.getElementById("filtersPanel")?.classList.toggle("open"));
 ["searchFilter","categoryFilter","playersFilter","timeFilter","complexityFilter","experienceFilter","sortFilter"].forEach(id=>document.getElementById(id)?.addEventListener("input",renderShop));
 document.getElementById("clearFilters")?.addEventListener("click",()=>{["searchFilter","categoryFilter","playersFilter","timeFilter","complexityFilter","experienceFilter"].forEach(id=>{const e=document.getElementById(id);if(e)e.value=id==="searchFilter"?"":"All"});renderShop()});
 applyQueryFilters();updateCount();renderCart();renderFeatured();renderShop();
}
document.addEventListener("DOMContentLoaded",setup);
