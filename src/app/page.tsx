import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────── */}
      <section className="px-5 pt-10 pb-8 text-center">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">
          Zealy × Nawazin
        </p>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Z<span className="text-[#D4A017]">&apos;</span>Talk
        </h1>
      </section>

      {/* Poster */}
      <div className="px-5 pb-6">
        <div className="mx-auto max-w-[320px] overflow-hidden rounded-2xl shadow-md">
          <Image
            src="/ztalk-poster.jpg"
            alt="Z-Talk Event Poster"
            width={640}
            height={800}
            className="w-full h-auto block"
            priority
          />
        </div>

        {/* Date strip */}
        <p className="mt-4 text-center text-sm text-gray-500 font-medium">
          May 23, 2026 &nbsp;·&nbsp; Saturday &nbsp;·&nbsp; 2:30 PM
        </p>
      </div>

      <hr className="border-gray-100 mx-5" />

      {/* ── CONTENT ───────────────────────────────── */}
      <section className="px-5 py-8 max-w-lg mx-auto">

        {/* Opening */}
        <p className="text-[17px] font-semibold text-gray-900 leading-snug mb-5" lang="ml">
          പലരും തിരിച്ചറിയാതെ പോകുന്ന ഒരു വലിയ സത്യമുണ്ട്…
        </p>

        {/* Key fact */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-4 py-4 mb-5">
          <p className="text-[15px] leading-[1.85] text-gray-700" lang="ml">
            ഒരു കുഞ്ഞിന്റെ ജീവിതത്തിലെ ഏറ്റവും നിർണായകമായ വളർച്ച
            നടക്കുന്നത്{" "}
            <strong className="text-gray-900">ജനനം മുതൽ 7 വയസ് വരെ</strong>
            യുള്ള കാലഘട്ടത്തിലാണ്.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-4 text-[15px] leading-[1.85] text-gray-600" lang="ml">
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
        </div>

        {/* Callout */}
        <div className="mt-7 rounded-xl bg-gray-50 border border-gray-200 px-4 py-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">കൂടുതൽ അറിയാം</p>
          <p className="text-base font-bold text-gray-900">Must Watch !!</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Z&apos;Talk &nbsp;·&nbsp; 23rd Saturday @ 2:30 pm
          </p>
        </div>
      </section>

      {/* ── VIDEO (hidden — uncomment to enable) ── */}
      {/* <section className="px-5 pb-8 max-w-lg mx-auto">
        <div className="aspect-video w-full overflow-hidden rounded-xl shadow-sm bg-gray-100">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Z-Talk Session Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </section> */}

      <hr className="border-gray-100 mx-5" />

      {/* ── REGISTER ──────────────────────────────── */}
      <section className="px-5 py-10 text-center max-w-lg mx-auto">
        <p className="text-sm text-gray-500 mb-1">Free · Online · May 23, 2026</p>
        <p className="text-lg font-semibold text-gray-900 mb-6">Secure your spot now</p>
        <Link
          href="/user"
          className="block w-full rounded-xl bg-gray-900 py-4 text-[15px] font-bold text-white active:opacity-80 transition-opacity"
        >
          Register Now
        </Link>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="bg-gray-50 border-t border-gray-100 px-5 py-7 text-center">
        <p className="text-sm font-semibold text-gray-700">
          Z<span className="text-[#D4A017]">&apos;</span>Talk
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Zealy Online Preschool · Nawazin
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Orbit Complex, Jafarkhan Colony, Calicut 06
        </p>
        <a
          href="tel:+919037981759"
          className="mt-2 inline-block text-sm font-medium text-gray-600"
        >
          +91 9037 981 759
        </a>
        <p className="mt-4 text-[11px] text-gray-300">© 2026 Zealy · Nawazin</p>
      </footer>

    </div>
  );
}
