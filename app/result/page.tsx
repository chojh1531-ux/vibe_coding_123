"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Activity {
  time: string;
  title: string;
  description: string;
}

interface DayItem {
  day: string;
  date: string;
  activities: Activity[];
}

interface ItineraryData {
  summary: string;
  tips: string[];
  items: DayItem[];
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [data, setData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      const destination = searchParams.get('destination');
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      const companion = searchParams.get('companion');
      const jobType = searchParams.get('jobType');

      if (!destination || !startDate || !endDate || !companion || !jobType) {
        setError('필수값이 누락되었습니다. 홈에서 다시 입력해주세요.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, startDate, endDate, companion, jobType }),
        });

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || '알 수 없는 에러가 발생했습니다.');
        }
      } catch {
        setError('서버 연결 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
        <p className="text-gray-400 font-medium animate-pulse text-lg">AI가 영혼을 갈아 맞춤형 일정을 작성하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-red-500 font-bold text-xl mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10 mt-8">
      {/* Summary Section */}
      <section className="bg-white/10 p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-white"></div>
        <h1 className="text-2xl md:text-3xl font-bold leading-relaxed tracking-tight">
          {data?.summary}
        </h1>
      </section>

      {/* Tips Section */}
      {data?.tips && data.tips.length > 0 && (
        <section className="bg-black border border-white/20 p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            💡 맞춤 여행 팁
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300">
            {data.tips.map((tip: string, idx: number) => (
              <li key={idx} className="leading-relaxed pl-2">{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Itinerary Items */}
      <section className="flex flex-col gap-8 mt-4">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          🗺️ 상세 일정
        </h2>
        
        {data?.items?.map((dayItem, dayIdx) => (
          <div key={dayIdx} className="mb-6">
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="text-3xl font-bold text-white">{dayItem.day}</h3>
              <p className="text-white/50 font-medium text-lg">{dayItem.date}</p>
            </div>
            
            <div className="flex flex-col gap-4 pl-2 md:pl-4 border-l-2 border-white/20 ml-2">
              {dayItem.activities?.map((activity, actIdx) => (
                <div key={actIdx} className="relative flex flex-col md:flex-row gap-4 bg-black border border-white/10 p-6 rounded-2xl hover:bg-white/5 transition-all group ml-6">
                  {/* Timeline Dot */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-9 w-4 h-4 rounded-full bg-black border-2 border-white group-hover:bg-white transition-colors"></div>
                  
                  <div className="md:w-32 flex-shrink-0 text-white/50 font-medium text-lg pt-1">
                    {activity.time}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl mb-3">{activity.title}</span>
                    <span className="text-white/50 leading-relaxed">{activity.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <div className="w-full max-w-sm mx-auto mt-12 mb-8">
        <button
          onClick={() => router.push('/')}
          className="w-full px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          여행 일정 다시 만들기
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 pb-20 max-w-4xl mx-auto font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium animate-pulse">결과를 불러오는 중입니다...</p>
        </div>
      }>
        <ResultContent />
      </Suspense>
    </main>
  );
}
