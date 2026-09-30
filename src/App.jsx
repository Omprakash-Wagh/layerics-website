import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './index.css'

const DOWNLOAD_URL = '#' // TODO: replace with the real download link

function RotaryWheel({ dotClass = '' }) {
  return (
    <svg className="rotary" viewBox="0 0 300 300" aria-hidden="true">
      <circle className="rotary-ring" cx="150" cy="150" r="138" transform="rotate(135 150 150)" />
      <circle className="rotary-core" cx="150" cy="150" r="92" />
      <g className={dotClass}><circle className="rotary-dot" cx="106" cy="202" r="7" /></g>
    </svg>
  )
}

function App() {
  const [modalMode, setModalMode] = useState(null); // 'download' or 'instructions' or null

  useEffect(() => {
    if (window.location.hash === '#privacy') setModalMode('privacy');
    if (window.location.hash === '#terms') setModalMode('terms');
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.9, wheelMultiplier: 1.25, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-wordmark span', { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power4.out', delay: 0.1 })

      gsap.utils.toArray('.cl').forEach((el, i) => {
        gsap.to(el, { yPercent: [-10, -18, -8, -24, -14][i], ease: 'none',
          scrollTrigger: { trigger: '.colophon', start: 'top bottom', end: 'bottom bottom', scrub: 0.3 } })
      })
      gsap.to('.footer-dot', { rotation: 360, svgOrigin: '150 150', duration: 40, repeat: -1, ease: 'none' })
    })

    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  return (
    <>
      {/* Global Grain */}
      <div className="grain"></div>

      {/* Download Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} data-lenis-prevent>
            <button type="button" className="modal-close" onClick={() => setModalMode(null)}>×</button>
            
                        {modalMode === 'instructions' || modalMode === 'download' ? (
              <>
                <div className="modal-caution font-grotesk">
                  <strong>⚠️ CAUTION:</strong> These instructions are highly important. The app will not work if you skip them!
                </div>

                <h3 className="modal-title font-grotesk">Installation Guide</h3>
                
                <ol className="modal-steps font-serif italic">
                  <li><strong>Download:</strong> Click the download button below to get the APK file.</li>
                  <li><strong>Pause Play Protect:</strong> Open the Play Store, go to Settings ➔ Play Protect, and turn off the toggle (we recommend pausing it).</li>
                  <li><strong>Install:</strong> Open the downloaded APK and install the app.</li>
                  <li><strong>Enable Play Protect:</strong> Turn Play Protect back on as soon as the app is installed.</li>
                  <li><strong>Allow Restricted Settings:</strong> If the device refuses to give "write over other app" permission, hold on the app icon, click <strong>App info</strong>, click the three dots in the right corner and allow unrestricted access (Allow restricted settings).</li>
                  <li><strong>Setup:</strong> Open the app, give required permissions, and use the rotary wheel to turn on the service.</li>
                </ol>
              </>
            ) : modalMode === 'privacy' ? (
              <>
                <h3 className="modal-title font-grotesk" style={{ fontSize: '2.5rem' }}>Privacy Policy</h3>
                <div className="modal-steps font-serif" style={{ fontSize: '1.25rem' }}>
                  <p style={{ marginBottom: '1rem' }}>Last updated: September 2026</p>
                  <p style={{ marginBottom: '1rem' }}>Layerics ("we", "our", or "us") respects your privacy. This Privacy Policy explains how we handle data when you use the Layerics Android application.</p>
                  <p style={{ marginBottom: '1rem' }}><strong>Permissions Explained:</strong></p>
                  <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Draw Over Other Apps:</strong> Required exclusively to display the floating lyrics window over your screen.</li>
                    <li style={{ marginBottom: '0.5rem' }}><strong>Notification/Media Access:</strong> Required strictly to detect the currently playing song from your media players to fetch the correct lyrics.</li>
                  </ul>
                  <p style={{ marginBottom: '1rem' }}><strong>Data Collection & Use:</strong> We do not log your keystrokes, monitor your screen content, or read your personal messages. Layerics only reads the metadata of the currently playing media. No personal data is sold or shared with third parties.</p>
                </div>
              </>
            ) : modalMode === 'terms' ? (
              <>
                <h3 className="modal-title font-grotesk" style={{ fontSize: '2.5rem' }}>Terms & Conditions</h3>
                <div className="modal-steps font-serif" style={{ fontSize: '1.25rem' }}>
                  <p style={{ marginBottom: '1rem' }}>Last updated: September 2026</p>
                  <p style={{ marginBottom: '1rem' }}>By downloading and using Layerics, you agree to these Terms & Conditions.</p>
                  <p style={{ marginBottom: '1rem' }}><strong>Use of the App:</strong> Layerics is provided "as is". You agree to use it at your own risk. We are not responsible for any issues arising from sideloading the application or bypassing system warnings.</p>
                  <p style={{ marginBottom: '1rem' }}><strong>Lyrics Content:</strong> The lyrics displayed by the app are fetched from third-party sources. We do not claim ownership of the lyrical content, which remains the property of the respective copyright holders.</p>
                </div>
              </>
            ) : null}

            {modalMode === 'download' && (
              <div className="modal-footer">
                <a className="download-btn font-mono cta-btn-large" href={DOWNLOAD_URL} onClick={(e) => {
                    if(DOWNLOAD_URL === '#') e.preventDefault();
                    setModalMode(null);
                }}>
                  Download APK <span aria-hidden="true">↓</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-wordmark font-grotesk">
          <span>L</span>
          <span className="font-serif italic misregistration" data-text="a">a</span>
          <span>y</span>
          <span className="font-serif italic">e</span>
          <span className="misregistration misregistration-mauve" data-text="r">r</span>
          <span>i</span>
          <span className="font-serif">c</span>
          <span>s</span>
        </h1>
        
        <div className="hero-layout">
          <div className="container" style={{ width: '30vw', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', position: 'relative', zIndex: 10 }}>
            <button type="button" className="download-btn font-mono" onClick={(e) => { e.preventDefault(); setModalMode('download'); }}>Download <span aria-hidden="true">↓</span></button>
            <button type="button" className="instruction-link font-serif italic" onClick={(e) => { e.preventDefault(); setModalMode('instructions'); }}>Installation Instructions</button>
          </div>
          
          <div className="hero-shot-container">
            <div className="sheet-stack"></div>
            <img src="/Screenshot_2026-09-30-13-06-55-27_0f40faabe8b75103479d723d03b3e00e.jpg" alt="App UI" className="hero-img" />

            
          </div>
        </div>

        <div className="shot-text">
          <div className="shot-text-inner">
            <div className="index-rows">
              <div className="index-row">
                <div className="index-num font-mono">01</div>
                <h2 className="index-title font-grotesk misregistration" data-text="Overlay">Overlay</h2>
                <p className="index-desc font-serif italic">A highly responsive, draggable lyrics window that hovers over any app. Unobtrusive and sleek.</p>
              </div>
              <div className="index-row">
                <div className="index-num font-mono">02</div>
                <h2 className="index-title font-serif italic misregistration" data-text="Sync">Sync</h2>
                <p className="index-desc font-grotesk">Create custom sync profiles to match your specific audio hardware latency.</p>
              </div>
              <div className="index-row">
                <div className="index-num font-mono">03</div>
                <h2 className="index-title font-grotesk misregistration" data-text="Universal">Universal</h2>
                <p className="index-desc font-serif">Automatically detects and syncs with Spotify, YouTube Music, Apple Music, and local media players.</p>
              </div>
            </div>
            <p className="manifesto-text font-grotesk">
              Music is inherently emotional, yet our interfaces are rigid. Layerics believes lyrics should flow like ink.
              <span className="font-serif italic" style={{ color: 'var(--peach)', whiteSpace: 'nowrap' }}> It's not a window, it's a layer. </span>
              We break the grid to let the words breathe.{' '}
              Synchronization is an art, not just a utility.
            </p>
          </div>
        </div>
      </section>

      {/* Colophon Footer */}
      <footer className="colophon">
        <div className="colophon-art" aria-hidden="true">
          <div className="colophon-lyrics" aria-hidden="true">
            <p className="cl cl-1 font-serif italic">the lights go soft</p>
            <p className="cl cl-2 font-grotesk">before the chorus</p>
            <p className="cl cl-3 font-hand">hold the note</p>
            <p className="cl cl-4 font-grotesk misregistration" data-text="a little longer">a little longer</p>
            <p className="cl cl-5 font-serif italic">catch up</p>
          </div>
          <div className="colophon-wheel"><RotaryWheel dotClass="footer-dot" /></div>
        </div>
        
        <div className="container colophon-cta">
          <h3 className="cta-headline font-grotesk">Ready to flow?</h3>
          <p className="cta-subtext font-serif italic">Get the latest release of Layerics for Android.</p>
          <button type="button" className="download-btn cta-btn-large font-mono" onClick={(e) => { e.preventDefault(); setModalMode('download'); }}>
            Download APK <span aria-hidden="true">↓</span>
          </button>
          <button type="button" className="instruction-link font-serif italic" onClick={(e) => { e.preventDefault(); setModalMode('instructions'); }} style={{marginTop: '1rem'}}>Installation Instructions</button>
        </div>
        
                <h2 className="colophon-giant font-grotesk">Layerics</h2>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', paddingBottom: '4vh', position: 'relative', zIndex: 10 }}>
          <button type="button" className="instruction-link font-serif italic" style={{ fontSize: '1rem' }} onClick={(e) => { e.preventDefault(); setModalMode('privacy'); }}>Privacy Policy</button>
          <button type="button" className="instruction-link font-serif italic" style={{ fontSize: '1rem' }} onClick={(e) => { e.preventDefault(); setModalMode('terms'); }}>Terms & Conditions</button>
        </div>
      </footer>
    </>
  )
}

export default App





