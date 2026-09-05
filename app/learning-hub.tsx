"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, Code2, FlaskConical, LockKeyhole, ShieldCheck, Terminal, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const weeks = [
  { id:"week-1", title:"Read the trail", skill:"Linux logs + Python parsing", time:"45 min", goal:"Detect repeated failed logins", detail:"Parse a synthetic auth log, extract IP addresses and usernames, then flag three or more failures.", command:"python3 detect_failures.py", color:"lime" },
  { id:"week-2", title:"Hash, then verify", skill:"File integrity monitoring", time:"50 min", goal:"Spot one changed toy file", detail:"Create SHA-256 baselines for a local test folder and report files that changed, appeared, or disappeared.", command:"sha256sum lab/*", color:"cyan" },
  { id:"week-3", title:"Permission patrol", skill:"Linux permissions", time:"40 min", goal:"Find risky permissions in a toy tree", detail:"Build a harmless folder tree and write a Python audit that explains world-writable files.", command:"find toyfs -type f -perm -002", color:"amber" },
  { id:"week-4", title:"Decode the request", skill:"HTTP log analysis", time:"55 min", goal:"Summarise status codes", detail:"Analyse synthetic web access logs and identify bursts of errors without contacting any server.", command:"python3 analyse_http.py", color:"violet" },
  { id:"week-5", title:"Secrets stay secret", skill:"Defensive code review", time:"45 min", goal:"Repair three insecure patterns", detail:"Review a toy Python app for hard-coded secrets, unsafe input handling, and overly broad file access.", command:"python3 -m compileall safe_app", color:"rose" },
  { id:"week-6", title:"Rules of detection", skill:"Indicators + alert logic", time:"60 min", goal:"Write three precise alert rules", detail:"Turn synthetic events into rules with thresholds, reasons, and false-positive notes.", command:"python3 rules.py events.json", color:"blue" },
  { id:"week-7", title:"Mini incident desk", skill:"Triage + timeline", time:"60 min", goal:"Build a five-event timeline", detail:"Sort a mixed packet of toy logs into a clear incident timeline and document your evidence.", command:"sort -k1,2 toy_events.log", color:"orange" },
  { id:"week-8", title:"Blue-team capstone", skill:"Combine and report", time:"75 min", goal:"Produce one local HTML report", detail:"Combine your detectors into a local tool that creates a concise, evidence-based security report.", command:"python3 blueforge.py sample_lab", color:"emerald" },
];

const quiz = [
  { q:"Which value is best for checking whether a local file changed?", options:["SHA-256 hash","Filename length","Terminal colour"], answer:0 },
  { q:"A detector flags normal activity too often. What is this called?", options:["False positive","Encryption","Privilege"], answer:0 },
  { q:"Where should these exercises run?", options:["Random public servers","An isolated local toy lab","A school network"], answer:1 },
];

