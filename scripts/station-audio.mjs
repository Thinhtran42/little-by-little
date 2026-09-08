import { stationLesson } from '../shared/station-lesson.js';
import { GoogleAuth } from 'google-auth-library';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Default is a local cost estimate. --generate explicitly calls a billable API.
const voices={female:'en-US-Chirp3-HD-Kore',male:'en-US-Chirp3-HD-Charon'};
const lines=[...stationLesson.dialogue.map(([,line])=>line),...stationLesson.targets.map(t=>t.en),...stationLesson.questions.map(q=>q.answer)];
const jobs=[...new Set(lines)].flatMap(text=>Object.entries(voices).map(([role,voice])=>({text,role,voice,id:createHash('sha256').update(JSON.stringify({text,voice,encoding:'MP3'})).digest('hex').slice(0,24)})));
const characters=jobs.reduce((n,j)=>n+[...j.text].length,0);
console.log(JSON.stringify({clips:jobs.length,characters,estimatedUSDWithoutFreeTier:characters*30/1000000,mode:process.argv.includes('--generate')?'generate':'estimate'},null,2));
if(process.argv.includes('--generate')){
  const project=process.env.GOOGLE_CLOUD_PROJECT;
  if(!project)throw new Error('Set GOOGLE_CLOUD_PROJECT and Application Default Credentials locally. Do not paste credentials into source.');
  const auth=new GoogleAuth({scopes:['https://www.googleapis.com/auth/cloud-platform']});
  const client=await auth.getClient();
  const root=new URL('../frontend/public/audio/station/',import.meta.url);
  await mkdir(root,{recursive:true});
  const manifest={lessonId:stationLesson.id,lessonVersion:stationLesson.version,provider:'google-chirp3-hd',clips:[]};
  for(const job of jobs){
    const target=new URL(job.id+'.mp3',root);
    const exists=await access(target).then(()=>true,()=>false);
    if(!exists){
      const response=await client.request({url:'https://texttospeech.googleapis.com/v1/text:synthesize',method:'POST',headers:{'x-goog-user-project':project},timeout:30000,retry:false,data:{input:{text:job.text},voice:{languageCode:'en-US',name:job.voice},audioConfig:{audioEncoding:'MP3'}}});
      if(!response.data.audioContent)throw new Error('Provider did not return audio.');
      await writeFile(target,Buffer.from(response.data.audioContent,'base64'));
    }
    manifest.clips.push({...job,url:'/audio/station/'+job.id+'.mp3'});
  }
  await writeFile(new URL('manifest.json',root),JSON.stringify(manifest,null,2));
  console.log('Audio generated. Listen and review all clips before publishing.');
}
