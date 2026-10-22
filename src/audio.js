// Every voice includes midrange energy so small phone/laptop speakers can reproduce it.
export class Orchestra {
  constructor(){this.ctx=null;this.muted=false;this.nodes=new Set();}
  async ready(){this.ctx??=new AudioContext();await this.ctx.resume();}
  play(i,step=0,time){
    if(!this.ctx||this.muted)return;
    const c=this.ctx,t=Math.max(time??c.currentTime,c.currentTime),voices=[];
    const connectTone=(type,frequency,volume,duration,fall)=>{
      const source=c.createOscillator(),gain=c.createGain();source.type=type;
      source.frequency.setValueAtTime(frequency,t);
      if(fall)source.frequency.exponentialRampToValueAtTime(fall,t+Math.min(.16,duration));
      gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(volume,t+.004);
      gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
      source.connect(gain).connect(c.destination);voices.push({source,gain,end:t+duration});
    };
    if(i===0){
      // A rounded low drum plus a pitched wooden knock; the knock survives bass roll-off.
      connectTone('sine',190,.32,.3,65);
      connectTone('triangle',420,.14,.16,180);
    }else if(i===4){
      // Fundamental plus plucked string harmonics, rather than an almost pure sub-bass tone.
      const notes=[1,1.25,1.5,2],root=110*notes[Math.floor(step/4)%4];
      connectTone('triangle',root,.2,.42);
      connectTone('triangle',root*2,.16,.32);
      connectTone('sine',root*4,.09,.19);
    }else if(i===3){
      const notes=[1,1.25,1.5,2];connectTone('sine',659*notes[Math.floor(step/4)%4],.12,.8);
    }else{
      const len=Math.floor(c.sampleRate*.18),buffer=c.createBuffer(1,len,c.sampleRate),a=buffer.getChannelData(0);
      for(let n=0;n<len;n++)a[n]=Math.random()*2-1;
      const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();
      source.buffer=buffer;filter.type='highpass';filter.frequency.value=i===2?6000:1200;
      gain.gain.setValueAtTime(.16,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.24);
      source.connect(filter).connect(gain).connect(c.destination);voices.push({source,gain,filter,end:t+.24});
    }
    for(const {source,gain,filter,end} of voices){this.nodes.add(source);source.onended=()=>{this.nodes.delete(source);source.disconnect();gain.disconnect();filter?.disconnect();};source.start(t);source.stop(end);}
  }
  stopVoices(){for(const n of this.nodes){try{n.stop();}catch{}}this.nodes.clear();}
  close(){this.stopVoices();this.ctx?.close();}
}
