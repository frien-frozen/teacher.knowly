'use client';

import React from 'react';
import { useLangRouter } from '@/hooks/useLangRouter';
import { ArrowRight, BookOpen, Globe, Star, Award, Heart, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const CONTENT = {
  en: {
    hero: {
      badge: "The Future of Uzbekistan",
      title: "World knowledge",
      titleHighlight: "in your voice.",
      subtitle: "Join the movement to bring world-class education to every village, every city, and every student in our nation.",
      cta: "Become a Teacher",
      secondary: "Explore Directions"
    },
    curriculums: {
      title: "Academic Directions",
      desc: "We don't just teach subjects. We implement global standards.",
      cards: {
        secondary: { title: "Lower Secondary", desc: "Foundational Cambridge curriculum designed to build core skills." },
        igcse: { title: "Cambridge IGCSE", desc: "International standard curriculum for secondary education, recognized globally." },
        alevel: { title: "Cambridge A-Level", desc: "Advanced qualifications for global university preparation." },
        pearson: { title: "Pearson Edexcel", desc: "British curriculum focusing on practical application and critical thinking." },
      }
    },
    mission: {
      badge: "Our Purpose",
      title: "Our Primary Goal",
      desc: "To bridge the gap between talent and opportunity. We believe that a student in a remote village deserves the same quality of education as a student in the capital.",
      points: ["Equal Opportunity", "Digital Innovation", "Future Readiness"],
      quote: "\"Education — for everyone\""
    },
    community: {
      title: "The Knowledge Ambassadors",
      desc: "Knowly is driven by passionate volunteer mentors. We are a network of dedicated individuals collaborating to build the best digital school for our nation.",
    }
  },
  uz: {
    hero: {
      badge: "O'zbekiston Kelajagi",
      title: "Dunyo bilimlari",
      titleHighlight: "sizning ovozingizda.",
      subtitle: "Mamlakatimizning har bir hududidagi o'quvchilarga jahon darajasidagi ta'limni yetkazish harakatiga qo'shiling.",
      cta: "Safimizga Qo'shiling",
      secondary: "Yo'nalishlarni Ko'rish"
    },
    curriculums: {
      title: "Akademik Yo'nalishlar",
      desc: "Biz shunchaki dars o'tmaymiz, xalqaro standartlarni joriy qilamiz.",
      cards: {
        secondary: { title: "Lower Secondary", desc: "O'quvchilarda poydevor va asosiy ko'nikmalarni shakllantiruvchi Cambridge dasturi." },
        igcse: { title: "Cambridge IGCSE", desc: "O'rta ta'lim uchun butun dunyoda tan olingan xalqaro standart." },
        alevel: { title: "Cambridge A-Level", desc: "Xalqaro universitetlarga kirish uchun yuqori malaka va chuqur bilim." },
        pearson: { title: "Pearson Edexcel", desc: "Amaliyot va tanqidiy fikrlashga asoslangan nufuzli Britaniya dasturi." },
      }
    },
    mission: {
      badge: "Maqsadimiz",
      title: "Asosiy Maqsadimiz",
      desc: "Iste'dod va imkoniyat o'rtasidagi to'siqlarni olib tashlash. Chekka hududdagi o'quvchi ham poytaxtdagi kabi eng yaxshi ta'limga haqli deb hisoblaymiz.",
      points: ["Teng Imkoniyat", "Raqamli Innovatsiya", "Kelajakka Tayyorlik"],
      quote: "\"Ta'lim — barcha uchun\""
    },
    community: {
      title: "Fidoyi Ustozlar",
      desc: "Knowly — bu ta'lim kelajagiga befarq bo'lmagan ko'ngilli ustozlar tarmog'i. Biz yurtimizdagi eng ilg'or raqamli maktabni qurish uchun birlashganmiz.",
    }
  }
};

// Real teacher data with actual photos
const TEACHERS = [
  { name: "Daniel J. Potot", subject: "Math", img: "/teachers/1.jpg" },
  { name: "Diyorbek Sunatullayev", subject: "Biology", img: "/teachers/2.jpg" },
  { name: "Ismatulloh Bakhtiyorov", subject: "Computer Science", img: "/teachers/3.jpg" },
  { name: "Yulduz Juliboyeva", subject: "Chemistry", img: "/teachers/4.jpg" },
];

export default function TeacherLanding() {
  const { lang, push } = useLangRouter();
  const t = CONTENT[lang as 'en' | 'uz'] || CONTENT.uz;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] font-nunito pt-52 pb-0 overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 max-w-6xl mb-20 relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-extrabold uppercase tracking-widest mb-8">
            <Globe className="w-4 h-4" /> {t.hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#101828] mb-6 tracking-tight leading-[1.1]">
            {t.hero.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D92D20] to-[#FDB022]">{t.hero.titleHighlight}</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => push('/apply')} className="flex items-center gap-2 bg-[#101828] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-all">
              {t.hero.cta} <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => scrollTo('curriculums')} className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm">
              <BookOpen className="w-5 h-5" />
              {t.hero.secondary}
            </button>
          </div>
        </motion.div>
      </section>

      {/* CURRICULUMS */}
      <section id="curriculums" className="bg-white py-24 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#101828] mb-4">{t.curriculums.title}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.curriculums.desc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href={`https://learn.knowly.uz/curriculum/lower-secondary?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-gray-100 hover:border-green-100 hover:shadow-xl hover:shadow-green-50 transition-all group block">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform"><BookOpen className="w-7 h-7" /></div>
              <h3 className="text-xl font-extrabold text-[#101828] mb-3">{t.curriculums.cards.secondary.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{t.curriculums.cards.secondary.desc}</p>
            </a>
            <a href={`https://learn.knowly.uz/curriculum/igcse?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-gray-100 hover:border-red-100 hover:shadow-xl hover:shadow-red-50 transition-all group block">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-[#D92D20] mb-6 group-hover:scale-110 transition-transform"><Award className="w-7 h-7" /></div>
              <h3 className="text-xl font-extrabold text-[#101828] mb-3">{t.curriculums.cards.igcse.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{t.curriculums.cards.igcse.desc}</p>
            </a>
            <a href={`https://learn.knowly.uz/curriculum/a-levels?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all group block">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><Trophy className="w-7 h-7" /></div>
              <h3 className="text-xl font-extrabold text-[#101828] mb-3">{t.curriculums.cards.alevel.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{t.curriculums.cards.alevel.desc}</p>
            </a>
            <a href={`https://learn.knowly.uz/curriculum/pearson?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-gray-100 hover:border-yellow-100 hover:shadow-xl hover:shadow-yellow-50 transition-all group block">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-[#B54708] mb-6 group-hover:scale-110 transition-transform"><Star className="w-7 h-7" /></div>
              <h3 className="text-xl font-extrabold text-[#101828] mb-3">{t.curriculums.cards.pearson.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{t.curriculums.cards.pearson.desc}</p>
            </a>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section id="mission" className="container mx-auto px-6 max-w-6xl py-32">
        <div className="bg-[#101828] rounded-[3rem] p-10 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D92D20] rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/10 text-xs font-extrabold uppercase tracking-widest mb-6">
                <Heart className="w-4 h-4 text-[#D92D20]" /> {t.mission.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{t.mission.title}</h2>
              <p className="text-gray-400 text-xl mb-8 leading-relaxed font-medium">{t.mission.desc}</p>
              <div className="flex flex-wrap gap-4">
                {t.mission.points.map((p, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm">{p}</span>
                ))}
              </div>
            </div>
            <div className="h-80 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden">
              <Globe className="w-40 h-40 text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101828] to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white font-bold text-lg">{t.mission.quote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHERS COMMUNITY */}
      <section id="teachers" className="container mx-auto px-6 max-w-6xl mb-24 text-center">
        <h2 className="text-4xl font-extrabold text-[#101828] mb-6">{t.community.title}</h2>
        <p className="text-gray-500 text-lg max-w-3xl mx-auto mb-16">{t.community.desc}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {TEACHERS.map((teacher, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group">
              <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                <img src={teacher.img} alt={teacher.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#101828] text-sm">{teacher.name}</h4>
                <p className="text-xs font-bold text-[#D92D20] uppercase tracking-wider">{teacher.subject}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <button onClick={() => push('/apply')} className="bg-[#FDB022] text-[#7B2D08] px-10 py-4 rounded-2xl font-extrabold text-lg shadow-lg hover:shadow-xl transition-all border-b-4 border-[#B54708] active:border-b-0 active:translate-y-1">
            {t.hero.cta}
          </button>
        </div>
      </section>
    </main>
  );
}
