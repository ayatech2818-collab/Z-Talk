"use client";

import { useState } from "react";

export default function ShowMoreSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4 text-[15px] leading-[1.85] text-gray-600" lang="ml">
      {expanded && (
        <>
          <p>
            ഈ പ്രായത്തിൽ ലഭിക്കുന്ന സ്നേഹം, സംസാരശൈലി, വീട്ടിലെ
            അന്തരീക്ഷം, മാതാപിതാക്കളുടെ പ്രതികരണങ്ങൾ — ഇവയൊക്കെയാണ്
            അവരുടെ ആത്മവിശ്വാസത്തെയും സ്വഭാവത്തെയും ഭാവിയെയും
            നിശബ്ദമായി രൂപപ്പെടുത്തുന്നത്.
          </p>
          <p>
            ചിലപ്പോൾ സ്നേഹത്തോടെ ചെയ്യുന്ന കാര്യങ്ങൾ പോലും കുട്ടിയെ
            തെറ്റായ രീതിയിൽ ബാധിക്കാം…
          </p>
          <p className="text-gray-800 font-medium">
            എന്നാൽ ശരിയായ അറിവും സമീപനവും ഉണ്ടെങ്കിൽ ഓരോ
            മാതാപിതാക്കൾക്കും ഒരു കുഞ്ഞിന്റെ ജീവിതം മനോഹരമായി
            മാറ്റാൻ കഴിയും. ❤️
          </p>
        </>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {expanded ? "Show Less ↑" : "Show More ↓"}
      </button>
    </div>
  );
}
