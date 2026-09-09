import React, { useState } from 'react';
import PhrasalStories from './PhrasalStories.jsx';
import StationLesson from './StationLesson.jsx';

export default function PhrasalHub({speak, illustration}) {
  const [station,setStation]=useState(false);
  if(station)return <div className="phrasal-hub"><button className="text-button" onClick={()=>setStation(false)}>← Các nhóm bài học</button><StationLesson speak={speak}/></div>;
  return <div className="phrasal-hub"><PhrasalStories illustration={illustration} speak={speak} onStation={()=>setStation(true)}/></div>;
}
