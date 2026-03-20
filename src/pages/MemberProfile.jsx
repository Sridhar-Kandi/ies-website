import { useState } from "react";
import { getTheme } from "../data/theme";
import D from "../data/siteData";
import I from "../components/Icons";
import { PhotoPlaceholder, Section, Breadcrumbs } from "../components/Section";

export default function MemberProfile({ dark, navigate, memberId }) {
  const t = getTheme(dark);
  const [open, setOpen] = useState({});
  const tog = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }));

  // Find the member across all categories
  let member = null;
  let category = "";
  for (const cat of ["professor", "seniorResearchers", "phdStudents"]) {
    const found = (D.members[cat] || []).find(
      (m) => m.name.toLowerCase().replace(/\s+/g, "-") === memberId
    );
    if (found) {
      member = found;
      category = cat;
      break;
    }
  }

  if (!member) {
    return (
      <div style={{ paddingTop: 86 }}>
        <Section dark={dark}>
          <p style={{ color: t.txM }}>Member not found.</p>
          <button onClick={() => navigate("members")} style={{ marginTop: 16, padding: "8px 18px", borderRadius: 8, background: t.ac, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Back to Members
          </button>
        </Section>
      </div>
    );
  }

  const bio = member.bio || {};
  const hasBio = bio.headline || bio.summary;

  // Collapsible sections from bio
  const collapsible = [];
  if (bio.publications?.length) collapsible.push({ k: "pub", t: "Recent Publications", d: bio.publications });
  if (bio.theses?.length) collapsible.push({ k: "th", t: "Supervised Theses", d: bio.theses });
  if (bio.memberships?.length) collapsible.push({ k: "mem", t: "Memberships & Professional Service", d: bio.memberships });
  if (bio.teaching?.length) collapsible.push({ k: "teach", t: "Teaching", d: bio.teaching });

  return (
    <div style={{ paddingTop: 86 }}>
      <Section dark={dark}>
        <Breadcrumbs
          items={[{ label: "Home", href: "home" }, { label: "Members", href: "members" }, { label: member.name }]}
          dark={dark}
          navigate={navigate}
        />

        {/* Header: photo + info */}
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap", marginBottom: 44 }}>
          <div style={{ width: "min(100%,280px)", aspectRatio: "3/4", borderRadius: 18, overflow: "hidden" }}>
            {member.photo ? (
              <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <PhotoPlaceholder name={member.name} size={180} style={{ borderRadius: 22 }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 700, color: t.tx, margin: 0, marginBottom: 18 }}>
              {member.name}
            </h1>

            {/* Topics */}
            {member.topics?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {member.topics.map((tp, j) => (
                  <span key={j} style={{ padding: "5px 14px", borderRadius: 99, fontSize: 12, background: t.tg, color: t.tgT, fontWeight: 500 }}>
                    {tp}
                  </span>
                ))}
              </div>
            )}

            {/* Email */}
            {member.email && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 14, color: t.txM }}>
                {I.mail}
                <a href={`mailto:${member.email}`} style={{ color: t.ac, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {member.email}
                </a>
              </div>
            )}

            {/* Bio card */}
            {hasBio && (
              <div style={{ background: t.bgC, borderRadius: 14, border: `1px solid ${t.bd}`, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: t.tx, margin: 0, marginBottom: 4 }}>Executive Summary</h3>
                {bio.headline && <p style={{ fontSize: 14, fontWeight: 500, color: t.ac, margin: 0, marginBottom: 10 }}>{bio.headline}</p>}
                {bio.summary && <p style={{ fontSize: 13, color: t.txM, lineHeight: 1.7, margin: 0, marginBottom: 14 }}>{bio.summary}</p>}
                {bio.highlights?.map((h, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 12, color: t.tx }}>{h.label}:</span>
                    <span style={{ fontSize: 12, color: t.txM }}>{h.detail}</span>
                  </div>
                ))}
                {bio.orcidUrl && (
                  <button
                    onClick={() => window.open(bio.orcidUrl, "_blank")}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, background: t.tg, border: `1px solid ${t.bd}`, borderRadius: 99, padding: "8px 16px", color: t.ac, fontSize: 12, cursor: "pointer", marginTop: 14, fontFamily: "inherit" }}
                  >
                    {I.ext} ORCID Publications
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ongoing Projects */}
        {bio.projects?.length > 0 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: t.tx, margin: 0, marginBottom: 16 }}>Ongoing Projects</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,220px),1fr))", gap: 12, marginBottom: 44 }}>
              {bio.projects.map((op, i) => (
                <div key={i} style={{ padding: 20, borderRadius: 12, background: t.bgC, border: `1px solid ${t.bd}` }}>
                  <div style={{ color: t.ac, marginBottom: 10, opacity: 0.55 }}>{I[op.icon] || I.cpu}</div>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: t.tx, margin: 0, marginBottom: 4 }}>{op.title}</h4>
                  <p style={{ fontSize: 11, color: t.txM, lineHeight: 1.5, margin: 0 }}>{op.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Collapsible sections */}
        {collapsible.map((sec) => (
          <div key={sec.k} style={{ borderTop: `1px solid ${t.bd}` }}>
            <button
              onClick={() => tog(sec.k)}
              style={{ background: "none", border: "none", width: "100%", padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontFamily: "inherit" }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: t.tx }}>{sec.t}</span>
              <span style={{ color: t.ac }}>{open[sec.k] ? I.chevUp : I.chevDown}</span>
            </button>
            {open[sec.k] && (
              <div style={{ paddingBottom: 20 }}>
                {sec.d.map((item, i) => (
                  <p key={i} style={{ fontSize: 13, color: t.txM, lineHeight: 1.7, margin: 0, marginBottom: 6, paddingLeft: 14, borderLeft: `2px solid ${t.ac}20` }}>
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
        {collapsible.length > 0 && <div style={{ borderTop: `1px solid ${t.bd}` }} />}
      </Section>
    </div>
  );
}
