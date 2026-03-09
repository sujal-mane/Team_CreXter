import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import { ngos } from '../data/mockData';
import { Star, ShieldCheck } from 'lucide-react';
import './NGOs.css';

export default function NGOs() {
    const gridRef = useRef(null);

    useEffect(() => {
        if (!gridRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.ngo-card', {
                y: 50, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.08, ease: 'power3.out',
                scrollTrigger: { trigger: gridRef.current, start: 'top 85%' },
            });
        }, gridRef.current);
        return () => ctx.revert();
    }, []);

    return (
        <main className="ngo-page">

            {/* ── NGO LISTING ────────────────────────────── */}
            <section className="section ngo-listing" ref={gridRef}>
                <div className="container">
                    <div className="ngo-listing__header">
                        <span className="section-label">
                            <ShieldCheck size={14} /> Trusted Organizations
                        </span>
                        <h2 className="section-title">Our Partner <span className="gradient-text">NGOs</span></h2>
                        <p className="ngo-listing__desc">
                            We collaborate with verified non-profit organizations across India to ensure your
                            donations create real, measurable impact.
                        </p>
                    </div>
                    <div className="ngo-grid">
                        {ngos.slice(0, 3).map((ngo) => (
                            <div className="ngo-card" key={ngo.id}>
                                <div className="ngo-card__top">
                                    <div className="ngo-card__logo">{ngo.logo}</div>
                                    {ngo.verified ? (
                                        <span className="ngo-badge ngo-badge--verified">
                                            <ShieldCheck size={12} /> Verified
                                        </span>
                                    ) : (
                                        <span className="ngo-badge ngo-badge--pending">Pending</span>
                                    )}
                                </div>
                                <div className="ngo-card__body">
                                    <h3 className="ngo-card__name">{ngo.name}</h3>
                                    <p className="ngo-card__focus">{ngo.focus}</p>
                                    <div className="ngo-card__rating">
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <strong>{ngo.rating}</strong>
                                    </div>
                                </div>
                                <div className="ngo-card__stats">
                                    <div>
                                        <strong>{ngo.campaigns}</strong>
                                        <span>Campaigns</span>
                                    </div>
                                    <div>
                                        <strong>{ngo.beneficiaries?.toLocaleString()}</strong>
                                        <span>Beneficiaries</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
