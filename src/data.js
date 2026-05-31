// src/data.js

// Template mẫu cho 1 bài tập trắc nghiệm ABCD
const sampleMCQ = { type: 'mcq', question: 'I ___ a software engineer.', options: ['am', 'is', 'are', 'be'], correct: 'am' };
// Template mẫu cho bài tập đọc (Reading)
const sampleReading = { type: 'reading', text: 'Alex is an engineer. He works at Google.', question: 'Where does Alex work?', options: ['Facebook', 'Google', 'Amazon', 'Apple'], correct: 'Google' };
// Template mẫu cho bài tập viết (Writing)
const sampleWriting = { type: 'writing', question: 'Dịch câu: "Tôi thích code"', correct: 'I like coding' };

export const generateCourseData = () => {
  const course = [];
  for (let i = 1; i <= 48; i++) {
    const isTest = i % 6 === 0;
    
    let dayData = {
      id: i,
      isTest: isTest,
      videoUrl: isTest ? null : "https://www.youtube.com/embed/v6eyfVYgNT8?si=fFMmrIFX7a4mJJit", // Nơi bạn chèn link YouTube (dạng embed)
      requiredScore: isTest ? 50 : 25,
      exercises: [] // Bạn sẽ push 25 hoặc 50 câu vào đây
    };

    // MẪU CHO NGÀY 1
    if (i === 1) {
      dayData.exercises = [
        sampleMCQ, sampleReading, sampleWriting,
        // ... Thêm đủ 22 câu nữa cho đủ 25
      ];
    }
    
    // MẪU CHO NGÀY 6 (TEST)
    if (i === 6) {
      dayData.exercises = [
        sampleMCQ, sampleMCQ, sampleWriting,
        // ... Thêm đủ 47 câu nữa cho đủ 50
      ];
    }

    course.push(dayData);
  }
  return course;
};

export const courseData = generateCourseData();