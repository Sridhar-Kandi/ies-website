import D from"../data/siteData";
export default function Hero({dark}){
return<section style={{minHeight:"88vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
<img src={D.heroImage} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
<div style={{position:"absolute",inset:0,background:"linear-gradient(155deg,rgba(12,22,41,0.92) 0%,rgba(20,32,74,0.85) 50%,rgba(26,16,64,0.88) 100%)"}} />
<div style={{position:"absolute",top:-120,right:-120,width:480,height:480,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.04)",pointerEvents:"none"}} />
<div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:0.02,backgroundImage:"linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",backgroundSize:"56px 56px"}} />
<div style={{maxWidth:1200,margin:"0 auto",padding:"110px 24px 72px",position:"relative",zIndex:1,width:"100%"}}><div style={{maxWidth:660}}>
<div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.06)",borderRadius:99,padding:"5px 14px",marginBottom:24,border:"1px solid rgba(255,255,255,0.07)"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#34d399"}} /><span style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>University of Freiburg · Faculty of Engineering</span></div>
<h1 style={{fontSize:"clamp(34px,5.5vw,64px)",fontWeight:700,color:"#fff",lineHeight:1.08,margin:0,marginBottom:18}}>Intelligent<br/><span style={{fontWeight:300,background:"linear-gradient(135deg,#93c5fd,#c4b5fd)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Embedded</span> Systems</h1>
<p style={{fontSize:"clamp(14px,1.6vw,17px)",color:"rgba(255,255,255,0.5)",lineHeight:1.7,maxWidth:500,margin:0}}>Pioneering research in wearable computing, digital health, machine learning, and extended realities.</p>
<div style={{display:"flex",gap:8,marginTop:32,flexWrap:"wrap"}}>{["Wearable AI","Digital Health","Embedded ML","XR Systems"].map(tg=><span key={tg} style={{padding:"6px 14px",borderRadius:99,fontSize:11,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.07)"}}>{tg}</span>)}</div>
</div></div></section>;
}
