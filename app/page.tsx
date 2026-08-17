"use client";

import { useEffect, useMemo, useState } from "react";

type Auction = {
  id: string; court: string; status: string; title: string; province: string; district: string;
  address: string; area: string; floor: string; appraisal: number; minimum: number; date: string;
  bidDate: string; discount: number; failCount: number; note: string; tone: string;
};

const auctions: Auction[] = [
  { id:"2025타경112846", court:"서울중앙지방법원", status:"신건", title:"래미안 원베일리", province:"서울특별시", district:"서초구", address:"서울특별시 서초구 반포동 1-1", area:"84.97㎡", floor:"18층", appraisal:325000, minimum:260000, date:"8월 27일", bidDate:"2026.08.27", discount:80, failCount:0, note:"토지·건물 일괄매각", tone:"sage" },
  { id:"2025타경109327", court:"서울동부지방법원", status:"1회 유찰", title:"헬리오시티", province:"서울특별시", district:"송파구", address:"서울특별시 송파구 가락동 913", area:"84.95㎡", floor:"12층", appraisal:228000, minimum:182400, date:"8월 24일", bidDate:"2026.08.24", discount:80, failCount:1, note:"대지권 미등기 여부 확인", tone:"sand" },
  { id:"2025타경88531", court:"수원지방법원", status:"2회 유찰", title:"광교 자연앤힐스테이트", province:"경기도", district:"수원시", address:"경기도 수원시 영통구 이의동 1344", area:"84.72㎡", floor:"25층", appraisal:132000, minimum:64680, date:"8월 31일", bidDate:"2026.08.31", discount:49, failCount:2, note:"현황조사서 및 점유관계 확인", tone:"blue" },
  { id:"2025타경79314", court:"서울남부지방법원", status:"1회 유찰", title:"목동 신시가지 7단지", province:"서울특별시", district:"양천구", address:"서울특별시 양천구 목동 925", area:"66.60㎡", floor:"9층", appraisal:195000, minimum:156000, date:"9월 2일", bidDate:"2026.09.02", discount:80, failCount:1, note:"재매각, 입찰보증금 확인", tone:"rose" },
  { id:"2025타경12880", court:"인천지방법원", status:"신건", title:"송도 더샵퍼스트파크", province:"인천광역시", district:"연수구", address:"인천광역시 연수구 송도동 100", area:"95.87㎡", floor:"31층", appraisal:94000, minimum:94000, date:"9월 4일", bidDate:"2026.09.04", discount:100, failCount:0, note:"토지·건물 일괄매각", tone:"violet" },
  { id:"2025타경65190", court:"서울북부지방법원", status:"2회 유찰", title:"꿈의숲 아이파크", province:"서울특별시", district:"성북구", address:"서울특별시 성북구 장위동 189-3", area:"59.10㎡", floor:"16층", appraisal:105000, minimum:67200, date:"9월 8일", bidDate:"2026.09.08", discount:64, failCount:2, note:"선순위 임차인 여부 확인", tone:"mint" },
  { id:"2025타경101455", court:"의정부지방법원", status:"1회 유찰", title:"다산 한양수자인 리버팰리스", province:"경기도", district:"남양주시", address:"경기도 남양주시 다산동 6234", area:"84.94㎡", floor:"7층", appraisal:79000, minimum:55300, date:"9월 10일", bidDate:"2026.09.10", discount:70, failCount:1, note:"매각물건명세서 확인 필요", tone:"sky" },
  { id:"2025타경44922", court:"성남지원", status:"3회 유찰", title:"판교 원마을 12단지", province:"경기도", district:"성남시", address:"경기도 성남시 분당구 판교동 550", area:"101.92㎡", floor:"5층", appraisal:178000, minimum:87220, date:"9월 14일", bidDate:"2026.09.14", discount:49, failCount:3, note:"유치권 신고 내역 확인", tone:"amber" },
  { id:"2025타경55039", court:"서울서부지방법원", status:"1회 유찰", title:"DMC 파크뷰자이", province:"서울특별시", district:"서대문구", address:"서울특별시 서대문구 남가좌동 385", area:"84.97㎡", floor:"14층", appraisal:142000, minimum:113600, date:"9월 16일", bidDate:"2026.09.16", discount:80, failCount:1, note:"소유자 점유 추정", tone:"olive" },
];

const districts: Record<string, string[]> = {
  "서울특별시":["전체","강남구","서초구","송파구","양천구","성북구","서대문구"],
  "경기도":["전체","수원시","성남시","남양주시"],
  "인천광역시":["전체","연수구"],
};

const formatPrice = (value:number) => {
  const eok = Math.floor(value / 10000); const man = value % 10000;
  return `${eok ? `${eok}억` : ""}${man ? ` ${man.toLocaleString()}만` : ""}`.trim();
};

