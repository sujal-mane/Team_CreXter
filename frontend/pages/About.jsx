import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../hooks/useGsap';
import {
    Heart, Shield, Globe, Users, Zap, Eye,
    HandHeart, Building2, Utensils, ChevronDown,
    ArrowRight, Sparkles, Target, TrendingUp
} from 'lucide-react';
import CountUp from 'react-countup';
import './About.css';

const stats = [
    { icon: Heart, value: 50000, suffix: '+', label: 'Lives Impacted', color: '#ef4444' },
    { icon: Building2, value: 500, suffix: '+', label: 'Partner NGOs', color: '#3b82f6' },
    { icon: Users, value: 10000, suffix: '+', label: 'Active Volunteers', color: '#8b5cf6' },
    { icon: TrendingUp, value: 25, suffix: 'M+', label: 'Donations (₹)', color: '#10b981' },
];

const values = [
    { icon: Eye, title: 'Transparency', desc: 'Every donation is tracked and verified in real-time so you always know where your contribution goes.', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { icon: Shield, title: 'Trust & Security', desc: 'Bank-grade encryption, verified NGOs, and strict protocols ensure your data and donations are always safe.', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { icon: Globe, title: 'Real Impact', desc: 'Tangible, measurable change in communities across India — every rupee creates a ripple effect.', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { icon: Zap, title: 'Innovation', desc: 'AI-driven matching, real-time tracking, and smart allocation ensure maximum efficiency.', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { icon: HandHeart, title: 'Compassion', desc: 'People-first approach in everything we do — technology serves humanity, not the other way around.', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
    { icon: Target, title: 'Accessibility', desc: 'Simple, intuitive platform designed so anyone can contribute, regardless of tech expertise.', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
];

const services = [
    { icon: Heart, title: 'Organ Donation', desc: 'Register as an organ donor, track your application, and save lives through our certified hospital network.', stat: '8 Organ Types' },
    { icon: Utensils, title: 'Food Donation', desc: 'Donate surplus food with real-time volunteer allocation, delivery tracking, and environmental impact reports.', stat: 'Zero Waste' },
    { icon: Building2, title: 'NGO Connect', desc: 'Verified NGOs receive direct donations with complete transparency — every rupee accounted for.', stat: '500+ NGOs' },
    { icon: Users, title: 'Volunteer Network', desc: 'Join our volunteer force and contribute your time and skills to meaningful causes near you.', stat: '10K+ Active' },
];

const timeline = [
    { year: '2022', title: 'The Spark', desc: 'UnityDrop was born from a simple idea — what if donating was as easy and transparent as online shopping?' },
    { year: '2023', title: 'Platform Launch', desc: 'First version launched with monetary donations, NGO verification, and real-time impact tracking.' },
    { year: '2024', title: 'Expanding Horizons', desc: 'Added organ donation registration, food donation module, volunteer network, and hospital integration.' },
    { year: '2025', title: 'Scaling Impact', desc: 'AI-driven matching, multi-city expansion, and government scheme integration reached millions.' },
    { year: '2026', title: 'The Future', desc: 'Building the most trusted donation ecosystem in India with blockchain transparency and global reach.' },
];

const faqs = [
    { q: 'How does UnityDrop verify NGOs?', a: 'We use a rigorous multi-step verification process including document checks, on-ground visits, financial audits, and OTP-based authentication to ensure every NGO on our platform is legitimate.' },
    { q: 'Is my donation tax-deductible?', a: 'Yes! Donations to verified NGOs on our platform are eligible for tax deductions under Section 80G. You receive an automatic receipt for every donation.' },
    { q: 'How can I track my donation?', a: 'Every donation is tracked in real-time on your personal dashboard. You can see the exact status, utilization breakdown, and impact reports.' },
    { q: 'Is organ donation registration safe?', a: 'Absolutely. All organ donations go through rigorous medical screening and are conducted only at government-certified hospitals with full legal compliance.' },
    { q: 'Can I volunteer without donating money?', a: 'Yes! You can sign up as a volunteer and contribute your time, skills, and effort. Our platform matches you with nearby causes that need help.' },
];

export default function About() {
    const [openFaq, setOpenFaq] = useState(null);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const servicesRef = useRef(null);
    const timelineRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Hero entrance */
            if (heroRef.current) {
                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                tl.from('.about-hero__badge', { y: 30, opacity: 0, scale: 0.9, duration: 0.6, delay: 0.2 })
                  .from('.about-hero__title', { y: 50, opacity: 0, duration: 0.7 }, '-=0.3')
                  .from('.about-hero__subtitle', { y: 40, opacity: 0, duration: 0.6 }, '-=0.35')
                  .from('.about-hero__actions > *', { y: 30, opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.1 }, '-=0.3')
                  .from('.about-hero__shapes > *', { scale: 0, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'elastic.out(1,0.6)' }, '-=0.5');
            }

            /* Stats */
            if (statsRef.current) {
                gsap.from('.about-stat-card', {
                    y: 40, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
                });
            }

            /* Story */
            if (storyRef.current) {
                gsap.from('.story__text > *', {
                    x: -40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
                });
                gsap.from('.story__visual', {
                    x: 50, opacity: 0, scale: 0.95, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: storyRef.current, start: 'top 80%' },
                });
            }

            /* Values */
            if (valuesRef.current) {
                gsap.from('.value-card', {
                    y: 50, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.08, ease: 'power3.out',
                    scrollTrigger: { trigger: valuesRef.current, start: 'top 85%' },
                });
            }

            /* Services */
            if (servicesRef.current) {
                gsap.from('.service-card', {
                    y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: servicesRef.current, start: 'top 85%' },
                });
            }

            /* Timeline */
            if (timelineRef.current) {
                gsap.from('.tl-item', {
                    y: 40, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: timelineRef.current, start: 'top 85%' },
                });
            }

            /* FAQ */
            if (faqRef.current) {
                gsap.from('.faq-item', {
                    y: 30, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out',
                    scrollTrigger: { trigger: faqRef.current, start: 'top 85%' },
                });
            }

            /* CTA */
            if (ctaRef.current) {
                gsap.from(ctaRef.current, {
                    y: 40, opacity: 0, scale: 0.95, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 90%' },
                });
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <main className="about-page">

            {/* ── HERO ──────────────────────────────────────── */}
            <section className="about-hero" ref={heroRef}>
                <div className="about-hero__bg" />
                <div className="about-hero__shapes">
                    <div className="shape shape--1" />
                    <div className="shape shape--2" />
                    <div className="shape shape--3" />
                </div>
                <div className="container about-hero__inner">
                    <span className="about-hero__badge">
                        <Sparkles size={14} /> About UnityDrop
                    </span>
                    <h1 className="about-hero__title">
                        Connecting Hearts,<br />
                        <span className="gradient-text">Changing Lives</span>
                    </h1>
                    <p className="about-hero__subtitle">
                        A transparent, tech-driven platform bridging the gap between donors,
                        NGOs, hospitals, and volunteers to create meaningful, lasting impact
                        across India.
                    </p>
                    <div className="about-hero__actions">
                        <Link to="/donate" className="btn btn-primary btn-lg">
                            Start Donating <ArrowRight size={18} />
                        </Link>
                        <Link to="/register-donor" className="btn btn-ghost btn-lg">
                            Become a Donor
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── STATS BAR ─────────────────────────────────── */}
            <section className="about-stats" ref={statsRef}>
                <div className="container about-stats__grid">
                    {stats.map((s) => (
                        <div className="about-stat-card" key={s.label}>
                            <div className="about-stat-card__icon" style={{ background: `${s.color}15`, color: s.color }}>
                                <s.icon size={24} />
                            </div>
                            <div className="about-stat-card__value">
                                <CountUp end={s.value} duration={2.5} separator="," suffix={s.suffix} enableScrollSpy scrollSpyOnce />
                            </div>
                            <div className="about-stat-card__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── OUR STORY ─────────────────────────────────── */}
            <section className="section about-story" ref={storyRef}>
                <div className="container story__inner">
                    <div className="story__text">
                        <span className="section-label">Our Story</span>
                        <h2 className="section-title">
                            Built on Empathy,<br />Powered by Technology
                        </h2>
                        <p>
                            UnityDrop was born from a simple frustration — donating should be
                            as easy, transparent, and rewarding as any modern digital
                            experience. Too many people want to help but don't know where to
                            start or whether their contribution truly made a difference.
                        </p>
                        <p>
                            We built a platform that verifies every participant, tracks every
                            donation in real-time, and provides clear impact reports — so you
                            can see exactly how your generosity changes lives. Whether it's
                            monetary aid, organ donation, or food redistribution, UnityDrop
                            makes giving effortless and meaningful.
                        </p>
                        <div className="story__highlights">
                            <div className="story__highlight">
                                <Shield size={20} />
                                <span>100% Verified NGOs</span>
                            </div>
                            <div className="story__highlight">
                                <Eye size={20} />
                                <span>Real-Time Tracking</span>
                            </div>
                            <div className="story__highlight">
                                <Globe size={20} />
                                <span>Pan-India Network</span>
                            </div>
                        </div>
                    </div>
                    <div className="story__visual">
                        <div className="story__visual-card story__visual-card--1">
                            <Heart size={32} />
                            <span>50K+ Lives</span>
                        </div>
                        <div className="story__visual-card story__visual-card--2">
                            <Building2 size={32} />
                            <span>500+ NGOs</span>
                        </div>
                        <div className="story__visual-card story__visual-card--3">
                            <Users size={32} />
                            <span>10K+ Volunteers</span>
                        </div>
                        <div className="story__visual-ring" />
                    </div>
                </div>
            </section>

            {/* ── VALUES ────────────────────────────────────── */}
            <section className="section about-values" ref={valuesRef}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Our Values</span>
                        <h2 className="section-title">What Drives Us Every Day</h2>
                        <p className="section-subtitle">
                            Six core principles that guide every decision, feature, and
                            partnership at UnityDrop.
                        </p>
                    </div>
                    <div className="values-grid">
                        {values.map((v) => (
                            <div className="value-card" key={v.title}>
                                <div className="value-card__icon" style={{ background: v.gradient }}>
                                    <v.icon size={24} color="#fff" />
                                </div>
                                <h3 className="value-card__title">{v.title}</h3>
                                <p className="value-card__desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHAT WE DO ────────────────────────────────── */}
            <section className="section about-services" ref={servicesRef}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">What We Do</span>
                        <h2 className="section-title">Four Pillars of Impact</h2>
                        <p className="section-subtitle">
                            From organ donation to food redistribution — every avenue of giving, one
                            platform.
                        </p>
                    </div>
                    <div className="services-grid">
                        {services.map((s) => (
                            <div className="service-card" key={s.title}>
                                <div className="service-card__head">
                                    <div className="service-card__icon">
                                        <s.icon size={28} />
                                    </div>
                                    <span className="service-card__stat">{s.stat}</span>
                                </div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ──────────────────────────────────── */}
            <section className="section about-timeline" ref={timelineRef}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">Our Journey</span>
                        <h2 className="section-title">The UnityDrop Story</h2>
                    </div>
                    <div className="timeline">
                        <div className="timeline__line" />
                        {timeline.map((item, i) => (
                            <div className={`tl-item ${i % 2 === 0 ? 'tl-item--left' : 'tl-item--right'}`} key={item.year}>
                                <div className="tl-item__dot">
                                    <span>{item.year}</span>
                                </div>
                                <div className="tl-item__card">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────── */}
            <section className="section about-faq" ref={faqRef}>
                <div className="container">
                    <div className="text-center">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Got Questions?</h2>
                        <p className="section-subtitle">
                            Everything you need to know about UnityDrop and how it works.
                        </p>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} key={i}>
                                <button
                                    className="faq-item__question"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={20} className="faq-item__chevron" />
                                </button>
                                <div className="faq-item__answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────── */}
            <section className="about-cta" ref={ctaRef}>
                <div className="about-cta__bg" />
                <div className="container about-cta__inner">
                    <Sparkles size={32} className="about-cta__sparkle" />
                    <h2>Ready to Make a Difference?</h2>
                    <p>
                        Join thousands of donors, volunteers, and NGOs who are transforming
                        lives every single day through UnityDrop.
                    </p>
                    <div className="about-cta__actions">
                        <Link to="/donate" className="btn btn-primary btn-lg">
                            Start Donating <ArrowRight size={18} />
                        </Link>
                        <Link to="/register-donor" className="btn btn-outline btn-lg">
                            Register as Donor
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
