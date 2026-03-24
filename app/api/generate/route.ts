import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, startDate, endDate, companion, jobType } = body;

    if (!destination || !startDate || !endDate || !companion || !jobType) {
      return NextResponse.json(
        { error: '모든 필수값을 입력해주세요.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
당신은 최고의 맞춤 여행 일정 전문가입니다.
주어진 여행 정보를 바탕으로 타겟에 최적화된 맞춤 여행 일정을 계획해주세요.
타겟 사용자는 바쁜 일상을 보내는 '직장인'입니다.

## 여행 기본 정보
- 여행지 식별자: ${destination}
- 여행 일정: ${startDate} 부터 ${endDate} 까지
- 동행: ${companion}
- 사용자의 직업: ${jobType}

## 응답 JSON 포맷 요구사항
당신은 반드시 아래의 JSON 포맷 형식에 맞춰서 응답해야 합니다. 마크다운(\`\`\`) 없이 순수 JSON 텍스트만 출력하세요:

{
  "summary": "직장인과 동행자, 직업 특성을 모두 고려한 이번 여행에 대한 핵심 한 줄 소개",
  "tips": [
    "해당 직업(예: 개발자)이나 동행에 맞춘 실전 여행 팁 1",
    "실전 여행 팁 2",
    "실전 여행 팁 3"
  ],
  "items": [
    {
      "day": "1일차",
      "date": "해당 날짜 (예: 2024-05-01)",
      "activities": [
        {
          "time": "오전 10:00",
          "title": "공항 도착 및 호텔 이동",
          "description": "업무 스트레스를 풀 수 있는 여유로운 동선으로 상세히 설명"
        }
      ]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the JSON. Depending on Gemini's exact output, it might add markdown blocks despite instructions.
    const cleanJson = responseText.replace(/```json\n?|```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: unknown) {
    console.error('[Gemini API Error]', error);
    return NextResponse.json(
      { error: 'AI 맞춤 일정을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
