import test from 'node:test';import assert from 'node:assert/strict';import engine from 'web-audio-engine';import {Orchestra} from '../src/audio.js';
async function render(voice,muted=false){const ctx=new engine.OfflineAudioContext(1,44100,44100);const band=new Orchestra();band.ctx=ctx;band.muted=muted;band.play(voice,0,0);const buffer=await ctx.startRendering();return buffer.getChannelData(0)}
const rms=a=>Math.sqrt(a.reduce((s,v)=>s+v*v,0)/a.length);
for(const [i,name] of [[0,'Bongo'],[4,'Pluck']])test(name+' renders audible, finite audio with phone-friendly harmonics',async()=>{const a=await render(i);assert.ok(a.every(Number.isFinite));assert.ok(rms(a)>.02);assert.ok(Math.max(...a.map(Math.abs))<1);let high=0,total=0;for(let n=0;n<a.length;n++){total+=a[n]**2;if(n)high+=(a[n]-a[n-1])**2}assert.ok(high/total>.0005,'waveform has more than inaudible sub-bass energy')});
test('Master mute renders silence for both repaired voices',async()=>{for(const i of [0,4])assert.equal(rms(await render(i,true)),0)});
test('All five voices render audio',async()=>{for(let i=0;i<5;i++)assert.ok(rms(await render(i))>.002)});
