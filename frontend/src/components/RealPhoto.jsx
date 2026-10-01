import React, { useState } from "react";
import { photoSources } from "../../../shared/photo-sources.js";
import "./real-photo.css";

export function RealPhoto({ scene = "cafe", priority = false }) {
  const photo = photoSources[scene] || photoSources.cafe;
  const [failed, setFailed] = useState(false);
  return (
    <span className="real-photo fn-scene">
      {failed ? (
        <span className="photo-unavailable">Ảnh tạm thời chưa tải được</span>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: photo.position }}
          onError={() => setFailed(true)}
        />
      )}
      <span className="photo-credit">{photo.author} / Pexels</span>
    </span>
  );
}
export function PhotoCredit({ scene }) {
  const p = photoSources[scene];
  return p ? (
    <small>
      Ảnh:{" "}
      <a href={p.url} target="_blank" rel="noreferrer">
        {p.author} / Pexels
      </a>{" "}
      ·{" "}
      <a href={p.licenseUrl} target="_blank" rel="noreferrer">
        Giấy phép
      </a>
      . Ảnh bối cảnh, nhân vật trong bài là hư cấu.
    </small>
  ) : null;
}
