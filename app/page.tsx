"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const destinations = [
  { id: 'fukuoka', name: '후쿠오카', emoji: '🍜', desc: '주말에 가볍게 다녀오기 좋은 식도락 여행' },
  { id: 'tokyo', name: '도쿄', emoji: '🗼', desc: '쇼핑과 화려한 도심 야경을 즐기는 여행' },
  { id: 'osaka', name: '오사카', emoji: '🏯', desc: '유니버설 스튜디오와 다채로운 길거리 음식' },
  { id: 'sapporo', name: '삿포로', emoji: '❄️', desc: '시원한 맥주와 함께 즐기는 힐링 휴양여행' },
  { id: 'taipei', name: '타이베이', emoji: '🧋', desc: '짧은 비행거리, 저렴하고 맛있는 미식 호캉스' },
  { id: 'bangkok', name: '방콕', emoji: '🐘', desc: '마사지와 팟타이를 즐기는 직장인 완벽 휴식' },
  { id: 'danang', name: '다낭', emoji: '🏖️', desc: '가성비 최고의 휴양지에서 즐기는 리조트 라이프' },
  { id: 'bali', name: '발리', emoji: '🏄‍♂️', desc: '에메랄드빛 바다와 함께 치유하는 워라밸 여행' },
];

const companions = [
  { id: 'solo', name: '혼자' },
  { id: 'couple', name: '연인과' },
  { id: 'friend', name: '친구와' },
  { id: 'family', name: '가족과' },
];

const jobTypes = [
  { id: 'developer', name: '개발자' },
  { id: 'designer', name: '디자이너' },
  { id: 'marketer', name: '마케터' },
  { id: 'manager', name: '기획/매니저' },
  { id: 'freelancer', name: '프리랜서' },
  { id: 'other', name: '기타 직군' },
];

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<string | null>(null);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [companion, setCompanion] = useState<string | null>(null);
  const [jobType, setJobType] = useState<string | null>(null);

  const handleNextStep = () => {
    if (destination) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (destination && startDate && endDate && companion && jobType) {
      const query = new URLSearchParams({
        destination,
        startDate,
        endDate,
        companion,
        jobType,
      }).toString();
      
      router.push(`/result?${query}`);
    }
  };

  const isStep2Complete = startDate && endDate && companion && jobType;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 pb-20 max-w-4xl mx-auto font-sans">
      {step === 1 && (
        <div className="w-full flex-1 flex flex-col pt-12">
          <div className="w-full mb-10 text-center">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">어디로 떠나고 싶으신가요?</h1>
            <p className="text-gray-400">바쁜 직장인들을 위한 맞춤형 여행지를 선택해보세요.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full mb-12">
            {destinations.map((dest) => {
              const isSelected = destination === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => setDestination(dest.id)}
                  className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected 
                      ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <span className="text-4xl mb-4">{dest.emoji}</span>
                  <h2 className="text-xl font-bold mb-2">{dest.name}</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{dest.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="w-full mt-auto max-w-sm mx-auto">
            <button
              onClick={handleNextStep}
              disabled={!destination}
              className={`w-full font-bold py-3 rounded-full transition-all duration-300 ${
                destination 
                  ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]' 
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              다음 단계로
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full flex-1 flex flex-col pt-12 max-w-2xl mx-auto">
          {/* Progress Badges */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            {destination && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20">
                📍 {destinations.find(d => d.id === destination)?.name}
              </span>
            )}
            {startDate && endDate && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20">
                🗓 {startDate} ~ {endDate}
              </span>
            )}
            {companion && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20">
                👤 {companions.find(c => c.id === companion)?.name}
              </span>
            )}
            {jobType && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 border border-white/20">
                💼 {jobTypes.find(j => j.id === jobType)?.name}
              </span>
            )}
          </div>

          <div className="w-full mb-10 text-center">
            <h1 className="text-3xl font-bold mb-4 tracking-tight">여행의 디테일을 알려주세요</h1>
            <p className="text-gray-400">당신의 직무와 여행 메이트에 딱 맞는 일정을 짜드릴게요.</p>
          </div>

          <div className="w-full flex flex-col gap-10 mb-12">
            {/* Date Input */}
            <section>
              <h2 className="text-lg font-bold mb-4">언제 떠나시나요?</h2>
              <div className="flex items-center gap-4">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="bg-black border border-white/20 rounded-xl px-4 py-3 w-full text-white focus:outline-none focus:border-white focus:bg-white/5 transition-all"
                />
                <span className="text-gray-400 font-bold">~</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="bg-black border border-white/20 rounded-xl px-4 py-3 w-full text-white focus:outline-none focus:border-white focus:bg-white/5 transition-all"
                />
              </div>
            </section>

            {/* Companion Input */}
            <section>
              <h2 className="text-lg font-bold mb-4">누구와 함께 가나요?</h2>
              <div className="flex flex-wrap gap-3">
                {companions.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setCompanion(comp.id)}
                    className={`px-5 py-2.5 rounded-full border transition-all duration-200 ${
                      companion === comp.id
                        ? 'border-white bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'border-white/20 text-gray-300 hover:border-white/50 hover:bg-white/5'
                    }`}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Job Input */}
            <section>
              <h2 className="text-lg font-bold mb-4">어떤 일을 하시나요? (직장인 맞춤 추천용)</h2>
              <div className="flex flex-wrap gap-3">
                {jobTypes.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setJobType(job.id)}
                    className={`px-5 py-2.5 rounded-full border transition-all duration-200 ${
                      jobType === job.id
                        ? 'border-white bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'border-white/20 text-gray-300 hover:border-white/50 hover:bg-white/5'
                    }`}
                  >
                    {job.name}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="w-full mt-auto flex gap-3">
            <button
              onClick={handlePrevStep}
              className="flex-1 max-w-[120px] font-bold py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all"
            >
              이전
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isStep2Complete}
              className={`flex-1 font-bold py-3 rounded-full transition-all duration-300 ${
                isStep2Complete 
                  ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]' 
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              결과 만들기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
