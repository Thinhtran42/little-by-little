import React from "react";
function Person({ x, y, shirt = "#344b47", flip = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path
        d="M-13 49l-4 63m29-63 9 63"
        stroke="#333c37"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path d="M-25 19Q0 4 25 20l-6 44h-42z" fill={shirt} />
      <circle cy="-5" r="17" fill="#e8b38d" />
      <path d="M-17-8q0-30 30-16l7 20-12-10-23 8" fill="#37352e" />
      <path
        d="m-21 24-18 28 21 11m37-39 22 23 20-10"
        fill="none"
        stroke="#e8b38d"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </g>
  );
}
export function FieldScene({ scene, title }) {
  return (
    <svg
      className="fn-scene"
      viewBox="0 0 520 350"
      role="img"
      aria-label={title}
    >
      <rect width="520" height="350" fill="#eee5d5" />
      <path d="M0 255H520V350H0z" fill="#d6d1bb" />
      <path
        d="M0 280h520M65 255l-25 95m130-95-10 95m130-95 10 95m125-95 25 95"
        stroke="#bcb9a5"
        opacity=".5"
      />
      {scene === "cafe" && (
        <>
          <path d="M50 30h210v164H50z" fill="#799b9c" />
          <path d="M55 35h200v154H55z" fill="#c1d4cd" />
          <path d="M150 35v154M55 120h200" stroke="#f6eee0" strokeWidth="8" />
          <g stroke="#8ca8a4" strokeWidth="2">
            <path d="m80 55-8 20m55-8-8 20m100-30-8 20m-40 48-8 20" />
          </g>
          <path d="M310 47h155v118H310z" fill="#344b47" />
          <text x="334" y="86" fill="#eee5d5" fontSize="19" fontFamily="serif">
            COFFEE
          </text>
          <path d="M334 104h95m-95 20h60" stroke="#aebbaa" strokeWidth="3" />
          <Person x={367} y={177} shirt="#bc7757" />
          <path d="M285 222h205v84H285z" fill="#a17754" />
          <path d="M275 216h225v12H275z" fill="#5f5644" />
          <path d="m307 193 3 23h17l3-23z" fill="#fdf6e7" />
          <path
            className="fn-steam"
            d="M315 184q-10-8 0-16"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />
          <Person x={194} y={184} />
          <ellipse cx="92" cy="240" rx="53" ry="10" fill="#806c50" />
          <path d="M92 247v67" stroke="#665a47" strokeWidth="8" />
        </>
      )}
      {scene === "bus" && (
        <>
          <rect x="33" y="72" width="320" height="179" rx="25" fill="#739b95" />
          <path d="M44 161h296v66H44z" fill="#e2c275" />
          <path
            d="M59 91h65v61H59zm78 0h65v61h-65zm78 0h65v61h-65z"
            fill="#d9e4dd"
          />
          <path d="M295 95h37v129h-37z" fill="#334d4b" />
          <circle cx="96" cy="250" r="25" fill="#34423c" />
          <circle cx="284" cy="250" r="25" fill="#34423c" />
          <circle cx="96" cy="250" r="10" fill="#ddd8c3" />
          <circle cx="284" cy="250" r="10" fill="#ddd8c3" />
          <path d="M437 71v201" stroke="#555f53" strokeWidth="6" />
          <rect x="410" y="38" width="55" height="53" rx="8" fill="#d87953" />
          <text x="421" y="73" fill="#fff" fontSize="23">
            24
          </text>
          <Person x={390} y={197} shirt="#ce895f" />
          <path
            d="M44 296h272"
            stroke="#f6efda"
            strokeWidth="5"
            strokeDasharray="36 22"
          />
        </>
      )}
      {scene === "work" && (
        <>
          <rect x="40" y="36" width="207" height="142" fill="#d0c4d6" />
          <path
            d="M56 156v-42h30v42m20 0V86h30v70m20 0V64h30v92m20 0v-52h24v52"
            fill="#a391b0"
          />
          <Person x={104} y={181} shirt="#677a79" />
          <Person x={383} y={181} shirt="#b99bb8" flip />
          <path d="M145 238h208v12H145z" fill="#8b7759" />
          <path
            d="m163 250-7 70m182-70 7 70"
            stroke="#655d4e"
            strokeWidth="7"
          />
          <path d="m218 188 65 0 12 49h-65z" fill="#56645c" />
          <path d="M292 230h38v5h-38z" fill="#f8edda" />
          <rect
            x="353"
            y="48"
            width="96"
            height="75"
            fill="#fff7e5"
            transform="rotate(5 401 85)"
          />
          <text x="368" y="80" fontSize="14" fill="#6f6857">
            DRAFT 01
          </text>
          <path d="M367 92h56m-56 11h38" stroke="#b6ac97" />
        </>
      )}
      {scene === "home" && (
        <>
          <path d="M36 39h183v90H36zm214 0h224v90H250z" fill="#a7ac7e" />
          <path d="M126 39v90m235-90v90" stroke="#e4e1c5" strokeWidth="3" />
          <path d="M28 214h464v89H28z" fill="#b8b38e" />
          <path d="M22 206h477v12H22z" fill="#716d56" />
          <ellipse cx="332" cy="207" rx="38" ry="7" fill="#d9dbcd" />
          <path
            d="M358 205v-40q0-20-20-20t-20 20"
            stroke="#8d9386"
            strokeWidth="6"
            fill="none"
          />
          <Person x={137} y={192} shirt="#d79060" />
          <path
            d="M168 218h41m-39-6h37m-33-6h29"
            stroke="#f9f2dc"
            strokeWidth="5"
          />
          <path d="m413 231 7 68h42l7-68" fill="#687866" />
          <path d="M409 231h63" stroke="#475645" strokeWidth="7" />
        </>
      )}
      {scene === "shop" && (
        <>
          <path
            d="M48 65v233m174-168v168M40 77h190"
            stroke="#716955"
            strokeWidth="6"
          />
          <path
            d="m91 86-26 27 17 17 10-9v70h61v-70l10 9 17-17-27-27-12 9h-37z"
            fill="#78969e"
          />
          <path d="m115 90 9-10 9 10" stroke="#74624a" fill="none" />
          <rect
            x="300"
            y="33"
            width="145"
            height="194"
            rx="65"
            fill="#c8d3c7"
            stroke="#b09a70"
            strokeWidth="9"
          />
          <Person x={355} y={176} shirt="#a87861" />
          <Person x={252} y={194} shirt="#d0b376" />
          <path d="M249 249h40v43h-40z" fill="#faf0d5" />
          <path
            d="m258 250 0-8q12-16 22 0v8"
            fill="none"
            stroke="#a18c64"
            strokeWidth="3"
          />
        </>
      )}
      {scene === "friends" && (
        <>
          <path d="M32 34h146v171H32zm162 0h146v171H194z" fill="#887958" />
          <g stroke="#d2bb90" strokeWidth="14">
            <path d="M44 77h122m-122 53h122m-122 53h122m40-106h122m-122 53h122m-122 53h122" />
          </g>
          <path
            d="M53 46v26m24-31v31m26-23v23m27-27v27m25-24v24M215 45v27m25-30v30m25-23v23m26-30v30m24-23v23"
            stroke="#809b92"
            strokeWidth="12"
          />
          <Person x={193} y={185} shirt="#b9a2b8" />
          <Person x={369} y={185} shirt="#bd825b" flip />
          <ellipse cx="278" cy="243" rx="70" ry="13" fill="#8e7857" />
          <path d="M278 250v67" stroke="#655e4c" strokeWidth="8" />
          <path d="M261 232h40l-4-13h-36z" fill="#eee1ba" />
          <path d="M402 152q-36-87 16-117 35 49-16 117" fill="#8d9c72" />
          <path d="M415 114v148" stroke="#718360" strokeWidth="5" />
        </>
      )}
      <path
        d="M13 13h494v324H13z"
        fill="none"
        stroke="#fff9e9"
        strokeWidth="2"
        opacity=".5"
      />
    </svg>
  );
}