export default function Home() {
  const [province,setProvince] = useState("전체 지역");
  const [district,setDistrict] = useState("전체");
  const [price,setPrice] = useState("전체 가격");
  const [failCount,setFailCount] = useState("유찰 전체");
  const [sort,setSort] = useState("매각기일순");
  const [favorites,setFavorites] = useState<string[]>([]);
  const [savedOnly,setSavedOnly] = useState(false);
  const [selected,setSelected] = useState<Auction|null>(null);
  const [applied,setApplied] = useState({province:"전체 지역",district:"전체",price:"전체 가격",failCount:"유찰 전체"});

  useEffect(()=>{ try { setFavorites(JSON.parse(localStorage.getItem("auctionhome-favorites")||"[]")); } catch {} },[]);
  useEffect(()=>{ localStorage.setItem("auctionhome-favorites",JSON.stringify(favorites)); },[favorites]);

  const applySearch = () => { setApplied({province,district,price,failCount}); setSavedOnly(false); document.getElementById("auctions")?.scrollIntoView({behavior:"smooth"}); };
  const chooseQuick = (name:string) => { setProvince("서울특별시"); setDistrict(name); setApplied({province:"서울특별시",district:name,price,failCount}); setSavedOnly(false); document.getElementById("auctions")?.scrollIntoView({behavior:"smooth"}); };
  const toggleFavorite = (id:string) => setFavorites(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);

  const filtered = useMemo(()=>{
    const result = auctions.filter(a=>{
      const byProvince = applied.province==="전체 지역" || a.province===applied.province;
      const byDistrict = applied.district==="전체" || a.district===applied.district;
      const byPrice = applied.price==="전체 가격" || (applied.price==="5억 이하"?a.minimum<=50000:applied.price==="5억–10억"?a.minimum>50000&&a.minimum<=100000:a.minimum>100000);
      const byFail = applied.failCount==="유찰 전체" || a.failCount===Number(applied.failCount[0]);
      return byProvince&&byDistrict&&byPrice&&byFail&&(!savedOnly||favorites.includes(a.id));
    });
    return [...result].sort((a,b)=>sort==="최저가순"?a.minimum-b.minimum:sort==="할인율순"?a.discount-b.discount:a.bidDate.localeCompare(b.bidDate));
  },[applied,sort,savedOnly,favorites]);

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="옥션홈 홈"><span className="brand-mark">A</span><span>옥션홈</span></a>
      <nav aria-label="주요 메뉴"><a className="active" href="#auctions">경매 찾기</a><a href="#guide">경매 가이드</a><button onClick={()=>{setSavedOnly(true);document.getElementById("auctions")?.scrollIntoView({behavior:"smooth"})}}>관심 물건</button></nav>
      <button className="saved-button" type="button" onClick={()=>{setSavedOnly(!savedOnly);document.getElementById("auctions")?.scrollIntoView({behavior:"smooth"})}}>저장 목록 <span>{favorites.length}</span></button>
    </header>

    <section className="hero" id="top">
      <div className="eyebrow"><i /> 대한민국 법원경매 공개 항목 기준</div>
      <h1>좋은 아파트를<br />좋은 가격에 만나는 방법.</h1>
      <p>복잡한 법원 경매 정보를 보기 쉽게.<br />지역을 선택하면, 원하는 아파트만 빠르게 모아볼 수 있어요.</p>
      <div className="search-shell" aria-label="지역별 아파트 경매 검색">
        <label><span>시·도</span><select value={province} onChange={e=>{setProvince(e.target.value);setDistrict("전체")}} aria-label="시도 선택"><option>전체 지역</option>{Object.keys(districts).map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span>시·군·구</span><select value={district} onChange={e=>setDistrict(e.target.value)} aria-label="시군구 선택" disabled={province==="전체 지역"}>{(districts[province]||["전체"]).map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span>최저매각가격</span><select value={price} onChange={e=>setPrice(e.target.value)} aria-label="최저가 선택"><option>전체 가격</option><option>5억 이하</option><option>5억–10억</option><option>10억 이상</option></select></label>
        <label><span>유찰 횟수</span><select value={failCount} onChange={e=>setFailCount(e.target.value)} aria-label="유찰 횟수 선택"><option>유찰 전체</option><option>0회</option><option>1회</option><option>2회</option><option>3회</option></select></label>
        <button className="search-button" type="button" onClick={applySearch}>물건 찾아보기 <b>→</b></button>
      </div>
      <div className="quick-links"><span>인기 지역</span>{["강남구","서초구","송파구","양천구"].map(x=><button key={x} onClick={()=>chooseQuick(x)}>{x}</button>)}</div>
    </section>

    <section className="trust-strip" aria-label="서비스 정보">
      <div><strong>{auctions.length}</strong><span>둘러볼 수 있는 데모 물건</span></div><div><strong>3</strong><span>서울·경기·인천</span></div><div><strong>매일</strong><span>공고 확인 권장</span></div>
      <p><i /> 현재 화면은 서비스 디자인을 위한 예시 데이터입니다. 입찰 전 법원 공고를 확인하세요.</p>
    </section>

    <section className="auction-section" id="auctions">
      <div className="section-heading"><div><span className="section-kicker">지역별 아파트 경매</span><h2>{savedOnly?"내가 저장한 물건":applied.district!=="전체"?`${applied.district} 아파트`:applied.province!=="전체 지역"?`${applied.province} 아파트`:"지금 살펴볼 물건"}</h2><p>총 <b>{filtered.length}</b>건의 물건을 찾았어요</p></div><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="정렬 방식"><option>매각기일순</option><option>최저가순</option><option>할인율순</option></select></div>
      {filtered.length ? <div className="card-grid">{filtered.map((item)=><article className="auction-card" key={item.id}>
        <div className="card-topline"><span className={item.failCount>1?"hot":""}>{item.status}</span><button className={favorites.includes(item.id)?"liked":""} onClick={()=>toggleFavorite(item.id)} type="button" aria-label={`${item.title} 관심 물건 ${favorites.includes(item.id)?"해제":"저장"}`}>{favorites.includes(item.id)?"♥":"♡"}</button></div>
        <button className={`card-visual ${item.tone}`} onClick={()=>setSelected(item)} aria-label={`${item.title} 상세 보기`}><span>{item.court}</span><strong>{item.discount}%</strong><small>감정가 대비 최저가</small><i className="building-one"/><i className="building-two"/><i className="sun"/></button>
        <div className="card-body"><p className="case-number">{item.id}</p><h3>{item.title}</h3><p className="address">{item.address}<br />전용 {item.area} · {item.floor}</p><div className="price-row"><div><span>감정평가액</span><s>{formatPrice(item.appraisal)}</s></div><div><span>최저매각가격</span><strong>{formatPrice(item.minimum)}</strong></div></div><div className="date-row"><div><span>매각기일</span><b>{item.bidDate}</b></div><button onClick={()=>setSelected(item)}>자세히 보기 <span>→</span></button></div></div>
      </article>)}</div> : <div className="empty-state"><span>⌕</span><h3>조건에 맞는 물건이 없어요</h3><p>지역이나 가격 조건을 조금 넓혀보세요.</p><button onClick={()=>{setApplied({province:"전체 지역",district:"전체",price:"전체 가격",failCount:"유찰 전체"});setSavedOnly(false)}}>전체 물건 보기</button></div>}
    </section>

    <section className="guide-section" id="guide">
      <div className="guide-copy"><span className="section-kicker">처음이라도 괜찮아요</span><h2>물건을 고른 다음,<br />세 가지만 확인하세요.</h2><p>옥션홈은 어려운 경매 용어를 걷어내고, 확인해야 할 순서를 선명하게 보여드립니다.</p><a href="https://www.courtauction.go.kr/pgj/index.on" target="_blank" rel="noreferrer">대한민국 법원경매 바로가기 <span>↗</span></a></div>
      <ol><li><span>01</span><div><h3>매각물건명세서</h3><p>인수할 권리와 임차인의 점유 여부를 확인해요.</p></div></li><li><span>02</span><div><h3>현황조사서</h3><p>실제 점유관계와 부동산의 현재 상태를 살펴봐요.</p></div></li><li><span>03</span><div><h3>감정평가서</h3><p>입지, 시세, 건물 상태와 평가 근거를 비교해요.</p></div></li></ol>
    </section>

    <footer><div className="brand"><span className="brand-mark">A</span><span>옥션홈</span></div><p>아파트 법원경매를 더 쉽고 선명하게.</p><div className="footer-note">제공되는 정보는 참고용이며 법적 효력이 없습니다. 실제 사건 정보와 변경사항은 반드시 대한민국 법원경매에서 재확인하세요.</div><span>© 2026 Auction Home</span></footer>

    {selected&&<div className="modal-backdrop" role="presentation" onMouseDown={()=>setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={()=>setSelected(null)} aria-label="상세 창 닫기">×</button><div className={`modal-visual ${selected.tone}`}><span>{selected.status}</span><strong>{selected.discount}%</strong><small>감정가 대비 최저가</small><i className="building-one"/><i className="building-two"/></div>
      <div className="modal-content"><p className="case-number">{selected.court} · {selected.id}</p><h2 id="detail-title">{selected.title}</h2><p className="modal-address">{selected.address} · 전용 {selected.area} · {selected.floor}</p><div className="modal-prices"><div><span>감정평가액</span><b>{formatPrice(selected.appraisal)}</b></div><div><span>최저매각가격</span><b>{formatPrice(selected.minimum)}</b></div><div><span>매각기일</span><b>{selected.bidDate}</b></div></div><div className="notice-box"><span>확인 메모</span><p>{selected.note}. 실제 공고의 매각물건명세서와 현황조사서를 반드시 다시 확인하세요.</p></div><div className="modal-actions"><button onClick={()=>toggleFavorite(selected.id)}>{favorites.includes(selected.id)?"♥ 저장됨":"♡ 관심 물건 저장"}</button><a href="https://www.courtauction.go.kr/pgj/index.on" target="_blank" rel="noreferrer">법원경매에서 확인 <span>↗</span></a></div></div>
    </section></div>}
  </main>;
}
