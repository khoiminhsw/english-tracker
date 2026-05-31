// src/Lesson.jsx
import React, { useState } from 'react';

export default function Lesson({ dayData, onComplete, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = () => {
    let currentScore = 0;
    dayData.exercises.forEach((ex, idx) => {
      // Chấm điểm không phân biệt hoa thường, loại bỏ khoảng trắng thừa
      const userAnswer = (answers[idx] || '').toString().trim().toLowerCase();
      const correctAnswer = ex.correct.toString().trim().toLowerCase();
      if (userAnswer === correctAnswer) currentScore++;
    });
    setScore(currentScore);
    setSubmitted(true);

    // Yêu cầu đúng tuyệt đối 25/25 hoặc 50/50
    if (currentScore === dayData.requiredScore) {
      onComplete(dayData.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">← Quay lại Lộ trình</button>
      
      <h2 className="text-2xl font-bold mb-4">
        {dayData.isTest ? `Bài Test Lớn (Ngày ${dayData.id})` : `Bài học Ngày ${dayData.id}`}
      </h2>

      {/* Chèn Video nếu là bài học */}
      {!dayData.isTest && dayData.videoUrl && (
        <div className="mb-8 aspect-video bg-gray-200">
          <iframe width="100%" height="100%" src={dayData.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      )}

      {/* Render Bài tập */}
      <div className="space-y-8">
        {dayData.exercises.map((ex, idx) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold mb-2">Câu {idx + 1}: {ex.type.toUpperCase()}</h3>
            
            {ex.type === 'reading' && <div className="p-3 bg-gray-100 rounded mb-3 italic">{ex.text}</div>}
            
            <p className="mb-3">{ex.question}</p>

            {/* Trắc nghiệm / Đọc hiểu (Có Options) */}
            {(ex.type === 'mcq' || ex.type === 'reading') && (
              <div className="space-y-2">
                {ex.options.map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input type="radio" name={`question-${idx}`} value={opt} onChange={(e) => handleAnswer(idx, e.target.value)} disabled={submitted && score === dayData.requiredScore}/>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Viết câu */}
            {ex.type === 'writing' && (
              <input type="text" className="w-full border p-2 rounded" placeholder="Nhập câu trả lời..." value={answers[idx] || ''} onChange={(e) => handleAnswer(idx, e.target.value)} disabled={submitted && score === dayData.requiredScore}/>
            )}
          </div>
        ))}
      </div>

      {/* Chấm điểm */}
      <div className="mt-8 sticky bottom-4 bg-white p-4 border rounded-lg shadow-lg flex justify-between items-center">
        <div>
          {submitted && (
            <p className={`font-bold ${score === dayData.requiredScore ? 'text-green-600' : 'text-red-500'}`}>
              Điểm của bạn: {score}/{dayData.requiredScore}
              {score !== dayData.requiredScore ? " (Bạn phải làm đúng toàn bộ để qua bài)" : " - Hoàn hảo!"}
            </p>
          )}
        </div>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
          Nộp bài & Kiểm tra
        </button>
      </div>
    </div>
  );
}