export default function LearningHub({displayName, signOutPath}:{displayName:string; signOutPath:string}) {
  const [done,setDone]=useState<Set<string>>(new Set());
  const [selected,setSelected]=useState(weeks[0]);
  const [answers,setAnswers]=useState<Record<number,number>>({});
  const [message,setMessage]=useState("");
  useEffect(()=>{ fetch("/api/progress").then(r=>r.json()).then(d=>d.completed&&setDone(new Set(d.completed))).catch(()=>setMessage("Progress could not be loaded.")); },[]);
  const percent=Math.round(done.size/weeks.length*100);
  const next=useMemo(()=>weeks.find(w=>!done.has(w.id)) ?? weeks[weeks.length-1],[done]);
  async function toggle(id:string, checked:boolean) {
    const previous=new Set(done); const updated=new Set(done); checked?updated.add(id):updated.delete(id); setDone(updated); setMessage("Saving…");
    const res=await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:id,completed:checked})});
    if(!res.ok){setDone(previous);setMessage("Save failed — try again.");} else setMessage("Progress saved");
  }
  const score=quiz.reduce((n,x,i)=>n+(answers[i]===x.answer?1:0),0);
  return <main className="min-h-screen">
    <header className="topbar"><div className="brand"><span className="brandmark"><ShieldCheck/></span><span>BLUEFORGE</span><b>DEFENSIVE LAB</b></div><div className="account"><span>{displayName}</span><a href={signOutPath}>Sign out</a></div></header>
    <div className="shell">
      <aside className="rail"><nav><a className="active"><BookOpen/>Learn</a><a href="#roadmap"><Trophy/>Roadmap</a><a href="#quiz"><Code2/>Quiz</a></nav><div className="safety"><LockKeyhole/><div><b>Safe by design</b><p>Local toy labs only. Never test systems you do not own or have explicit permission to use.</p></div></div></aside>
      <section className="workspace">
        <div className="welcome"><div><p className="eyebrow">YOUR DEFENDER PATH</p><h1>Welcome back, {displayName}.</h1><p>Learn to read the quiet clues computers leave behind.</p></div><div className="rank"><span>TRAINEE</span><b>{done.size}<small>/8 labs</small></b></div></div>
        <div className="progress-card"><div><span>Path progress</span><b>{percent}%</b></div><Progress value={percent}/><p>{done.size===8?"Path complete. Your capstone awaits refinement.":`${8-done.size} labs remain · Next: ${next.title}`}</p></div>
        <Tabs defaultValue="lab" className="hub-tabs">
          <TabsList><TabsTrigger value="lab">Current lab</TabsTrigger><TabsTrigger value="roadmap">Roadmap</TabsTrigger><TabsTrigger value="quiz">Quick quiz</TabsTrigger></TabsList>
          <TabsContent value="lab"><div className="lab-grid"><article className="lab-main"><div className="lab-kicker"><FlaskConical/> WEEK 01 · LOG ANALYSIS</div><h2>Build a failed-login detector</h2><p>Turn a synthetic authentication log into a useful alert. You will extract IP addresses and usernames, count failures, and explain why a threshold fired.</p><div className="pipeline"><span>LOGS</span><ChevronRight/><span>PARSE</span><ChevronRight/><span>COUNT</span><ChevronRight/><span>ALERT</span></div><div className="codebox"><div><i></i><i></i><i></i><span>auth_toy.log</span></div><pre>{`Sep 05 17:10 lab sshd: Failed password for student from 192.0.2.10\nSep 05 17:11 lab sshd: Failed password for root from 192.0.2.10\nSep 05 17:13 lab sshd: Failed password for admin from 192.0.2.10`}</pre></div><div className="goal"><CheckCircle2/><div><b>Finish line</b><p>Your script prints the alerted IP and every targeted username.</p></div></div><Button onClick={()=>toggle("week-1",!done.has("week-1"))}>{done.has("week-1")?"Mark incomplete":"Mark lab complete"}</Button></article><aside className="brief"><h3>Mission brief</h3><dl><dt>Environment</dt><dd><Terminal/>Local Kali VM</dd><dt>Tools</dt><dd><Code2/>Python 3 · regex</dd><dt>Time</dt><dd>45 minutes</dd></dl><hr/><h3>Guardrails</h3><ul><li>Use only the supplied synthetic data.</li><li>No scanning or contacting other devices.</li><li>Explain every alert with evidence.</li></ul></aside></div></TabsContent>
          <TabsContent value="roadmap"><div id="roadmap" className="roadmap"><div className="section-title"><div><p className="eyebrow">8-WEEK ROADMAP</p><h2>From logs to incident report</h2></div><span>{message}</span></div><div className="week-list">{weeks.map((w,i)=><article key={w.id} className={selected.id===w.id?"selected":""} onClick={()=>setSelected(w)}><Checkbox checked={done.has(w.id)} onCheckedChange={v=>toggle(w.id,Boolean(v))} onClick={e=>e.stopPropagation()} aria-label={`Mark ${w.title} complete`}/><span className={`week-num ${w.color}`}>{String(i+1).padStart(2,"0")}</span><div><b>{w.title}</b><p>{w.skill} · {w.time}</p></div><ChevronRight/></article>)}</div><div className="detail-panel"><p className="eyebrow">SELECTED MISSION</p><h3>{selected.title}</h3><p>{selected.detail}</p><code>{selected.command}</code><b>Goal: {selected.goal}</b></div></div></TabsContent>
          <TabsContent value="quiz"><section id="quiz" className="quiz"><p className="eyebrow">QUICK CHECK</p><h2>Think like a defender</h2>{quiz.map((item,i)=><fieldset key={item.q}><legend><span>{i+1}</span>{item.q}</legend>{item.options.map((o,j)=><label key={o} className={answers[i]===j?"picked":""}><input type="radio" name={`q${i}`} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/>{o}</label>)}</fieldset>)}<div className="score"><Trophy/><div><b>{Object.keys(answers).length===3?`${score}/3 correct`:"Answer all three"}</b><p>{Object.keys(answers).length===3?(score===3?"Clean sweep. Evidence first, always.":"Review the highlighted choices and try again."):"Your result appears here."}</p></div></div></section></TabsContent>
        </Tabs>
      </section>
    </div>
  </main>
}
