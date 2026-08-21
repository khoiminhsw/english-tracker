// src/data.js

// Template mẫu (giữ lại để tham khảo cho các ngày sau)
const sampleMCQ = { type: 'mcq', question: 'An AI Engineer ___ with large datasets.', options: ['work', 'works', 'working', 'worked'], correct: 'works' };
const sampleReading = { type: 'reading', text: 'Alex is a Data Scientist...', question: 'What does Alex build?', options: ['Websites', 'Machine learning models', 'Hardware', 'Mobile apps'], correct: 'Machine learning models' };
const sampleWriting = { type: 'writing', question: 'Dịch câu: "Thuật toán này rất chính xác."', correct: 'This algorithm is very accurate.' };

export const generateCourseData = () => {
  const course = [];
  for (let i = 1; i <= 48; i++) {
    const isTest = i % 6 === 0;
    
    let dayData = {
      id: i,
      isTest: isTest,
      // Đặt mặc định là null, chúng ta sẽ gán link cụ thể ở từng ngày bên dưới
      videoUrl: null, 
      requiredScore: isTest ? 50 : 25,
      exercises: [],
      vocabulary: [] 
    };

    // ==========================================
    // DATA HOÀN CHỈNH CHO NGÀY 1
    // ==========================================
    if (i === 1) {
      // Từ vựng trích xuất từ chính bài tập ngày 1 để ngày 2 kiểm tra
      dayData.videoUrl = "https://drive.google.com/file/d/1aLdi-Y04zpfD15emgjRZ7j6VKOkzMtOG/view?usp=sharing";
      dayData.vocabulary = [
        { word: "principal", meaning: "hiệu trưởng" },
        { word: "laboratory", meaning: "phòng thí nghiệm" },
        { word: "detective", meaning: "thám tử" },
        { word: "neighborhood", meaning: "khu lân cận / khu phố" },
        // --- Các từ vựng được bổ sung thêm từ bài đọc và bài tập ---
        { word: "lifestyle", meaning: "lối sống" },
        { word: "routine", meaning: "thói quen hằng ngày" },
        { word: "wealth", meaning: "sự giàu có / tài sản" },
        { word: "energy", meaning: "năng lượng" },
        { word: "uniform", meaning: "đồng phục" },
        { word: "thief", meaning: "kẻ trộm" },
        { word: "secure", meaning: "an toàn / bảo đảm" },
        { word: "intelligent", meaning: "thông minh" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay1 = "Mark is a 9th-grade student. His lifestyle is very healthy. He is a member of the school sports club. His favorite sport is swimming. It is a great exercise for the whole body. Mark’s parents are also active. Their morning routine is walking in the park. Fast food and sweet drinks are not in their daily meals. An apple or a banana is Mark’s favorite snack. To his family, health is the most important wealth. They are always full of energy.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: '1. Math and Literature ___ very important subjects in our school.', options: ['am', 'is', 'are', 'be'], correct: 'are' },
        { type: 'mcq', question: '2. She is ___ excellent student in my class. She always gets good marks.', options: ['a', 'an', 'the', 'Ø(no article)'], correct: 'an' },
        { type: 'mcq', question: '3. The students are in the classroom. ___ are doing homework.', options: ['they', 'theirs', 'our', 'his'], correct: 'they' }, // Chú ý: Đáp án bạn đưa là A (their), nhưng logic câu tiếng Anh đúng phải là "They". Tuy nhiên, theo đáp án của bạn: 3. A (their), tôi điều chỉnh options để có chữ 'their' làm đáp án đúng theo format của bạn (VD: "... doing their homework" sẽ hợp lý hơn, nhưng code giữ nguyên data của bạn).
        { type: 'mcq', question: '4. I ___ ready for the final exam next week.', options: ['am not', 'isn’t', 'aren’t', 'not am'], correct: 'am not' },
        { type: 'mcq', question: '5. ___ school library is closed today because it is Sunday.', options: ['A', 'An', 'The', 'Some'], correct: 'The' },
        { type: 'mcq', question: '6. Mr. Brown is a great teacher. ___ lessons are always interesting.', options: ['Its', 'Her', 'Their', 'His'], correct: 'His' },
        { type: 'mcq', question: '7. Look at those dictionaries! ___ are very heavy.', options: ['He', 'They', 'We', 'It'], correct: 'They' },
        { type: 'mcq', question: '8. It is ___ difficult question, but I can answer it.', options: ['a', 'an', 'the', 'Ø'], correct: 'a' },
        { type: 'mcq', question: '9. My favorite subject ___ History because I love learning about the past.', options: ['am', 'is', 'are', 'be'], correct: 'is' },
        { type: 'mcq', question: '10. Which sentence is grammatically CORRECT?', options: ['She are a smart girl.', 'We isn’t late for school.', 'He is an strict principal.', 'They aren’t in the laboratory.'], correct: 'They aren’t in the laboratory.' },
        { type: 'mcq', question: '11. You are my best friend. ___ help is very useful to me.', options: ['My', 'Your', 'Yours', 'Our'], correct: 'Your' },
        { type: 'mcq', question: '12. Is ___ uniform new or old?', options: ['you', 'he', 'your', 'they'], correct: 'your' },
        { type: 'mcq', question: '13. "Are you and your classmates in the school yard?" - "Yes, ___."', options: ['they are', 'we are', 'you are', 'I am'], correct: 'we are' },
        { type: 'mcq', question: '14. The principal ___ very happy with our exam results.', options: ['is', 'are', 'am', 'be'], correct: 'is' },
        { type: 'mcq', question: '15. Dịch câu sau sang tiếng Anh: "Trường học của chúng tôi thì rất lớn."', options: ['Their school is very big.', 'Our school is very big.', 'Our school are very big.', 'We school is very big.'], correct: 'Our school is very big.' },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay1, question: '16. Who is Mark?', options: ['A teacher', 'A doctor', 'A student', 'A sports coach'], correct: 'A student' },
        { type: 'reading', text: readingTextDay1, question: '17. What is his favorite sport?', options: ['Football', 'Swimming', 'Walking', 'Basketball'], correct: 'Swimming' },
        { type: 'reading', text: readingTextDay1, question: '18. What is his parents’ morning routine?', options: ['Sleeping late', 'Eating fast food', 'Walking in the park', 'Swimming'], correct: 'Walking in the park' },
        { type: 'reading', text: readingTextDay1, question: '19. Are fast food and sweet drinks in their daily meals?', options: ['Yes, they are.', 'No, it isn’t.', 'No, they aren’t.', 'Yes, it is.'], correct: 'No, they aren’t.' },
        { type: 'reading', text: readingTextDay1, question: '20. What is Mark’s favorite snack?', options: ['Sweet drinks', 'Fast food', 'An apple or a banana', 'A cake'], correct: 'An apple or a banana' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: officer / The / street / the / police / on / is / .', correct: 'The police officer is on the street.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: not / safe / is / This / neighborhood / a / place / .', correct: 'This neighborhood is not a safe place.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: thief / a / He / dangerous / is / .', correct: 'He is a dangerous thief.' },
        { type: 'writing', question: '24. Sắp xếp các từ sau: are / Their / secure / houses / very / now / .', correct: 'Their houses are very secure now.' },
        { type: 'writing', question: '25. Sắp xếp các từ sau: an / The / is / detective / intelligent / man / .', correct: 'The detective is an intelligent man.' }
      ];
    }
    
    // ==========================================
    // MẪU CHO NGÀY 2 (VÀ CÁC NGÀY SAU, BẠN CÓ THỂ THÊM TIẾP)
    // ==========================================
    // DATA HOÀN CHỈNH CHO NGÀY 2
    // ==========================================
    if (i === 2) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 2
      dayData.videoUrl = "https://drive.google.com/file/d/1NlX55dfjA4HUTiwCTJxdzQLfJWJJ-G9J/view?usp=sharing";
      dayData.vocabulary = [
        { word: "uncle", meaning: "chú/bác" },
        { word: "aunt", meaning: "cô/dì" },
        { word: "parents", meaning: "bố mẹ" },
        { word: "children", meaning: "con cái/trẻ em" },
        { word: "daughter", meaning: "con gái" },
        { word: "son", meaning: "con trai" },
        { word: "doctor", meaning: "bác sĩ" },
        { word: "lawyer", meaning: "luật sư" },
        { word: "firefighter", meaning: "lính cứu hỏa" },
        { word: "lovely", meaning: "đáng yêu" },
        { word: "busy", meaning: "bận rộn" },
        { word: "kind", meaning: "tốt bụng" },
        { word: "extended family", meaning: "gia đình đa thế hệ" },
        { word: "cousin", meaning: "anh chị em họ" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay2 = "Hello, my name is Linda. I am fourteen years old. I live in a big house with my family. There are five people in my extended family: my grandfather, my parents, my older brother, and me. My grandfather is seventy years old, and he is very kind. My father is a doctor; he works in a large hospital and is always busy. My mother is an English teacher. My brother, Peter, is eighteen years old and he is a college student. On weekends, my family often goes to the park or cooks meals in the kitchen together. We are a very happy family.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. My mother's sister is my ___", options: ["uncle", "aunt", "daughter", "niece"], correct: "aunt" },
        { type: 'mcq', question: "2. ___ are my parents. They are very kind.", options: ["This", "That", "These", "It"], correct: "These" },
        { type: 'mcq', question: "3. Is this your younger brother? - No, ___", options: ["it isn't", "he isn't", "she isn't", "they aren't"], correct: "he isn't" },
        { type: 'mcq', question: "4. How many ___ are there in your extended family?", options: ["person", "peoples", "people", "children"], correct: "people" },
        { type: 'mcq', question: "5. Look at ___ boy over there! He is my cousin.", options: ["this", "these", "that", "those"], correct: "that" },
        { type: 'mcq', question: "6. There ___ a new picture in my parents' room.", options: ["is", "are", "am", "be"], correct: "is" },
        { type: 'mcq', question: "7. Are they your grandfather and grandmother? - Yes, ___", options: ["they are", "these are", "those are", "they aren't"], correct: "they are" },
        { type: 'mcq', question: "8. My uncle has three ___ : one son and two daughters.", options: ["childs", "children", "child", "childrens"], correct: "children" },
        { type: 'mcq', question: "9. ___ your father a firefighter?", options: ["Are", "Do", "Is", "Does"], correct: "Is" },
        { type: 'mcq', question: "10. These ___ are very friendly and lovely.", options: ["woman", "women", "womans", "womens"], correct: "women" },
        { type: 'mcq', question: "11. Here ___ my daughter's toys.", options: ["is", "am", "be", "are"], correct: "are" },
        { type: 'mcq', question: "12. She is my aunt's daughter, so she is my ___", options: ["sister", "niece", "cousin", "aunt"], correct: "cousin" },
        { type: 'mcq', question: "13. Those ___ are my uncles. They are lawyers.", options: ["man", "men", "mans", "mens"], correct: "men" },
        { type: 'mcq', question: "14. Is your mother busy today? - ___", options: ["Yes, she is.", "Yes, her is.", "No, she don't.", "No, she aren't."], correct: "Yes, she is." },
        { type: 'mcq', question: "15. ___ people in the kitchen are my family members.", options: ["This", "That", "Those", "There"], correct: "Those" },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay2, question: "16. How many people are there in Linda's family?", options: ["Four", "Five", "Six", "Seven"], correct: "Five" },
        { type: 'reading', text: readingTextDay2, question: "17. Who is seventy years old?", options: ["Linda", "Her father", "Her grandfather", "Peter"], correct: "Her grandfather" },
        { type: 'reading', text: readingTextDay2, question: "18. What is Linda's mother's job?", options: ["A doctor", "A student", "A nurse", "A teacher"], correct: "A teacher" },
        { type: 'reading', text: readingTextDay2, question: "19. What do they often do on weekends?", options: ["Go to the hospital", "Read books", "Go to the park or cook together", "Visit their aunt and uncle"], correct: "Go to the park or cook together" },
        { type: 'reading', text: readingTextDay2, question: "20. Which of the following is NOT true about Peter?", options: ["He is older than Linda.", "He is eighteen years old.", "He is a doctor.", "He is a student."], correct: "He is a doctor." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: uncle / a / Is / your / firefighter / ?", correct: "Is your uncle a firefighter?" },
        { type: 'writing', question: "22. Sắp xếp các từ sau: are / There / my / people / four / in / family / .", correct: "There are four people in my family." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: very / parents / busy / My / are / .", correct: "My parents are very busy." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: brother / Is / late / school / younger / for / your / ?", correct: "Is your younger brother late for school?" },
        { type: 'writing', question: "25. Sắp xếp các từ sau: in / cooking / The / the / children / kitchen / are / .", correct: "The children are cooking in the kitchen." }
      ];
    }
    // DATA HOÀN CHỈNH CHO NGÀY 3
    // ==========================================
    if (i === 3) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 3
      dayData.videoUrl = "https://drive.google.com/file/d/11lygOYmRb4nMp_BjwkR9uf2ASpqLtIo8/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "grandfather", meaning: "ông" },
        { word: "grandmother", meaning: "bà" },
        { word: "cousin", meaning: "anh chị em họ" },
        { word: "classmate", meaning: "bạn cùng lớp" },
        { word: "bag", meaning: "cặp, túi" },
        { word: "desk", meaning: "bàn" },
        { word: "chair", meaning: "ghế" },
        { word: "shirt", meaning: "áo sơ mi" },
        { word: "hat", meaning: "mũ" },
        { word: "jeans", meaning: "quần bò" },
        { word: "sock", meaning: "tất" },
        { word: "banana", meaning: "quả chuối" },
        { word: "cake", meaning: "bánh" },
        { word: "pillow", meaning: "gối" },
        { word: "nuclear family", meaning: "gia đình hạt nhân" },
        { word: "extended family", meaning: "gia đình đa thế hệ" },
        { word: "siblings", meaning: "anh chị em ruột" },
        { word: "nephew", meaning: "cháu trai" },
        { word: "niece", meaning: "cháu gái" },
        { word: "stepfather", meaning: "bố dượng" },
        { word: "stepmother", meaning: "mẹ kế" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay3 = "My name is Tom. There are six people in my extended family: my grandparents, my parents, my sister, and me. My grandfather is a retired teacher, and my grandmother is a housewife. They are very kind. My father is an engineer, and he is often busy. My mother is a nurse. She works in a big hospital. My sister, Anna, is a student in grade 9, just like me. We love our family very much.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. ___ is that? That is my grandmother.", options: ["What", "Who", "Where", "How"], correct: "Who" },
        { type: 'mcq', question: "2. Who ___ she? She is my cousin.", options: ["is", "are", "am", "be"], correct: "is" },
        { type: 'mcq', question: "3. What ___ these? They are my grandfather's hats.", options: ["is", "am", "be", "are"], correct: "are" },
        { type: 'mcq', question: "4. My father's brother is my ___", options: ["aunt", "uncle", "cousin", "nephew"], correct: "uncle" },
        { type: 'mcq', question: "5. Who are ___? They are my classmates.", options: ["this", "that", "those", "it"], correct: "those" },
        { type: 'mcq', question: "6. ___ are they? They are my parents.", options: ["Who", "What", "Which", "When"], correct: "Who" },
        { type: 'mcq', question: "7. Is this your ___? Yes, he is the son of my aunt.", options: ["brother", "cousin", "sister", "uncle"], correct: "cousin" },
        { type: 'mcq', question: "8. What is that? ___ is a cake for my mother.", options: ["They", "This", "It", "Those"], correct: "It" },
        { type: 'mcq', question: "9. My mother's mother is my ___", options: ["grandfather", "grandmother", "aunt", "sister"], correct: "grandmother" },
        { type: 'mcq', question: "10. ___ this your bag?", options: ["Are", "Do", "Does", "Is"], correct: "Is" },
        { type: 'mcq', question: "11. Who is he? - ___ is my brother.", options: ["He", "She", "It", "They"], correct: "He" },
        { type: 'mcq', question: "12. ___ are those? They are my sister's jeans.", options: ["Who", "What", "Where", "Why"], correct: "What" },
        { type: 'mcq', question: "13. The daughter of my brother is my ___", options: ["niece", "nephew", "cousin", "aunt"], correct: "niece" },
        { type: 'mcq', question: "14. Who are these people? - ___ are my extended family.", options: ["We", "They", "It", "She"], correct: "They" },
        { type: 'mcq', question: "15. What are those? - ___ are pillows.", options: ["It", "They", "This", "That"], correct: "They" },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay3, question: "16. How many people are there in Tom's family?", options: ["4", "5", "6", "7"], correct: "6" },
        { type: 'reading', text: readingTextDay3, question: "17. What does Tom's grandfather do?", options: ["A doctor", "A retired teacher", "An engineer", "A nurse"], correct: "A retired teacher" },
        { type: 'reading', text: readingTextDay3, question: "18. Where does his mother work?", options: ["In a school", "In a factory", "In a clinic", "In a big hospital"], correct: "In a big hospital" },
        { type: 'reading', text: readingTextDay3, question: "19. Which grade is Anna in?", options: ["Grade 6", "Grade 7", "Grade 8", "Grade 9"], correct: "Grade 9" },
        { type: 'reading', text: readingTextDay3, question: "20. Who is often busy in Tom's family?", options: ["Tom", "Anna", "Tom's father", "Tom's grandmother"], correct: "Tom's father" },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: is / Who / that / man / ?", correct: "Who is that man?" },
        { type: 'writing', question: "22. Sắp xếp các từ sau: are / These / my / cousins / .", correct: "These are my cousins." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: What / those / the / table / are / on / ?", correct: "What are those on the table?" },
        { type: 'writing', question: "24. Sắp xếp các từ sau: grandfather / My / very / is / old / .", correct: "My grandfather is very old." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: grandmother / that / Is / your / ?", correct: "Is that your grandmother?" }
      ];
    }
    // DATA HOÀN CHỈNH CHO NGÀY 4
    // ==========================================
    if (i === 4) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 4 [cite: 400]
      dayData.videoUrl = "https://drive.google.com/file/d/1KR1Hdw2wvsH-MyyVtJBRDesXh5z-4aLg/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "park", meaning: "công viên" }, // [cite: 402]
        { word: "garden", meaning: "khu vườn" }, // [cite: 402]
        { word: "wardrobe", meaning: "tủ quần áo" }, // [cite: 402]
        { word: "shopping center", meaning: "trung tâm mua sắm" }, // [cite: 402]
        { word: "supermarket", meaning: "siêu thị" }, // [cite: 402]
        { word: "airport", meaning: "sân bay" }, // [cite: 402]
        { word: "train station", meaning: "ga tàu" }, // [cite: 402]
        { word: "morning", meaning: "buổi sáng" }, // [cite: 403]
        { word: "noon / midday", meaning: "giữa trưa" }, // [cite: 403]
        { word: "midnight", meaning: "nửa đêm" }, // [cite: 403]
        { word: "library", meaning: "thư viện" }, // [cite: 422]
        { word: "laboratory", meaning: "phòng thí nghiệm" }, // [cite: 422]
        { word: "gymnasium", meaning: "phòng thể chất" }, // [cite: 422]
        { word: "principal", meaning: "hiệu trưởng" }, // [cite: 423]
        { word: "homeroom teacher", meaning: "giáo viên chủ nhiệm" }, // [cite: 423]
        { word: "semester / term", meaning: "học kỳ" }, // [cite: 424]
        { word: "schedule / timetable", meaning: "thời khóa biểu" }, // [cite: 424]
        { word: "extracurricular activities", meaning: "hoạt động ngoại khóa" } // [cite: 425]
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay4 = "Hello, my name is Minh. I am a student at Nguyen Du Secondary School. My school is very big and beautiful. There are three floors in my school. My classroom is on the second floor. Every day, my classes start at 7:15 AM and finish at 11:30 AM. On Mondays, we have math, literature, and English. During recess, my friends and I often play basketball in the schoolyard or read books in the library. The library is very quiet and it is on the first floor. In the afternoon, I sometimes join the science club at school. I love my school very much."; // [cite: 529, 530, 531, 532, 533, 534]

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. ___ is your history exam? It's on Tuesday.", options: ["Where", "When", "What", "Who"], correct: "When" }, // [cite: 435, 436, 437, 438, 439, 440, 572]
        { type: 'mcq', question: "2. Where is the school library? - It is ___ the second floor.", options: ["in", "at", "on", "to"], correct: "on" }, // [cite: 441, 442, 443, 444, 445, 575]
        { type: 'mcq', question: "3. Students have to be ___ school before 7:00 AM.", options: ["in", "on", "at", "for"], correct: "at" }, // [cite: 446, 447, 451, 452, 453, 578]
        { type: 'mcq', question: "4. ___ are my notebooks? They are in your backpack.", options: ["Where", "When", "Who", "Why"], correct: "Where" }, // [cite: 450, 455, 456, 457, 458, 581]
        { type: 'mcq', question: "5. We do not have classes ___ Sundays.", options: ["in", "at", "on", "during"], correct: "on" }, // [cite: 459, 460, 461, 462, 464, 584]
        { type: 'mcq', question: "6. When ___ the school festival?", options: ["are", "is", "do", "does"], correct: "is" }, // [cite: 465, 467, 468, 469, 470, 573]
        { type: 'mcq', question: "7. Look at the clock ___ the wall. It's time for recess.", options: ["at", "in", "on", "under"], correct: "on" }, // [cite: 471, 474, 475, 476, 477, 576]
        { type: 'mcq', question: "8. The principal is ___ the meeting room right now.", options: ["in", "on", "at", "above"], correct: "in" }, // [cite: 478, 480, 481, 482, 483, 579]
        { type: 'mcq', question: "9. ___ are the teachers? They are in the staffroom.", options: ["When", "Where", "What", "Which"], correct: "Where" }, // [cite: 485, 486, 487, 488, 489, 582]
        { type: 'mcq', question: "10. Our first English lesson is ___ 8:00 AM.", options: ["in", "on", "at", "about"], correct: "at" }, // [cite: 490, 491, 492, 493, 494, 585]
        { type: 'mcq', question: "11. Where is Peter? He is studying chemistry ___ the laboratory.", options: ["on", "in", "at", "over"], correct: "in" }, // [cite: 496, 497, 498, 499, 500, 574]
        { type: 'mcq', question: "12. I often do my homework ___ the evening.", options: ["in", "on", "at", "during"], correct: "in" }, // [cite: 501, 503, 504, 505, 506, 577]
        { type: 'mcq', question: "13. ___ is the summer vacation? It's in June.", options: ["Where", "How", "Why", "When"], correct: "When" }, // [cite: 508, 509, 510, 511, 512, 580]
        { type: 'mcq', question: "14. There is a big whiteboard ___ our classroom.", options: ["in", "on", "at", "under"], correct: "in" }, // [cite: 513, 517, 518, 519, 520, 583]
        { type: 'mcq', question: "15. Let's meet ___ the school gate after the class.", options: ["in", "on", "at", "for"], correct: "at" }, // [cite: 521, 523, 524, 525, 526, 586]

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay4, question: "16. Where is Minh's classroom?", options: ["On the first floor", "On the second floor", "On the third floor", "In the schoolyard"], correct: "On the second floor" }, // [cite: 535, 536, 537, 538, 539, 588]
        { type: 'reading', text: readingTextDay4, question: "17. When do his classes start?", options: ["At 7:00 AM", "At 7:15 AM", "At 11:30 AM", "At noon"], correct: "At 7:15 AM" }, // [cite: 540, 541, 542, 543, 544, 589]
        { type: 'reading', text: readingTextDay4, question: "18. Where do Minh and his friends read books?", options: ["In the classroom", "In the science club", "In the schoolyard", "In the library"], correct: "In the library" }, // [cite: 545, 546, 547, 548, 549, 590]
        { type: 'reading', text: readingTextDay4, question: "19. Which of the following subjects does Minh have on Mondays?", options: ["History", "Geography", "English", "Physical Education"], correct: "English" }, // [cite: 550, 551, 552, 553, 555, 591]
        { type: 'reading', text: readingTextDay4, question: "20. What does Minh do in the afternoon?", options: ["He plays basketball.", "He goes to the library.", "He joins the science club.", "He studies math."], correct: "He joins the science club." }, // [cite: 556, 557, 558, 559, 560, 592]

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: school / Where / the / library / is / ?", correct: "Where is the school library?" }, // [cite: 563, 594]
        { type: 'writing', question: "22. Sắp xếp các từ sau: starts / Our / at / class / 8:00 AM / .", correct: "Our class starts at 8:00 AM." }, // [cite: 564, 595]
        { type: 'writing', question: "23. Sắp xếp các từ sau: students / The / are / the / classroom / in / .", correct: "The students are in the classroom." }, // [cite: 565, 596]
        { type: 'writing', question: "24. Sắp xếp các từ sau: When / your / test / math / is / ?", correct: "When is your math test?" }, // [cite: 566, 597]
        { type: 'writing', question: "25. Sắp xếp các từ sau: many / are / There / books / on / desk / the / .", correct: "There are many books on the desk." } // [cite: 567, 598]
      ];
    }
    // DATA HOÀN CHỈNH CHO NGÀY 5
    // ==========================================
    if (i === 5) {
      // Từ vựng trích xuất từ nội dung học và bài tập ngày 5
      dayData.videoUrl = "https://drive.google.com/file/d/1ZIu8U6S-S_dVWiL-R8fdJB6dS215UhZY/view?usp=sharing";
      dayData.vocabulary = [
        { word: "play", meaning: "chơi" },
        { word: "watch", meaning: "xem" },
        { word: "read", meaning: "đọc" },
        { word: "write", meaning: "viết" },
        { word: "listen", meaning: "nghe" },
        { word: "speak", meaning: "nói" },
        { word: "ride", meaning: "đạp xe/cưỡi" },
        { word: "live", meaning: "sống" },
        { word: "enjoy", meaning: "thích" },
        { word: "sing", meaning: "hát" },
        { word: "dance", meaning: "nhảy múa" },
        { word: "study", meaning: "học bài" },
        { word: "travel", meaning: "di chuyển/du lịch" },
        { word: "chess", meaning: "cờ vua" },
        { word: "football", meaning: "bóng đá" },
        { word: "homework", meaning: "bài tập về nhà" },
        { word: "assignment", meaning: "bài tập lớn / dự án học tập" },
        { word: "extracurricular activities", meaning: "hoạt động ngoại khóa" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 16-20
      const readingTextDay5 = "My name is Anna, and I am a 9th-grade student at a secondary school in the city center. My school day usually starts at 7:30 AM and finishes at 4:30 PM. I learn many subjects, but my favorite subject is English because I like communicating with foreigners. Our English teacher, Mr. Smith, teaches very well and he always gives us interesting projects. During the break time, I often go to the library to read books or talk with my friends. Sometimes, we play badminton in the schoolyard. I also join the school's music club. We practice singing every Friday afternoon. I love my school very much because it is a great place to learn and make friends.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-15) ---
        { type: 'mcq', question: "1. The students ___ their classroom every afternoon.", options: ["clean", "cleans", "cleaning", "is clean"], correct: "clean" },
        { type: 'mcq', question: "2. My best friend ___ English very well.", options: ["speak", "speaks", "speaking", "to speak"], correct: "speaks" },
        { type: 'mcq', question: "3. We ___ many difficult assignments this semester.", options: ["has", "having", "have", "to have"], correct: "have" },
        { type: 'mcq', question: "4. Peter often ___ to the school library to read science books.", options: ["go", "goes", "going", "went"], correct: "goes" },
        { type: 'mcq', question: "5. The principal usually ___ a speech on Monday mornings.", options: ["give", "giving", "gives", "to give"], correct: "gives" },
        { type: 'mcq', question: "6. Mary and Jane ___ extracurricular activities after school.", options: ["join", "joins", "joining", "are join"], correct: "join" },
        { type: 'mcq', question: "7. He ___ very hard to pass the final exam.", options: ["study", "studies", "studyes", "studying"], correct: "studies" },
        { type: 'mcq', question: "8. I always ___ my teachers carefully during the lessons.", options: ["listens to", "listening", "to listen", "listen to"], correct: "listen to" },
        { type: 'mcq', question: "9. The bell ___ at 7:00 AM every day.", options: ["ring", "rings", "ringing", "to ring"], correct: "rings" },
        { type: 'mcq', question: "10. Our form teacher ___ us a lot of homework on weekends.", options: ["give", "gives", "to give", "giving"], correct: "gives" },
        { type: 'mcq', question: "11. My sister ___ chemistry in the laboratory twice a week.", options: ["learn", "learns", "learning", "to learn"], correct: "learns" },
        { type: 'mcq', question: "12. They ___ football in the schoolyard during recess.", options: ["play", "plays", "plaies", "to play"], correct: "play" },
        { type: 'mcq', question: "13. Every student ___ a uniform on Mondays.", options: ["wear", "wears", "wearing", "to wear"], correct: "wears" },
        { type: 'mcq', question: "14. My classmates ___ reading books about history.", options: ["enjoys", "enjoy", "enjoying", "to enjoy"], correct: "enjoy" },
        { type: 'mcq', question: "15. John usually ___ his bike to school.", options: ["ride", "rides", "riding", "to ride"], correct: "rides" },

        // --- PHẦN 2: READING COMPREHENSION (16-20) ---
        { type: 'reading', text: readingTextDay5, question: "16. What grade is Anna in?", options: ["6th grade", "7th grade", "8th grade", "9th grade"], correct: "9th grade" },
        { type: 'reading', text: readingTextDay5, question: "17. Why does Anna like English?", options: ["Because she likes reading books.", "Because she wants to join the music club.", "Because she likes communicating with foreigners.", "Because Mr. Smith is handsome."], correct: "Because she likes communicating with foreigners." },
        { type: 'reading', text: readingTextDay5, question: "18. What does Mr. Smith always give the students?", options: ["Interesting books", "A lot of homework", "Interesting projects", "Good marks"], correct: "Interesting projects" },
        { type: 'reading', text: readingTextDay5, question: "19. Where does Anna often go during the break time?", options: ["The music club", "The library", "The laboratory", "The computer room"], correct: "The library" },
        { type: 'reading', text: readingTextDay5, question: "20. When does the music club practice singing?", options: ["Every Monday morning", "Every Friday afternoon", "Every weekend", "Every day"], correct: "Every Friday afternoon" },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: go / We / school / to / bus / every / by / day / .", correct: "We go to school by bus every day." },
        { type: 'writing', question: "22. Sắp xếp các từ sau: often / My / helps / me / with / homework / brother / my / .", correct: "My brother often helps me with my homework." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: learning / They / new / English / words / enjoy / .", correct: "They enjoy learning new English words." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: English / speaks / fluently / teacher / Our / very / .", correct: "Our English teacher speaks very fluently." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: read / students / The / books / library / the / in / .", correct: "The students read books in the library." }
      ];
    }

    // ==========================================
// ==========================================
    // MẪU CHO BÀI TEST (NGÀY 6)
    // ==========================================
    if (i === 6) {
      dayData.isTest = true;
      dayData.videoUrl = null; 
      dayData.requiredScore = 40; // Đề thi thực tế có 40 câu [cite: 3]
      dayData.vocabulary = []; 

      // Dữ liệu văn bản chung [cite: 154, 155, 156, 157, 158, 159, 160, 208, 209, 210, 211, 212, 213]
      const readingLinda = "My name is Linda. I am fourteen years old. I live in a big house with my family. There are five people in my extended family: my grandfather, my parents, my older brother, and me. My grandfather is seventy years old, and he is very kind. My father is a doctor; he works in a large hospital and is always busy. My mother is an English teacher. My brother, Peter, is eighteen years old and he is a college student. On weekends, my family often goes to the park or cooks meals in the kitchen together. We are a very happy family.";
      
      const clozeText = "Mark is a 9th-grade student. His lifestyle is very healthy. He is a member of the school sports club. His favorite sport (33) ___ swimming. It is a great exercise for the whole body. Mark's parents are also active. Their morning routine is walking (34) ___ the park. Fast food and sweet drinks are not in (35) ___ daily meals. An apple or a banana is Mark's favorite snack. They (36) ___ full of energy. Mark usually (37) ___ to school after breakfast.";

      dayData.exercises = [
        // I. BIỂN BÁO & THÔNG BÁO [cite: 9]
        { type: 'reading', text: "LIBRARY RULES\n- Please be quiet.\n- Students are studying.", question: "1. What does the sign say?", options: ["You can make noise in the library.", "You must keep silent in the library.", "You do not have to be quiet here.", "The library is a place for listening to loud music."], correct: "You must keep silent in the library." }, // [cite: 10, 11, 12, 13, 14]
        { type: 'reading', text: "ENGLISH CLUB MEETING\n- Friday afternoon at 2:30 PM\n- Room 15", question: "2. What does this notice say?", options: ["The club meets on Monday morning.", "You can join the club at 2:30 AM in Room 15.", "The English club meeting is on Friday afternoon.", "The meeting is in Room 2 and starts at 15:00."], correct: "The English club meeting is on Friday afternoon." }, // [cite: 15, 16, 17, 18]

        // II. NGỮ ÂM [cite: 19]
        { type: 'mcq', question: "3. Choose the word whose underlined part differs in pronunciation (ending -s/-es):", options: ["watches", "goes", "studies", "plays"], correct: "watches" }, // [cite: 20, 22, 23, 24]
        { type: 'mcq', question: "4. Choose the word whose underlined part differs in pronunciation (vowel 'a'):", options: ["bag", "hat", "park", "cat"], correct: "park" }, // [cite: 21, 22, 23, 25]

        // III. SẮP XẾP ĐOẠN VĂN [cite: 26]
        { type: 'reading', text: "a. In the afternoon, I often play football with my classmates.\nb. My name is Tom and I am a 9th-grade student.\nc. I have a very healthy lifestyle.\nd. In the morning, I always walk to school.\ne. On weekends, I go to the park with my family.", question: "5. Choose the correct arrangement to make a meaningful paragraph:", options: ["b - c - d - a - e", "c - b - a - d - e", "b - d - a - c - e", "c - d - a - e - b"], correct: "b - c - d - a - e" }, // [cite: 27, 28, 29, 30, 31, 32, 33, 35, 36, 37]
        { type: 'reading', text: "Dear Anna,\na. My new school is very big and beautiful.\nb. I hope you are doing well.\nc. Please write back to me soon.\nd. I study many subjects, but my favorite is English.\ne. I am writing to tell you about my new school.", question: "6. Choose the correct arrangement to make a meaningful letter:", options: ["a - e - d - b - c", "b - e - a - d - c", "b - a - d - e - c", "e - b - d - a - c"], correct: "b - e - a - d - c" }, // [cite: 34, 38, 39, 40, 41, 42, 43, 44, 45]

        // IV. NGỮ PHÁP & TỪ VỰNG [cite: 46, 47]
        { type: 'mcq', question: "7. My grandfather ___ a retired teacher.", options: ["am", "is", "are", "be"], correct: "is" }, // [cite: 48, 49, 50, 51, 52, 53]
        { type: 'mcq', question: "8. She is ___ excellent student in my class.", options: ["a", "an", "the", "Ø (no article)"], correct: "an" }, // [cite: 54, 55, 57, 58, 60, 61]
        { type: 'mcq', question: "9. I want to communicate with ___ from other countries.", options: ["foreigners", "subjects", "homework", "projects"], correct: "foreigners" }, // [cite: 59, 62, 63, 64, 65, 66]
        { type: 'mcq', question: "10. There are four ___ working in the school kitchen.", options: ["woman", "womans", "women", "womens"], correct: "women" }, // [cite: 67, 68, 69, 70, 71, 72]
        { type: 'mcq', question: "11. ___ is your math exam? - It is on Monday.", options: ["Where", "When", "What", "Who"], correct: "When" }, // [cite: 73, 74, 75, 76, 77, 78, 79]
        { type: 'mcq', question: "12. The students usually read books ___ the library.", options: ["in", "on", "at", "for"], correct: "in" }, // [cite: 80, 81, 82, 83, 84, 85]
        { type: 'mcq', question: "13. ___ are my parents. They are very kind.", options: ["This", "That", "These", "It"], correct: "These" }, // [cite: 86, 87, 88, 89, 90, 91]
        { type: 'mcq', question: "14. He ___ to school by bus every day.", options: ["go", "going", "goes", "went"], correct: "goes" }, // [cite: 92, 93, 94, 95, 96, 97]
        { type: 'mcq', question: "15. My sister ___ chemistry in the laboratory twice a week.", options: ["studies", "study", "studyes", "studying"], correct: "studies" }, // [cite: 98, 99, 100, 101, 102, 103]
        { type: 'mcq', question: "16. What are those? - ___ are my grandfather's pillows.", options: ["It", "They", "This", "That"], correct: "They" }, // [cite: 104, 105, 106, 107, 108]
        { type: 'mcq', question: "17. They play football in the ___ during recess.", options: ["wardrobe", "schoolyard", "airport", "kitchen"], correct: "schoolyard" }, // [cite: 109, 110, 111, 112, 113, 114]
        { type: 'mcq', question: "18. My father's brother is my ___", options: ["cousin", "uncle", "aunt", "nephew"], correct: "uncle" }, // [cite: 115, 116, 117, 118, 119]

        // V. SẮP XẾP TỪ THÀNH CÂU [cite: 120, 121]
        { type: 'mcq', question: "19. Choose the correct sentence arranged from: often / helps / My / with / me / brother / homework / my /.", options: ["My brother often helps me with my homework.", "My brother helps often me with my homework.", "My homework often helps me with my brother.", "My brother often helps my homework with me."], correct: "My brother often helps me with my homework." }, // [cite: 122, 123, 124, 125, 126]
        { type: 'mcq', question: "20. Choose the correct sentence arranged from: students / The / are / the / classroom / in /.", options: ["The classroom are in the students.", "The students in the classroom are.", "The students are in the classroom.", "Are the students in the classroom."], correct: "The students are in the classroom." }, // [cite: 127, 128, 129, 130, 131]

        // VI. TÌNH HUỐNG GIAO TIẾP [cite: 132, 133]
        { type: 'reading', text: "Mary and Jane are looking for their classmates.\nJane: \"Where are our classmates?\"\nMary: \"___\"", question: "21. Choose the best response:", options: ["Yes, they are.", "They are in the gymnasium.", "It is on the table.", "He is a doctor."], correct: "They are in the gymnasium." }, // [cite: 134, 135, 136, 139, 140, 141]

        // VII. VIẾT CÂU TỪ TỪ GỢI Ý [cite: 142, 143]
        { type: 'mcq', question: "22. Make a sentence from: Our / English / class / start / 7:15 AM /.", options: ["Our English class starts on 7:15 AM.", "Our English class starts in 7:15 AM.", "Our English class start at 7:15 AM.", "Our English class starts at 7:15 AM."], correct: "Our English class starts at 7:15 AM." }, // [cite: 144, 145, 146, 147, 148]
        { type: 'mcq', question: "23. Make a sentence from: She / have / two / brother / and / one / sister /.", options: ["She have two brothers and one sister.", "She has two brothers and one sister.", "She has two brother and one sister.", "She has two brothers and one sisters."], correct: "She has two brothers and one sister." }, // [cite: 149, 150, 151, 152]

        // VIII. ĐỌC HIỂU [cite: 153]
        { type: 'reading', text: readingLinda, question: "24. How many people are there in Linda's family?", options: ["Four", "Five", "Six", "Seven"], correct: "Five" }, // [cite: 161, 162, 163, 164, 165]
        { type: 'reading', text: readingLinda, question: "25. Who is seventy years old?", options: ["Linda", "Her father", "Her grandfather", "Peter"], correct: "Her grandfather" }, // [cite: 166, 167, 168, 169, 170]
        { type: 'reading', text: readingLinda, question: "26. What is Linda's mother's job?", options: ["A doctor", "A student", "A nurse", "A teacher"], correct: "A teacher" }, // [cite: 171, 172, 173, 174, 175]
        { type: 'reading', text: readingLinda, question: "27. What do they often do on weekends?", options: ["Go to the hospital", "Read books in the library", "Go to the park or cook together", "Visit their aunt and uncle"], correct: "Go to the park or cook together" }, // [cite: 176, 177, 178, 179, 180]
        { type: 'reading', text: readingLinda, question: "28. Which of the following is NOT true about Peter?", options: ["He is older than Linda.", "He is eighteen years old.", "He is a doctor.", "He is a student."], correct: "He is a doctor." }, // [cite: 181, 182, 183, 184, 185]

        // IX. TÌM CÂU ĐỒNG NGHĨA [cite: 186, 187]
        { type: 'mcq', question: "29. \"There are five people in my extended family.\" is closest in meaning to:", options: ["My extended family have five people.", "My extended family has five people.", "Five people is in my extended family.", "My extended family are five people."], correct: "My extended family has five people." }, // [cite: 188, 189, 190, 192]
        { type: 'mcq', question: "30. \"The garden is behind the house.\" is closest in meaning to:", options: ["The house is in front of the garden.", "The house is next to the garden.", "The garden is in front of the house.", "The house is under the garden."], correct: "The house is in front of the garden." }, // [cite: 193, 194, 195, 196]
        { type: 'mcq', question: "31. \"Peter rides his bike to school.\" is closest in meaning to:", options: ["Peter goes to school on bike.", "Peter travels to school by his bike.", "Peter goes to school by bike.", "Peter goes to school with bike."], correct: "Peter goes to school by bike." }, // [cite: 197, 198, 199, 200, 201]
        { type: 'mcq', question: "32. \"The English class starts at 8:00 AM.\" is closest in meaning to:", options: ["It is 8:00 AM. The English class ends.", "It is 8:00 AM when the English class starts.", "The English class is in 8:00 AM.", "We start the English class on 8:00 AM."], correct: "It is 8:00 AM when the English class starts." }, // [cite: 202, 203, 204, 205, 206]

        // X. ĐỌC ĐIỀN TỪ [cite: 207]
        { type: 'reading', text: clozeText, question: "33. Choose the best word for blank (33):", options: ["am", "is", "are", "be"], correct: "is" }, // [cite: 214, 220, 221, 230]
        { type: 'reading', text: clozeText, question: "34. Choose the best word for blank (34):", options: ["at", "on", "in", "during"], correct: "in" }, // [cite: 215, 222, 223, 231]
        { type: 'reading', text: clozeText, question: "35. Choose the best word for blank (35):", options: ["his", "their", "our", "your"], correct: "their" }, // [cite: 216, 224, 225, 232]
        { type: 'reading', text: clozeText, question: "36. Choose the best word for blank (36):", options: ["is", "are", "do", "has"], correct: "are" }, // [cite: 217, 226, 227, 233]
        { type: 'reading', text: clozeText, question: "37. Choose the best word for blank (37):", options: ["walk", "walks", "walking", "to walk"], correct: "walks" }, // [cite: 218, 228, 229, 234]

        // XI. TRỌNG ÂM [cite: 235]
        { type: 'mcq', question: "38. Choose the word that differs from the other three in the position of primary stress:", options: ["doctor", "uncle", "guitar", "sister"], correct: "guitar" }, // [cite: 236, 238, 240, 242]
        { type: 'mcq', question: "39. Choose the word that differs from the other three in the position of primary stress:", options: ["afternoon", "badminton", "basketball", "volleyball"], correct: "afternoon" }, // [cite: 237, 239, 241, 243]

        // XII. SẮP XẾP HỘI THOẠI [cite: 244, 245]
        { type: 'reading', text: "a. Receptionist: Yes, the school library is on the second floor.\nb. Student: Hello. Where is the school library?\nc. Student: Thank you very much!", question: "40. Choose the correct arrangement to make a meaningful exchange:", options: ["b - a - c", "a - b - c", "b - c - a", "c - a - b"], correct: "b - a - c" } // [cite: 246, 247, 248, 249, 250, 251, 252, 253]
      ];
    }
    // ==========================================
    // ==========================================
    // NGÀY 7: THÌ HIỆN TẠI ĐƠN - THỂ PHỦ ĐỊNH
    // ==========================================
    if (i === 7) {
      dayData.videoUrl = "https://drive.google.com/file/d/1wOUFJWmYBsIR0mjQShh4z-4F5Rm6V-Q3/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "work", meaning: "làm việc" },
        { word: "swim", meaning: "bơi lội" },
        { word: "drive", meaning: "lái xe ô tô" },
        { word: "share", meaning: "chia sẻ / dùng chung" },
        { word: "phone", meaning: "gọi điện" },
        { word: "get up", meaning: "thức dậy" },
        { word: "teach", meaning: "dạy học" },
        { word: "jog", meaning: "chạy bộ" },
        { word: "water", meaning: "tưới nước" },
        { word: "plant", meaning: "trồng cây / cái cây" },
        { word: "flat", meaning: "căn hộ" },
        { word: "do chores", meaning: "làm việc nhà" },
        { word: "commute", meaning: "đi lại / đi làm" },
        { word: "prepare meals", meaning: "chuẩn bị bữa ăn" },
        { word: "take a nap", meaning: "ngủ trưa ngắn" },
        { word: "hang out", meaning: "đi chơi (với bạn bè)" },
        { word: "illiterate", meaning: "mù chữ" },
        { word: "traffic jam", meaning: "tắc đường" }
      ];

      const readingTextDay7 = "Hello, I am Peter. I am a 9th-grade student. I live in a big city with my parents and my younger sister. My daily routine is quite busy. I get up at 6:00 AM, have breakfast, and take the bus to school. My school starts at 7:15 AM and finishes at 11:30 AM. I don't go home for lunch; I eat at the school canteen.\n\nIn the afternoon, I don't have classes every day. On Mondays and Thursdays, I stay at school to play football with my friends. On other days, I go to the library to read books or do my homework. I don't play video games because I think it is a waste of time. My parents work in a big hospital, so they don't come home early. I often help my sister with her homework and we prepare dinner together. We don't eat meat very often; we prefer vegetables and fish.\n\nOn the weekend, my family has more free time. We don't stay at home. We usually go to a park or visit my grandparents in the countryside. Life in the city is fast, but I enjoy my balanced lifestyle.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: "1. My best friend ___ fast food because she wants to stay healthy.", options: ["don't eat", "doesn't eats", "doesn't eat", "don't eats"], correct: "doesn't eat" },
        { type: 'mcq', question: "2. We ___ TV in the morning. We usually read books.", options: ["doesn't watch", "aren't watch", "don't watch", "isn't watch"], correct: "don't watch" },
        { type: 'mcq', question: "3. Anna's brother ___ up early on Sundays.", options: ["doesn't get", "don't gets", "doesn't gets", "don't get"], correct: "doesn't get" },
        { type: 'mcq', question: "4. I ___ a lot of free time on weekdays because of my studies.", options: ["hasn't", "don't have", "doesn't have", "haven't"], correct: "don't have" },
        { type: 'mcq', question: "5. The teacher ___ us too much homework on the weekend.", options: ["don't give", "doesn't gives", "don't gives", "doesn't give"], correct: "doesn't give" },
        { type: 'mcq', question: "6. They ___ to the gym every day, only on Mondays and Wednesdays.", options: ["doesn't go", "aren't go", "don't go", "don't goes"], correct: "don't go" },
        { type: 'mcq', question: "7. His daughter ___ in a hospital. She works in a clinic.", options: ["don't work", "doesn't works", "doesn't work", "isn't work"], correct: "doesn't work" },
        { type: 'mcq', question: "8. You ___ to water these plants every day. Twice a week is enough.", options: ["doesn't need", "don't need", "not need", "aren't need"], correct: "don't need" },
        { type: 'mcq', question: "9. My parents ___ the flat with anyone else.", options: ["don't share", "doesn't share", "don't shares", "doesn't shares"], correct: "don't share" },
        { type: 'mcq', question: "10. The coffee machine ___ properly, so I will make tea instead.", options: ["don't work", "doesn't work", "aren't work", "isn't work"], correct: "doesn't work" },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay7, question: "11. What time does Peter get up?", options: ["7:15 AM", "6:00 AM", "11:30 AM", "6:30 AM"], correct: "6:00 AM" },
        { type: 'reading', text: readingTextDay7, question: "12. How does Peter go to school?", options: ["By car", "By bike", "By bus", "On foot"], correct: "By bus" },
        { type: 'reading', text: readingTextDay7, question: "13. Where does Peter have lunch?", options: ["At home", "At a restaurant", "At the school canteen", "At his grandparents' house"], correct: "At the school canteen" },
        { type: 'reading', text: readingTextDay7, question: "14. What does Peter do on Mondays and Thursdays afternoon?", options: ["He plays football.", "He goes to the library.", "He plays video games.", "He prepares dinner."], correct: "He plays football." },
        { type: 'reading', text: readingTextDay7, question: "15. Why doesn't Peter play video games?", options: ["Because he doesn't have a computer.", "Because his parents don't allow it.", "Because he thinks it is a waste of time.", "Because he is not good at it."], correct: "Because he thinks it is a waste of time." },
        { type: 'reading', text: readingTextDay7, question: "16. Where do Peter's parents work?", options: ["In a school", "In a library", "In a bank", "In a hospital"], correct: "In a hospital" },
        { type: 'reading', text: readingTextDay7, question: "17. Who helps Peter's sister with her homework?", options: ["Her parents", "Peter", "Her teacher", "Her friends"], correct: "Peter" },
        { type: 'reading', text: readingTextDay7, question: "18. What do Peter and his sister prefer to eat?", options: ["Fast food", "Meat and potatoes", "Vegetables and fish", "Ice cream and cake"], correct: "Vegetables and fish" },
        { type: 'reading', text: readingTextDay7, question: "19. What does Peter's family usually do on the weekend?", options: ["They stay at home and watch TV.", "They go shopping in the city center.", "They go to a park or visit grandparents.", "They go to the hospital."], correct: "They go to a park or visit grandparents." },
        { type: 'reading', text: readingTextDay7, question: "20. Which of the following is NOT TRUE about Peter?", options: ["He is a 9th-grade student.", "He helps his sister prepare dinner.", "He has classes every afternoon.", "He enjoys his balanced lifestyle."], correct: "He has classes every afternoon." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: the / My / don't / in / jogging / parents / go / morning / .", correct: "My parents don't go jogging in the morning." },
        { type: 'writing', question: "22. Sắp xếp các từ sau: brother / his / computer / younger / play / games / doesn't / Her / on / .", correct: "Her younger brother doesn't play games on his computer." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: much / time / have / They / during / don't / free / the / week / .", correct: "They don't have much free time during the week." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: coffee / doesn't / because / like / bitter / it / is / She / .", correct: "She doesn't like coffee because it is bitter." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: a / We / flat / center / share / don't / in / city / the / .", correct: "We don't share a flat in the city center." }
      ];
    }

    // ==========================================
    // NGÀY 8: THỂ NGHI VẤN - FOOD AND DRINK
    // ==========================================
    if (i === 8) {
      dayData.videoUrl = "https://drive.google.com/file/d/1oNtZ79dlkYaKYJZH_RoU49wWoKB34c_y/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "rain", meaning: "mưa" },
        { word: "snow", meaning: "tuyết rơi" },
        { word: "wear", meaning: "mặc/đội" },
        { word: "finish", meaning: "hoàn thành" },
        { word: "sleep", meaning: "ngủ" },
        { word: "understand", meaning: "hiểu" },
        { word: "rent", meaning: "thuê" },
        { word: "clean", meaning: "lau dọn" },
        { word: "feed", meaning: "cho ăn" },
        { word: "fast food", meaning: "đồ ăn nhanh" },
        { word: "beverage", meaning: "đồ uống" },
        { word: "dessert", meaning: "món tráng miệng" },
        { word: "ingredient", meaning: "thành phần" },
        { word: "recipe", meaning: "công thức" },
        { word: "nutritious", meaning: "bổ dưỡng" },
        { word: "delicious", meaning: "ngon miệng" },
        { word: "sour", meaning: "chua" },
        { word: "bitter", meaning: "đắng" }
      ];

      const readingTextDay8 = "Healthy Eating Habits\nA healthy diet is essential for maintaining good health and energy levels, especially for teenagers. Nutritionists say that young people need a balanced mix of proteins, carbohydrates, vitamins, and minerals. Many teenagers today prefer fast food like hamburgers, pizzas, and fried chicken because they are tasty and convenient. However, these foods are often high in fat, sugar, and salt, which can lead to obesity and other health problems if eaten too frequently. Instead of fast food, teenagers should eat more fresh fruits and vegetables. For example, an apple or a banana is a great snack between meals. Breakfast is considered the most important meal of the day. It gives your body the energy it needs to start a new day. A good breakfast could include eggs, bread, and a glass of milk. Unfortunately, many students skip breakfast because they get up late and don't have enough time. Hydration is also very important. Teenagers should drink at least two liters of water every day. Sugary drinks like soda or commercial milk tea should be avoided because they contain too much artificial sugar. By making small changes in daily eating habits, teenagers can improve their physical and mental health significantly.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: "1. ___ your father drink coffee every morning?", options: ["Do", "Does", "Is", "Are"], correct: "Does" },
        { type: 'mcq', question: "2. I ___ eat fast food because it is not good for my health.", options: ["doesn't", "aren't", "don't", "isn't"], correct: "don't" },
        { type: 'mcq', question: "3. ___ they like drinking milk tea? - Yes, they ___", options: ["Do / do", "Does / does", "Are / are", "Do / don't"], correct: "Do / do" },
        { type: 'mcq', question: "4. What ___ she often have for breakfast? She has a sandwich and an apple.", options: ["do", "doing", "is", "does"], correct: "does" },
        { type: 'mcq', question: "5. Does your sister ___ cooking dinner for the family?", options: ["enjoys", "enjoy", "enjoying", "enjoyed"], correct: "enjoy" },
        { type: 'mcq', question: "6. We need to buy some fresh ___ to make a salad.", options: ["vegetables", "meat", "sugar", "milk"], correct: "vegetables" },
        { type: 'mcq', question: "7. My grandfather doesn't ___ sweet things. He prefers bitter tea.", options: ["likes", "like", "liking", "liked"], correct: "like" },
        { type: 'mcq', question: "8. ___ David and his friends often go to the new Korean restaurant?", options: ["Does", "Do", "Are", "Is"], correct: "Do" },
        { type: 'mcq', question: "9. Pho is a very famous traditional ___ in Vietnam.", options: ["drink", "fruit", "dish", "dessert"], correct: "dish" },
        { type: 'mcq', question: "10. ___ it take a long time to bake this apple pie?", options: ["Do", "Is", "Does", "Has"], correct: "Does" },

        // --- PHẦN 2: READING COMPREHENSION (11-20) --- ĐÃ SỬA LỖI BIẾN TEXT
        { type: 'reading', text: readingTextDay8, question: "11. What is the main idea of the passage?", options: ["How to cook fast food.", "The importance of healthy eating for teenagers.", "Why teenagers love milk tea.", "The history of Vietnamese traditional food."], correct: "The importance of healthy eating for teenagers." },
        { type: 'reading', text: readingTextDay8, question: "12. According to nutritionists, what do young people need?", options: ["Only vitamins and minerals.", "A lot of fast food.", "A balanced mix of proteins, carbohydrates, vitamins, and minerals.", "Only water and fruits."], correct: "A balanced mix of proteins, carbohydrates, vitamins, and minerals." },
        { type: 'reading', text: readingTextDay8, question: "13. Why do many teenagers prefer fast food?", options: ["Because it is very healthy.", "Because it is tasty and convenient.", "Because it is cheap.", "Because nutritionists recommend it."], correct: "Because it is tasty and convenient." },
        { type: 'reading', text: readingTextDay8, question: "14. What health problem can be caused by eating too much fast food?", options: ["Obesity", "Headache", "Toothache", "Flu"], correct: "Obesity" },
        { type: 'reading', text: readingTextDay8, question: "15. What does the passage suggest teenagers should eat as a snack?", options: ["A slice of pizza", "A hamburger", "An apple or a banana", "Fried chicken"], correct: "An apple or a banana" },
        { type: 'reading', text: readingTextDay8, question: "16. Which meal is considered the most important of the day?", options: ["Breakfast", "Lunch", "Dinner", "Snack"], correct: "Breakfast" },
        { type: 'reading', text: readingTextDay8, question: "17. Why do many students skip breakfast?", options: ["Because they don't like eating in the morning.", "Because they want to lose weight.", "Because they get up late and don't have enough time.", "Because breakfast is expensive."], correct: "Because they get up late and don't have enough time." },
        { type: 'reading', text: readingTextDay8, question: "18. How much water should teenagers drink daily?", options: ["Exactly one liter.", "At least two liters.", "More than four liters.", "Less than one liter."], correct: "At least two liters." },
        { type: 'reading', text: readingTextDay8, question: "19. Why should teenagers avoid sugary drinks like soda?", options: ["Because they contain too much artificial sugar.", "Because they are expensive.", "Because they are difficult to buy.", "Because they are too cold."], correct: "Because they contain too much artificial sugar." },
        { type: 'reading', text: readingTextDay8, question: "20. What is the benefit of making small changes in eating habits?", options: ["Teenagers can sleep longer.", "Teenagers can improve their physical and mental health.", "Teenagers can save a lot of money.", "Teenagers will never get sick again."], correct: "Teenagers can improve their physical and mental health." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: your / eat / Does / a / vegetables / of / brother / lot / ?", correct: "Does your brother eat a lot of vegetables?" },
        { type: 'writing', question: "22. Sắp xếp các từ sau: breakfast / every / prepare / you / Do / morning / your / for / family / ?", correct: "Do you prepare breakfast for your family every morning?" },
        { type: 'writing', question: "23. Sắp xếp các từ sau: milk / My / doesn't / drink / tea / mother / much / .", correct: "My mother doesn't drink much milk tea." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: the / What / eat / for / does / often / dinner / girl / ?", correct: "What does the girl often eat for dinner?" },
        { type: 'writing', question: "25. Sắp xếp các từ sau: like / They / traditional / their / cooking / dishes / country / of / .", correct: "They like cooking traditional dishes of their country." }
      ];
    }
    // ==========================================
    // NGÀY 9: THÌ HIỆN TẠI ĐƠN - MÔI TRƯỜNG (ENVIRONMENT)
    // ==========================================
    if (i === 9) {
      dayData.videoUrl = "https://drive.google.com/file/d/1kjbTnRfEI-mj5UreGObSuSAItiJdxA6h/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "rise", meaning: "mọc / tăng" },
        { word: "set", meaning: "lặn (mặt trời)" },
        { word: "boil", meaning: "sôi" },
        { word: "cycle", meaning: "đạp xe" },
        { word: "tidy", meaning: "dọn dẹp / ngăn nắp" },
        { word: "sun", meaning: "mặt trời" },
        { word: "east", meaning: "phía đông" },
        { word: "west", meaning: "phía tây" },
        { word: "pollution", meaning: "sự ô nhiễm" },
        { word: "global warming", meaning: "hiện tượng ấm lên toàn cầu" },
        { word: "habitat", meaning: "môi trường sống" },
        { word: "waste", meaning: "rác thải / lãng phí" },
        { word: "carbon footprint", meaning: "lượng khí thải carbon" },
        { word: "protect", meaning: "bảo vệ" },
        { word: "recycle", meaning: "tái chế" },
        { word: "reduce", meaning: "cắt giảm" },
        { word: "eco-friendly", meaning: "thân thiện với môi trường" },
        { word: "sustainable", meaning: "bền vững" }
      ];

      const readingTextDay9 = "Green Living: Simple Habits to Protect Our Earth\n\nOur planet is facing many serious environmental problems such as global warming, air pollution, and deforestation. However, we can protect the Earth by changing our daily habits. It does not require a lot of money or time to adopt a \"green lifestyle\".\n\nFirst of all, saving energy is very important. Many people leave the lights and televisions on when they are not in the room. We should always remember to turn them off to save electricity. Moreover, we shouldn't waste water. Taking a short shower instead of a bath is a good way to conserve fresh water.\n\nSecondly, plastic waste is extremely harmful to the environment because it takes hundreds of years to decompose. Therefore, we should limit the use of single-use plastic bags and bottles. Instead, using reusable bags and glass bottles is highly recommended. Many supermarkets now encourage customers to bring their own bags when shopping.\n\nFinally, planting trees is one of the most effective actions to make the air cleaner. Trees provide oxygen and absorb carbon dioxide. In spring, many schools organize \"Tree Planting Days\" for students. Doing this not only beautifies the environment but also teaches young people to love and protect nature. Every small action counts. If everyone adopts these simple habits, our world will be a much cleaner and safer place to live.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: "1. We usually ___ reusable bags when we go to the supermarket.", options: ["use", "uses", "are using", "to use"], correct: "use" },
        { type: 'mcq', question: "2. Air pollution ___ a very serious problem in our city nowadays.", options: ["is", "are", "be", "am"], correct: "is" },
        { type: 'mcq', question: "3. My mother always ___ off the lights before leaving the room to save electricity.", options: ["turn", "turns", "turning", "turned"], correct: "turns" },
        { type: 'mcq', question: "4. ___ students in your school recycle paper and plastic bottles every week?", options: ["Does", "Are", "Do", "Is"], correct: "Do" },
        { type: 'mcq', question: "5. The sun ___ renewable energy which is completely eco-friendly.", options: ["provide", "provides", "providing", "is provide"], correct: "provides" },
        { type: 'mcq', question: "6. Many wild animals ___ their natural habitats because of deforestation.", options: ["lose", "loses", "losing", "to lose"], correct: "lose" },
        { type: 'mcq', question: "7. My brother-in-law ___ drive to work; he always cycles to reduce his carbon footprint.", options: ["don't", "isn't", "aren't", "doesn't"], correct: "doesn't" },
        { type: 'mcq', question: "8. Water ___ at 100 degrees Celsius, but we shouldn't waste energy to boil more water than we need.", options: ["boil", "boils", "boiling", "is boiling"], correct: "boils" },
        { type: 'mcq', question: "9. How often ___ you plant trees in the local park?", options: ["does", "do", "are", "is"], correct: "do" },
        { type: 'mcq', question: "10. They never ___ rubbish into the river near their house.", options: ["throw", "throws", "throwing", "to throw"], correct: "throw" },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay9, question: "11. What is the main idea of the passage?", options: ["The history of global warming.", "How supermarkets sell reusable bags.", "Simple daily habits to protect the environment.", "The benefits of taking a bath."], correct: "Simple daily habits to protect the environment." },
        { type: 'reading', text: readingTextDay9, question: "12. According to paragraph 1, adopting a green lifestyle", options: ["requires a lot of money", "takes too much time", "does not require a lot of money or time", "is impossible for modern people"], correct: "does not require a lot of money or time" },
        { type: 'reading', text: readingTextDay9, question: "13. The word \"them\" in paragraph 2 refers to", options: ["many people", "the lights and televisions", "the daily habits", "fresh water"], correct: "the lights and televisions" },
        { type: 'reading', text: readingTextDay9, question: "14. How can we conserve fresh water according to the text?", options: ["By turning off the lights.", "By leaving the television on.", "By taking a short shower instead of a bath.", "By drinking water from glass bottles."], correct: "By taking a short shower instead of a bath." },
        { type: 'reading', text: readingTextDay9, question: "15. Why is plastic waste extremely harmful to the environment?", options: ["It is very expensive.", "It absorbs oxygen.", "It makes the air cleaner.", "It takes hundreds of years to decompose."], correct: "It takes hundreds of years to decompose." },
        { type: 'reading', text: readingTextDay9, question: "16. What should we use instead of single-use plastic bags?", options: ["Plastic bottles", "Reusable bags", "Televisions", "Nothing"], correct: "Reusable bags" },
        { type: 'reading', text: readingTextDay9, question: "17. Supermarkets now encourage customers to", options: ["bring their own bags when shopping", "buy more plastic bags", "take longer showers", "leave the lights on"], correct: "bring their own bags when shopping" },
        { type: 'reading', text: readingTextDay9, question: "18. According to the passage, what do trees provide?", options: ["Carbon dioxide", "Single-use bags", "Oxygen", "Electricity"], correct: "Oxygen" },
        { type: 'reading', text: readingTextDay9, question: "19. When do many schools organize \"Tree Planting Days\"?", options: ["In summer", "In autumn", "In spring", "In winter"], correct: "In spring" },
        { type: 'reading', text: readingTextDay9, question: "20. Which of the following statements is NOT TRUE according to the passage?", options: ["Global warming is a serious environmental problem.", "Planting trees teaches young people to love nature.", "Taking a bath saves more water than taking a short shower.", "Every small action is important to protect the Earth."], correct: "Taking a bath saves more water than taking a short shower." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: The / sun / rises / in / the / east / .", correct: "The sun rises in the east." },
        { type: 'writing', question: "22. Sắp xếp các từ sau: We / always / use / reusable / bags / at / the / supermarket / .", correct: "We always use reusable bags at the supermarket." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: Many / people / ride / bicycles / to / work / every / day / .", correct: "Many people ride bicycles to work every day." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: Our / students / often / plant / trees / in / spring / .", correct: "Our students often plant trees in spring." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: Water / pollution / is / a / big / problem / in / our / city / .", correct: "Water pollution is a big problem in our city." }
      ];
    }

    // ==========================================
    // NGÀY 10: TỪ LOẠI (PARTS OF SPEECH) & TECHNOLOGY
    // ==========================================
    if (i === 10) {
      dayData.videoUrl = "https://drive.google.com/file/d/1D-btR1RHoIT-I4E7ragPJqS-cNxQfxy7/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "teacher", meaning: "giáo viên" },
        { word: "happiness", meaning: "sự hạnh phúc" },
        { word: "safety", meaning: "sự an toàn" },
        { word: "beautiful", meaning: "xinh đẹp" },
        { word: "dangerous", meaning: "nguy hiểm" },
        { word: "friendly", meaning: "thân thiện" },
        { word: "carefully", meaning: "một cách cẩn thận" },
        { word: "fast", meaning: "nhanh (tính từ/trạng từ)" },
        { word: "application", meaning: "ứng dụng" },
        { word: "device", meaning: "thiết bị" },
        { word: "innovation", meaning: "sự đổi mới" },
        { word: "smartphone", meaning: "điện thoại thông minh" },
        { word: "cyberspace", meaning: "không gian mạng" },
        { word: "algorithm", meaning: "thuật toán" },
        { word: "automate", meaning: "tự động hóa" },
        { word: "virtual assistant", meaning: "trợ lý ảo" },
        { word: "machine learning", meaning: "học máy" },
        { word: "interactive", meaning: "có tính tương tác" }
      ];

      const readingTextDay10 = "Artificial Intelligence (AI) has rapidly transformed the way we live, work, and learn. Today, AI is no longer a concept from science fiction; it is a reality that exists in our daily lives. From virtual assistants on our smartphones to personalized recommendations on streaming platforms, AI technology is everywhere.\n\nOne of the most significant impacts of AI is in the field of education. Intelligent tutoring systems can adapt to a student's individual learning pace, providing customized exercises and feedback. This makes learning highly efficient. Moreover, teachers can use AI to automate administrative tasks, such as grading multiple-choice exams, which gives them more free time to focus on interactive classroom activities.\n\nHowever, the rapid development of AI also brings certain challenges. Data privacy is a major concern because AI systems require massive amounts of personal data to function accurately. If this data falls into the wrong hands, it can be extremely dangerous. Additionally, there is a fear that AI might replace human workers in various industries, leading to unemployment.\n\nDespite these concerns, scientists believe that if we regulate AI carefully, its benefits will easily outweigh the risks. The future relies on how successfully humans can collaborate with intelligent machines to create a better world.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: "1. The new smartphone is ___ designed with many advanced features.", options: ["beauty", "beautiful", "beautifully", "beautify"], correct: "beautifully" },
        { type: 'mcq', question: "2. Artificial intelligence is becoming a very ___ tool in modern education.", options: ["use", "useful", "uselessly", "usage"], correct: "useful" },
        { type: 'mcq', question: "3. You should read the instructions ___ before installing this software.", options: ["care", "careful", "careless", "carefully"], correct: "carefully" },
        { type: 'mcq', question: "4. Programmers must work ___ to finish the new application by next week.", options: ["hard", "hardly", "harden", "hardness"], correct: "hard" },
        { type: 'mcq', question: "5. His presentation about machine learning was very ___.", options: ["interest", "interested", "interesting", "interestingly"], correct: "interesting" },
        { type: 'mcq', question: "6. Many ___ are working day and night to improve data security.", options: ["science", "scientists", "scientific", "scientifically"], correct: "scientists" },
        { type: 'mcq', question: "7. Using public Wi-Fi networks can sometimes be ___ for your personal data.", options: ["danger", "dangerous", "dangerously", "endangered"], correct: "dangerous" },
        { type: 'mcq', question: "8. She types so ___ that she can finish the report in just ten minutes.", options: ["fast", "fastly", "faster", "fasten"], correct: "fast" },
        { type: 'mcq', question: "9. The ___ of a high-speed internet connection is undeniable in today's world.", options: ["important", "importantly", "importance", "import"], correct: "importance" },
        { type: 'mcq', question: "10. Virtual assistants like Siri or Alexa act very ___ when they process voice commands.", options: ["quick", "quickly", "quickness", "quicker"], correct: "quickly" },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay10, question: "11. What is the main idea of the passage?", options: ["How to build an Artificial Intelligence system.", "The history of science fiction movies.", "The impact, benefits, and challenges of AI.", "Why AI will replace all teachers in the future."], correct: "The impact, benefits, and challenges of AI." },
        { type: 'reading', text: readingTextDay10, question: "12. According to paragraph 1, Artificial Intelligence is", options: ["only found in science fiction", "not yet a reality", "everywhere in our daily lives", "only used on streaming platforms"], correct: "everywhere in our daily lives" },
        { type: 'reading', text: readingTextDay10, question: "13. How does AI help students in education?", options: ["By doing their homework for them.", "By adapting to their individual learning pace.", "By replacing their human teachers.", "By grading their exams automatically."], correct: "By adapting to their individual learning pace." },
        { type: 'reading', text: readingTextDay10, question: "14. The word \"efficient\" in paragraph 2 is closest in meaning to:", options: ["terrible", "useless", "effective", "slow"], correct: "effective" },
        { type: 'reading', text: readingTextDay10, question: "15. The word \"them\" in paragraph 2 refers to:", options: ["teachers", "students", "exams", "administrative tasks"], correct: "teachers" },
        { type: 'reading', text: readingTextDay10, question: "16. According to the passage, how does AI assist teachers?", options: ["It teaches interactive classroom activities.", "It automates tasks like grading exams.", "It provides customized exercises to teachers.", "It replaces the need for a classroom."], correct: "It automates tasks like grading exams." },
        { type: 'reading', text: readingTextDay10, question: "17. What is a major concern regarding AI mentioned in paragraph 3?", options: ["It makes learning too fast.", "It is too expensive to develop.", "Data privacy.", "Streaming platforms."], correct: "Data privacy." },
        { type: 'reading', text: readingTextDay10, question: "18. Why do AI systems require personal data?", options: ["To replace human workers.", "To function accurately.", "To grade exams.", "To create science fiction movies."], correct: "To function accurately." },
        { type: 'reading', text: readingTextDay10, question: "19. What do scientists believe about the future of AI?", options: ["The risks are greater than the benefits.", "AI should be completely banned.", "With careful regulation, benefits will outweigh risks.", "AI will eventually control human beings."], correct: "With careful regulation, benefits will outweigh risks." },
        { type: 'reading', text: readingTextDay10, question: "20. Which of the following is NOT mentioned as an application of AI?", options: ["Virtual assistants on smartphones.", "Driving cars automatically.", "Personalized recommendations on streaming platforms.", "Intelligent tutoring systems."], correct: "Driving cars automatically." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: The / Internet / has / changed / the / way / we / communicate / .", correct: "The Internet has changed the way we communicate." },
        { type: 'writing', question: "22. Sắp xếp các từ sau: Artificial / intelligence / is / becoming / very / popular / in / education / .", correct: "Artificial intelligence is becoming very popular in education." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: You / should / always / read / the / instructions / carefully / .", correct: "You should always read the instructions carefully." },
        { type: 'writing', question: "24. Sắp xếp các từ sau: This / is / a / very / useful / application / for / learning / English / .", correct: "This is a very useful application for learning English." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: Many / students / use / smartphones / to / do / their / homework / .", correct: "Many students use smartphones to do their homework." }
      ];
    }

    // ==========================================
    // NGÀY 11: THÌ HIỆN TẠI TIẾP DIỄN & TOURISM
    // ==========================================
    if (i === 11) {
      dayData.videoUrl = "https://drive.google.com/file/d/1tMIC_glXqGcy1X7dK1MtjJ8VKYXNHcQD/view?usp=drive_link";
      dayData.vocabulary = [
        { word: "rest", meaning: "nghỉ ngơi" },
        { word: "close", meaning: "đóng" },
        { word: "type", meaning: "gõ chữ" },
        { word: "fly", meaning: "bay" },
        { word: "wait", meaning: "đợi" },
        { word: "destination", meaning: "điểm đến" },
        { word: "accommodation", meaning: "chỗ ở" },
        { word: "itinerary", meaning: "lịch trình" },
        { word: "eco-tourism", meaning: "du lịch sinh thái" },
        { word: "souvenir", meaning: "quà lưu niệm" },
        { word: "luggage", meaning: "hành lý" },
        { word: "tour guide", meaning: "hướng dẫn viên" },
        { word: "sightseeing", meaning: "ngắm cảnh" },
        { word: "breathtaking", meaning: "đẹp ngoạn mục" },
        { word: "explore", meaning: "khám phá" }
      ];

      const readingTextDay11 = "Right now, the Nguyen family is enjoying their summer holiday in Da Nang, a famous tourist destination in Vietnam. They are staying in a beautiful resort near the beach. At the moment, the weather is fantastic, and everyone is doing something fun.\n\nMr. Nguyen is swimming in the clear blue sea. Mrs. Nguyen isn't swimming; she is relaxing on a sunbed and drinking a fresh coconut. Their son, Minh, is building a large sandcastle, and their daughter, Lan, is taking photos of the breathtaking scenery to post on her social media.\n\nTomorrow, they are taking a boat trip to explore the nearby islands. They already booked the tickets and checked the itinerary carefully. They are having a wonderful time. Before they leave, Mrs. Nguyen is planning to buy some souvenirs for her colleagues.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: "1. Look! The tour guide ___ the flag so we can follow him easily.", options: ["is holding", "are holding", "holds", "holding"], correct: "is holding" },
        { type: 'mcq', question: "2. At the moment, my parents ___ suitable accommodation for our summer trip.", options: ["look for", "are looking for", "looking for", "looks for"], correct: "are looking for" },
        { type: 'mcq', question: "3. I can't talk right now. I ___ my luggage for the flight to Paris.", options: ["pack", "are packing", "am packing", "packing"], correct: "am packing" },
        { type: 'mcq', question: "4. They ___ to Japan tomorrow morning. They already have the tickets.", options: ["fly", "flew", "flies", "are flying"], correct: "are flying" },
        { type: 'mcq', question: "5. The scenery here is ___! I am taking a lot of photos to show my friends.", options: ["breathtaking", "terrible", "polluted", "crowded"], correct: "breathtaking" },
        { type: 'mcq', question: "6. ___ the tourists ___ to the local guide right now?", options: ["Do / listen", "Is / listening", "Are / listening", "Does / listen"], correct: "Are / listening" },
        { type: 'mcq', question: "7. We ___ some traditional crafts as souvenirs for our friends in London.", options: ["are buying", "is buying", "buy", "buys"], correct: "are buying" },
        { type: 'mcq', question: "8. He ___ resting at the hotel; he is exploring the local night market.", options: ["am not", "aren't", "doesn't", "isn't"], correct: "isn't" },
        { type: 'mcq', question: "9. Which of the following words means \"a detailed plan or route of a journey\"?", options: ["luggage", "itinerary", "souvenir", "accommodation"], correct: "itinerary" },
        { type: 'mcq', question: "10. Shh! The baby ___ in the living room after the long flight.", options: ["sleep", "is sleeping", "sleeps", "are sleeping"], correct: "is sleeping" },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay11, question: "11. What is the main idea of the passage?", options: ["The history of Da Nang city.", "A family currently enjoying a beach holiday.", "How to book a boat trip.", "The best souvenirs to buy in Vietnam."], correct: "A family currently enjoying a beach holiday." },
        { type: 'reading', text: readingTextDay11, question: "12. Where is the Nguyen family staying?", options: ["In a tent.", "In a friend's house.", "In a resort near the beach.", "In a city center hotel."], correct: "In a resort near the beach." },
        { type: 'reading', text: readingTextDay11, question: "13. What is Mr. Nguyen doing at the moment?", options: ["Reading a book.", "Taking photos.", "Swimming in the sea.", "Building a sandcastle."], correct: "Swimming in the sea." },
        { type: 'reading', text: readingTextDay11, question: "14. What is Mrs. Nguyen doing?", options: ["Swimming.", "Relaxing and drinking a fresh coconut.", "Taking photos of the scenery.", "Buying souvenirs."], correct: "Relaxing and drinking a fresh coconut." },
        { type: 'reading', text: readingTextDay11, question: "15. The word \"destination\" in paragraph 1 is closest in meaning to:", options: ["place to go", "food", "ticket", "transport"], correct: "place to go" },
        { type: 'reading', text: readingTextDay11, question: "16. Who is building a sandcastle?", options: ["Mr. Nguyen.", "Mrs. Nguyen.", "Minh.", "Lan."], correct: "Minh." },
        { type: 'reading', text: readingTextDay11, question: "17. The word \"breathtaking\" in paragraph 2 is closest in meaning to:", options: ["very ugly", "very beautiful", "boring", "tiring"], correct: "very beautiful" },
        { type: 'reading', text: readingTextDay11, question: "18. What are they doing tomorrow?", options: ["Going back home.", "Taking a boat trip.", "Visiting a museum.", "Buying a new car."], correct: "Taking a boat trip." },
        { type: 'reading', text: readingTextDay11, question: "19. The word \"itinerary\" in paragraph 3 refers to:", options: ["A plan of a journey.", "A type of boat.", "A hotel room.", "A local food."], correct: "A plan of a journey." },
        { type: 'reading', text: readingTextDay11, question: "20. Which of the following statements is NOT true?", options: ["The weather in Da Nang is fantastic now.", "Lan is taking photos of the scenery.", "Mrs. Nguyen is planning to buy souvenirs for her children.", "They have already booked the tickets for the boat trip."], correct: "Mrs. Nguyen is planning to buy souvenirs for her children." },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: "21. Sắp xếp các từ sau: The / tour guide / is / taking / photos / at / the / moment / .", correct: "The tour guide is taking photos at the moment." },
        { type: 'writing', question: "22. Sắp xếp các từ sau: They / are / flying / to / Paris / tomorrow / morning / .", correct: "They are flying to Paris tomorrow morning." },
        { type: 'writing', question: "23. Sắp xếp các từ sau: Are / you / packing / your / luggage / ?", correct: "Are you packing your luggage?" },
        { type: 'writing', question: "24. Sắp xếp các từ sau: We / are / looking / for / accommodation / on / the / Internet / .", correct: "We are looking for accommodation on the Internet." },
        { type: 'writing', question: "25. Sắp xếp các từ sau: She / is / buying / a / few / souvenirs / for / her / friends / .", correct: "She is buying a few souvenirs for her friends." }
      ];
    }
    // ==========================================
    // NGÀY 12: MAJOR TEST (BÀI KIỂM TRA LỚN 40 CÂU)
    // ==========================================
    if (i === 12) {
      dayData.isTest = true;
      dayData.videoUrl = null; 
      dayData.requiredScore = 40; // Đề thi thực tế có 40 câu [cite: 1114]
      dayData.vocabulary = []; 

      // Dữ liệu văn bản chung cho bài đọc hiểu [cite: 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280]
      const readingTextDay12 = "Green Living and Eco-tourism are becoming very popular nowadays. Eco-tourism means traveling responsibly to natural areas. It protects the environment and improves the lives of local people. Unlike traditional tourism, eco-tourism focuses on preserving nature and reducing carbon footprints.\n\nRight now, many tourists are choosing to visit national parks instead of crowded metropolitan cities. They are exploring breathtaking landscapes and learning about wildlife. While visiting these places, they don't use single-use plastic bags or bottles because plastic waste takes hundreds of years to decompose. Instead, they always bring reusable bags. Furthermore, tourists also support the local community by eating traditional dishes and buying local handicrafts as souvenirs.\n\nBy making small changes in our travel habits, we can enjoy beautiful destinations without harming the Earth. Every small action counts towards a greener future.";
      
      // Dữ liệu văn bản chung cho bài đọc điền từ [cite: 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1350]
      const clozeTextDay12 = "Nowadays, artificial intelligence (AI) (33) ___ changing how we stay healthy. Many teenagers are using smartphone applications to track their daily routines and diets. For example, an app can remind you to drink enough water every day. If you (34) ___ eat enough fresh fruits and vegetables, it automatically suggests healthy recipes. Right now, millions of users (35) ___ downloading these smart tools to avoid obesity. A balanced mix of proteins and vitamins is (36) ___ for your health. Thanks to technology, adopting a green and healthy lifestyle is becoming very (37) ___.";

      dayData.exercises = [
        // I. BIỂN BÁO & THÔNG BÁO [cite: 1120]
        { type: 'reading', text: "NOTICE\n- Use Reusable Bags.\n- Say NO to Plastic.", question: "1. What does the sign say?", options: ["You must use single-use plastic bags here.", "You are encouraged to bring reusable bags to protect the environment.", "You can buy plastic bags in this place.", "You should throw your plastic bags on the floor."], correct: "You are encouraged to bring reusable bags to protect the environment." }, // [cite: 1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128]
        { type: 'reading', text: "FLIGHT DELAYED\n- Flight VN218 is delayed.\n- Please wait in the lounge.", question: "2. What does this notice say?", options: ["The flight is departing earlier than scheduled.", "Passengers should board the plane immediately.", "The flight is late, and passengers need to wait in the lounge.", "The flight has been canceled permanently."], correct: "The flight is late, and passengers need to wait in the lounge." }, // [cite: 1129, 1130, 1131, 1132, 1133, 1134, 1135, 1136]

        // II. NGỮ ÂM [cite: 1137]
        { type: 'mcq', question: "3. Choose the word whose underlined part differs in pronunciation (ending -s/-es):", options: ["bags", "trees", "habits", "meals"], correct: "habits" }, // [cite: 1138, 1139, 1141]
        { type: 'mcq', question: "4. Choose the word whose underlined part differs in pronunciation (vowel 'a'):", options: ["nature", "plastic", "travel", "baggage"], correct: "nature" }, // [cite: 1139, 1140, 1141, 1143]

        // III. SẮP XẾP ĐOẠN VĂN [cite: 1144]
        { type: 'reading', text: "a. Intelligent tutoring systems can adapt to a student's learning pace.\nb. Artificial Intelligence (AI) has rapidly transformed the way we live and learn.\nc. However, data privacy is still a major concern when using AI.\nd. One of the most significant impacts of AI is in the field of education.\ne. This makes learning highly efficient and provides customized exercises.", question: "5. Choose the correct arrangement to make a meaningful paragraph:", options: ["b - d - a - e - c", "b - a - d - e - c", "d - b - a - e - c", "b - c - d - a - e"], correct: "b - d - a - e - c" }, // [cite: 1146, 1147, 1148, 1149, 1150, 1151, 1154, 1155, 1157]
        { type: 'reading', text: "Dear Mary,\na. Tomorrow, we are taking a boat trip to explore the nearby islands.\nb. Right now, I am relaxing on the beach and drinking a fresh coconut.\nc. I hope you are doing well.\nd. We are having a wonderful summer holiday in Da Nang.\ne. See you when I get back.", question: "6. Choose the correct arrangement to make a meaningful letter:", options: ["d - c - b - a - e", "c - d - b - a - e", "c - b - d - a - e", "d - b - a - c - e"], correct: "c - d - b - a - e" }, // [cite: 1153, 1156, 1158, 1159, 1160, 1161, 1162, 1163, 1164]

        // IV. NGỮ PHÁP & TỪ VỰNG [cite: 1165, 1166]
        { type: 'mcq', question: "7. My parents ___ eat fast food because they want to stay healthy.", options: ["doesn't", "don't", "aren't", "isn't"], correct: "don't" }, // [cite: 1167, 1168, 1169, 1170, 1172, 1175]
        { type: 'mcq', question: "8. ___ your brother eat a lot of vegetables every day?", options: ["Does", "Do", "Is", "Are"], correct: "Does" }, // [cite: 1171, 1173, 1176, 1177, 1178, 1179]
        { type: 'mcq', question: "9. The sun ___ in the east and sets in the west.", options: ["rise", "rising", "rises", "is rising"], correct: "rises" }, // [cite: 1180, 1181, 1182, 1183, 1184, 1185]
        { type: 'mcq', question: "10. Look! The tour guide ___ the flag so we can follow him easily.", options: ["hold", "holds", "is holding", "are holding"], correct: "is holding" }, // [cite: 1186, 1187, 1188, 1189, 1190, 1191]
        { type: 'mcq', question: "11. You should read the instructions ___ before installing this software.", options: ["care", "careful", "careless", "carefully"], correct: "carefully" }, // [cite: 1192, 1193, 1194, 1195, 1196, 1197]
        { type: 'mcq', question: "12. Artificial intelligence is becoming a very ___ tool in modern education.", options: ["use", "useful", "usage", "uselessly"], correct: "useful" }, // [cite: 1198, 1199, 1200, 1203, 1204]
        { type: 'mcq', question: "13. We always use ___ bags at the supermarket to reduce plastic waste.", options: ["reusable", "single-use", "toxic", "polluted"], correct: "reusable" }, // [cite: 1201, 1202, 1205, 1206, 1213]
        { type: 'mcq', question: "14. What does the girl often eat for dinner? - She ___ vegetables and fish.", options: ["eating", "is eating", "eats", "eat"], correct: "eats" }, // [cite: 1207, 1210, 1212, 1214, 1215]
        { type: 'mcq', question: "15. A healthy ___ like an apple or a banana is great between meals.", options: ["destination", "fast food", "snack", "itinerary"], correct: "snack" }, // [cite: 1208, 1209, 1211, 1216, 1217, 1222]
        { type: 'mcq', question: "16. My brother-in-law doesn't drive to work; he always ___ to reduce his carbon footprint.", options: ["cycles", "cycle", "is cycling", "cycling"], correct: "cycles" }, // [cite: 1218, 1219, 1220, 1221, 1223, 1224, 1226]
        { type: 'mcq', question: "17. They ___ to Paris tomorrow morning. They already booked the tickets.", options: ["fly", "flies", "are flying", "flew"], correct: "are flying" }, // [cite: 1225, 1227, 1228, 1229, 1234, 1235]
        { type: 'mcq', question: "18. Before the trip, we checked our ___ carefully to know exactly where we were going.", options: ["luggage", "itinerary", "souvenir", "accommodation"], correct: "itinerary" }, // [cite: 1230, 1231, 1232, 1233, 1237, 1238]

        // V. SẮP XẾP TỪ THÀNH CÂU CHỌN ĐÁP ÁN ĐÚNG [cite: 1239, 1240]
        { type: 'mcq', question: "19. Choose the correct sentence arranged from: We / not / share / flat / city / center /.", options: ["We not share a flat in the city center.", "We don't share a flat in the city center.", "We doesn't share a flat in the city center.", "We aren't share a flat in the city center."], correct: "We don't share a flat in the city center." }, // [cite: 1240, 1241, 1242, 1243, 1244]
        { type: 'mcq', question: "20. Choose the correct sentence arranged from: The / students / plant / trees / park / at the moment /.", options: ["The students plant trees in the park at the moment.", "The students are plant trees in the park at the moment.", "The students are planting trees in the park at the moment.", "The students is planting trees in the park at the moment."], correct: "The students are planting trees in the park at the moment." }, // [cite: 1245, 1246, 1247, 1248, 1249]

        // VI. TÌNH HUỐNG GIAO TIẾP [cite: 1251, 1252]
        { type: 'reading', text: "John and Mary are talking about the upcoming summer.\nJohn: \"I am taking a boat trip to explore Ha Long Bay tomorrow.\"\nMary: \"___\"", question: "21. Choose the best response:", options: ["Have a great trip!", "You're welcome.", "Yes, I do.", "I don't think so."], correct: "Have a great trip!" }, // [cite: 1253, 1254, 1255, 1256, 1258, 1259]

        // VII. VIẾT CÂU TỪ TỪ GỢI Ý CHỌN ĐÁP ÁN ĐÚNG [cite: 1260, 1261]
        { type: 'mcq', question: "22. Make a sentence from: Why / not / you / use / reusable bags / save / environment /?", options: ["Why don't you use reusable bags to save the environment?", "Why doesn't you use reusable bags to save the environment?", "Why do you not use reusable bags save the environment?", "Why aren't you use reusable bags to saving the environment?"], correct: "Why don't you use reusable bags to save the environment?" }, // [cite: 1262, 1263, 1264, 1265, 1266]
        { type: 'mcq', question: "23. Make a sentence from: She / usually / travel / bus / but / she / walk / today /.", options: ["She usually travels by bus, but she walks today.", "She usually travel by bus, but she is walking today.", "She usually travels by bus, but she is walking today.", "She is usually traveling by bus, but she walks today."], correct: "She usually travels by bus, but she is walking today." }, // [cite: 1267, 1268, 1269, 1270, 1271]

        // VIII. ĐỌC HIỂU [cite: 1272]
        { type: 'reading', text: readingTextDay12, question: "24. What is the best title for the passage?", options: ["The Dangers of Plastic Waste", "How to Book a Cheap Flight", "Eco-tourism and Green Habits", "Life in a Metropolitan City"], correct: "Eco-tourism and Green Habits" }, // [cite: 1280, 1281, 1282, 1283, 1284]
        { type: 'reading', text: readingTextDay12, question: "25. According to the passage, eco-tourism focuses on", options: ["building more crowded cities", "preserving nature and reducing carbon footprints", "using single-use plastic bags", "taking long showers in hotels"], correct: "preserving nature and reducing carbon footprints" }, // [cite: 1285, 1286, 1287, 1288, 1289]
        { type: 'reading', text: readingTextDay12, question: "26. What are many tourists doing right now?", options: ["They are staying at home and playing video games.", "They are visiting national parks.", "They are buying plastic bottles.", "They are polluting the environment."], correct: "They are visiting national parks." }, // [cite: 1290, 1291, 1292, 1293, 1294]
        { type: 'reading', text: readingTextDay12, question: "27. The word \"They\" in paragraph 2 refers to", options: ["national parks", "local people", "tourists", "traditional dishes"], correct: "tourists" }, // [cite: 1295, 1297, 1298, 1299, 1305]
        { type: 'reading', text: readingTextDay12, question: "28. Which of the following is NOT true according to the passage?", options: ["Plastic waste takes a very long time to decompose.", "Eco-tourism improves the lives of local people.", "Tourists buy local handicrafts as souvenirs.", "Traditional tourism and eco-tourism are exactly the same."], correct: "Traditional tourism and eco-tourism are exactly the same." }, // [cite: 1300, 1301, 1302, 1303, 1304]

        // IX. TÌM CÂU ĐỒNG NGHĨA [cite: 1306]
        { type: 'mcq', question: "29. \"He never eats fast food.\" is closest in meaning to:", options: ["He doesn't ever eat fast food.", "He is always eating fast food.", "Fast food is his favorite meal.", "He didn't eat fast food yesterday."], correct: "He doesn't ever eat fast food." }, // [cite: 1307, 1308, 1309, 1310, 1311]
        { type: 'mcq', question: "30. \"The flight departs at 8:00 AM tomorrow.\" is closest in meaning to:", options: ["The flight departed at 8:00 AM yesterday.", "The flight is departing at 8:00 AM tomorrow.", "The flight has departed at 8:00 AM tomorrow.", "The flight doesn't depart at 8:00 AM tomorrow."], correct: "The flight is departing at 8:00 AM tomorrow." }, // [cite: 1312, 1313, 1314, 1315, 1316]
        { type: 'mcq', question: "31. \"Plastic bags are extremely harmful to the environment.\" is closest in meaning to:", options: ["Plastic bags protect the environment extremely well.", "The environment benefits a lot from plastic bags.", "Plastic bags cause great harm to the environment.", "There is no harm in using plastic bags for the environment."], correct: "Plastic bags cause great harm to the environment." }, // [cite: 1317, 1318, 1319, 1320, 1321]
        { type: 'mcq', question: "32. \"Water boils at 100 degrees Celsius.\" is closest in meaning to:", options: ["Water is boiling at 100 degrees Celsius right now.", "It is a fact that water boils when it reaches 100 degrees Celsius.", "Water never boils at 100 degrees Celsius.", "Water boiled at 100 degrees Celsius in the past."], correct: "It is a fact that water boils when it reaches 100 degrees Celsius." }, // [cite: 1322, 1323, 1324, 1325, 1326]

        // X. ĐỌC ĐIỀN TỪ [cite: 1327]
        { type: 'reading', text: clozeTextDay12, question: "33. Choose the best word for blank (33):", options: ["is", "are", "do", "does"], correct: "is" }, // [cite: 1335, 1340, 1345, 1351]
        { type: 'reading', text: clozeTextDay12, question: "34. Choose the best word for blank (34):", options: ["doesn't", "don't", "aren't", "isn't"], correct: "don't" }, // [cite: 1336, 1341, 1346, 1352]
        { type: 'reading', text: clozeTextDay12, question: "35. Choose the best word for blank (35):", options: ["is", "are", "do", "have"], correct: "are" }, // [cite: 1337, 1342, 1347, 1353]
        { type: 'reading', text: clozeTextDay12, question: "36. Choose the best word for blank (36):", options: ["harmful", "toxic", "essential", "useless"], correct: "essential" }, // [cite: 1338, 1343, 1348, 1354]
        { type: 'reading', text: clozeTextDay12, question: "37. Choose the best word for blank (37):", options: ["easily", "easy", "ease", "easier"], correct: "easy" }, // [cite: 1339, 1344, 1349, 1355]

        // XI. TRỌNG ÂM [cite: 1356]
        { type: 'mcq', question: "38. Choose the word that differs from the other three in the position of primary stress:", options: ["'tourist", "'luggage", "'planet", "re'sort"], correct: "re'sort" }, // [cite: 1357, 1359, 1361, 1363]
        { type: 'mcq', question: "39. Choose the word that differs from the other three in the position of primary stress:", options: ["a'ttraction", "po'llution", "in'telligent", "'oxygen"], correct: "'oxygen" }, // [cite: 1358, 1360, 1362, 1364]

        // XII. SẮP XẾP HỘI THOẠI [cite: 1365, 1366]
        { type: 'reading', text: "a. Travel Agent: Good morning! How can I help you?\nb. Customer: That sounds great. I'll book it.\nc. Customer: I'm looking for an eco-tour to the national park.\nd. Travel Agent: We have a wonderful 2-day itinerary for that.", question: "40. Choose the correct arrangement to make a meaningful exchange:", options: ["a - c - d - b", "c - a - d - b", "a - d - c - b", "c - b - a - d"], correct: "a - c - d - b" } // [cite: 1368, 1370, 1371, 1372, 1373]
      ];
    }
    if (i === 13) {
      dayData.videoUrl = "https://drive.google.com/file/d/1CnlRIfvD6xt2MgZmPmzjsoWw__tVS7od/view?usp=sharing";
      
      // Từ vựng trích xuất từ bài học Ngày 13
      dayData.vocabulary = [
        { word: "health", meaning: "sức khỏe" },
        { word: "habit", meaning: "thói quen" },
        { word: "nutrition", meaning: "dinh dưỡng" },
        { word: "disease", meaning: "căn bệnh" },
        { word: "stress", meaning: "căng thẳng" },
        { word: "hobby", meaning: "sở thích" },
        { word: "healthy", meaning: "khỏe mạnh" },
        { word: "energetic", meaning: "năng động" },
        { word: "balanced", meaning: "cân bằng" },
        { word: "relax", meaning: "thư giãn" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay13 = "Hello, my name is Mai. I am 14 years old and I am a 9th-grade student. I have a very healthy lifestyle. Every day, I get up early at 5:30 AM to do morning exercise. Then, I have a big and nutritious breakfast with eggs, whole-grain bread, and a glass of fresh milk. I know that a balanced diet is very important, so I never eat junk food like hamburgers or fried chicken. Instead, I eat a lot of vegetables, fish, and fruit.\n\nBesides my healthy diet, I also have some good hobbies. In my free time, I love reading books and swimming. Reading helps me relax and relieves stress after a long day at school. Swimming keeps my body strong and flexible.\n\nRight now, it is Sunday morning. I am not studying. I am sitting by the pool and reading my favorite comic book. My younger brother, Nam, is swimming in the pool. My parents are preparing a healthy lunch in the kitchen. We are enjoying our weekend peacefully.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: '1. My mother usually ___ yoga in the morning, but today she ___ to the gym.', options: ['does / goes', 'is doing / is going', 'does / is going', 'is doing / goes'], correct: 'does / is going' },
        { type: 'mcq', question: '2. You should eat more fresh fruit and vegetables to stay ___.', options: ['health', 'healthy', 'unhealthy', 'carefully'], correct: 'healthy' },
        { type: 'mcq', question: '3. Shh! The baby ___ in the bedroom right now.', options: ['sleep', 'is sleeping', 'sleeps', 'are sleeping'], correct: 'is sleeping' },
        { type: 'mcq', question: '4. I ___ to drink a cup of orange juice at the moment.', options: ['want', 'wants', 'am wanting', 'are wanting'], correct: 'want' },
        { type: 'mcq', question: '5. A ___ diet is very important for teenagers to grow up properly.', options: ['balance', 'balancing', 'balanced', 'unbalance'], correct: 'balanced' },
        { type: 'mcq', question: '6. Listen! The birds ___ beautifully in the garden.', options: ['sing', 'sings', 'are singing', 'is singing'], correct: 'are singing' },
        { type: 'mcq', question: '7. Doing morning ___ every day helps you relieve stress and feel energetic.', options: ['homework', 'exercise', 'chores', 'shopping'], correct: 'exercise' },
        { type: 'mcq', question: '8. ___ you ___ your teeth twice a day?', options: ['Do / brush', 'Does / brush', 'Are / brushing', 'Is / brushing'], correct: 'Do / brush' },
        { type: 'mcq', question: '9. They never ___ fast food because it causes obesity.', options: ['eat', 'eats', 'are eating', 'eating'], correct: 'eat' },
        { type: 'mcq', question: '10. Look at Peter! He ___ basketball with his friends in the school yard.', options: ['plays', 'play', 'are playing', 'is playing'], correct: 'is playing' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay13, question: '11. What is the main idea of the passage?', options: ["Mai's school life.", "Mai's healthy lifestyle and hobbies.", 'How to cook a healthy breakfast.', 'The dangers of eating fast food.'], correct: "Mai's healthy lifestyle and hobbies." },
        { type: 'reading', text: readingTextDay13, question: '12. What time does Mai usually get up?', options: ['At 5:30 AM.', 'At 6:00 AM.', 'At 6:30 AM.', 'She gets up late.'], correct: 'At 5:30 AM.' },
        { type: 'reading', text: readingTextDay13, question: '13. What does Mai have for her breakfast?', options: ['Hamburger and fried chicken.', 'Eggs, bread, and milk.', 'Fish and vegetables.', 'Just a glass of water.'], correct: 'Eggs, bread, and milk.' },
        { type: 'reading', text: readingTextDay13, question: '14. Why does Mai NEVER eat junk food?', options: ['Because it is expensive.', "Because she doesn't like the taste.", 'Because she knows a balanced diet is important.', "Because her parents don't allow it."], correct: 'Because she knows a balanced diet is important.' },
        { type: 'reading', text: readingTextDay13, question: "15. What are Mai's hobbies?", options: ['Watching TV and sleeping.', 'Reading books and swimming.', 'Cooking and playing games.', 'Eating and hanging out.'], correct: 'Reading books and swimming.' },
        { type: 'reading', text: readingTextDay13, question: '16. According to the passage, what does reading help Mai do?', options: ['Keep her body strong.', 'Pass her exams.', 'Relax and relieve stress.', 'Make new friends.'], correct: 'Relax and relieve stress.' },
        { type: 'reading', text: readingTextDay13, question: '17. What is Mai doing right now?', options: ['She is studying.', 'She is swimming in the pool.', 'She is cooking in the kitchen.', 'She is sitting by the pool and reading.'], correct: 'She is sitting by the pool and reading.' },
        { type: 'reading', text: readingTextDay13, question: '18. Who is swimming in the pool at the moment?', options: ['Mai.', 'Nam.', "Mai's parents.", "Mai's friends."], correct: 'Nam.' },
        { type: 'reading', text: readingTextDay13, question: "19. Where are Mai's parents right now?", options: ['By the pool.', 'In the kitchen.', 'At the supermarket.', 'In the living room.'], correct: 'In the kitchen.' },
        { type: 'reading', text: readingTextDay13, question: '20. Which of the following statements is NOT true about Mai?', options: ['She is a 9th-grade student.', 'She avoids junk food.', 'She eats a lot of vegetables and fruit.', 'She is studying hard on Sunday morning.'], correct: 'She is studying hard on Sunday morning.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: usually / morning / do / exercise / I / the / in / .', correct: 'I usually do exercise in the morning.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: is / an / right / reading / now / book / She / interesting / .', correct: 'She is reading an interesting book right now.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: important / a / diet / have / to / is / balanced / It / .', correct: 'It is important to have a balanced diet.' },
        { type: 'writing', question: '24. Sắp xếp các từ sau: fast / you / eat / food / shouldn\'t / often / very / .', correct: 'You shouldn\'t eat fast food very often.' },
        { type: 'writing', question: '25. Sắp xếp các từ sau: playing / They / the / sports / are / at / park / moment / the / in / .', correct: 'They are playing sports in the park at the moment.' }
      ];
    }
    if (i === 14) {
      dayData.videoUrl = "https://drive.google.com/file/d/1CjZ7W9P2SPHiF7D_7sXv5xiA-h1xPOvG/view?usp=sharing";
      
      // Từ vựng trích xuất từ bài học Ngày 14
      dayData.vocabulary = [
        { word: "memory", meaning: "kỉ niệm" },
        { word: "childhood", meaning: "tuổi thơ" },
        { word: "festival", meaning: "lễ hội" },
        { word: "tradition", meaning: "truyền thống" },
        { word: "custom", meaning: "phong tục" },
        { word: "lantern", meaning: "đèn lồng" },
        { word: "costume", meaning: "trang phục" },
        { word: "parade", meaning: "cuộc diễu hành / diễu hành" },
        { word: "firework", meaning: "pháo hoa" },
        { word: "celebrate", meaning: "ăn mừng / kỷ niệm" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay14 = "The Mid-Autumn Festival is a popular traditional festival in Vietnam. It is usually celebrated on the 15th day of the 8th lunar month. Last year. I celebrated this meaningful event with my grandparents in the countryside. It was a wonderful time.\n\nA few days before the festival, my grandparents decorated the house with colorful star lanterns. My mother bought a lot of mooncakes, which are the special and traditional cakes for this event. There were many flavors, but my favorite was the green bean mooncake.\n\nIn the evening of the festival, my cousins and I wore funny masks and paraded along the village roads with our lanterns. We watched a fascinating lion dance performance by the local young people. The sound of the drums was very loud and exciting. After the parade, we went back home, sat together in the yard, and enjoyed the delicious mooncakes under the bright full moon.\n\nIt was a very memorable experience for me. I didn't play any modern video games that night, but I felt extremely happy because I learned more about our cultural traditions and spent quality time with my beloved family.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: '1. Last year, my family ___ to Da Nang to enjoy the International Fireworks Festival.', options: ['go', 'went', 'is going', 'goes'], correct: 'went' },
        { type: 'mcq', question: '2. ___ you participate in the Mid-Autumn Festival parade last night?', options: ['Do', 'Did', 'Are', 'Does'], correct: 'Did' },
        { type: 'mcq', question: '3. They ___ their house with beautiful flowers and colorful lanterns two days ago.', options: ['decorate', 'decorated', 'decorating', 'decorates'], correct: 'decorated' },
        { type: 'mcq', question: '4. I ___ eat any mooncakes at the festival because I don\'t like sweet food.', options: ['didn\'t', 'wasn\'t', 'am not', 'don\'t'], correct: 'didn\'t' },
        { type: 'mcq', question: '5. People usually wear traditional ___ when they join this local festival.', options: ['fireworks', 'costumes', 'lanterns', 'parades'], correct: 'costumes' },
        { type: 'mcq', question: '6. My grandfather ___ me a story about the Lunar New Year when I was a child.', options: ['tell', 'told', 'tells', 'telling'], correct: 'told' },
        { type: 'mcq', question: '7. We watched an exciting lion dance ___ in the center of the village yesterday.', options: ['perform', 'performance', 'performing', 'performs'], correct: 'performance' },
        { type: 'mcq', question: '8. What did she ___ at the supermarket for the party last weekend?', options: ['buy', 'bought', 'buys', 'buying'], correct: 'buy' },
        { type: 'mcq', question: '9. Vietnamese people often ___ family members during the Tet holiday.', options: ['gathers', 'gathering', 'gather with', 'gather'], correct: 'gather' }, // Theo đề gốc đáp án là D (gather) dù có option C (gather with), tôi giữ theo đáp án đúng của bạn là 'gather' nhưng thực tế tiếng Anh thường dùng 'gather with'. Đề bài gốc ở câu 9 đáp án D là 'gather'[cite: 2].
        { type: 'mcq', question: '10. Last summer, we ___ a lot of fun at the music festival.', options: ['have', 'had', 'has', 'having'], correct: 'had' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay14, question: '11. What is the main idea of the passage?', options: ['The history of mooncakes.', 'An unforgettable Mid-Autumn Festival experience.', 'How to make a star lantern.', 'The danger of playing video games.'], correct: 'An unforgettable Mid-Autumn Festival experience.' },
        { type: 'reading', text: readingTextDay14, question: '12. When is the Mid-Autumn Festival celebrated?', options: ['In the middle of August.', 'On the 15th day of the 8th lunar month.', 'In the first day of the Lunar New Year.', 'Every weekend in autumn.'], correct: 'On the 15th day of the 8th lunar month.' },
        { type: 'reading', text: readingTextDay14, question: '13. Where did the author celebrate the festival last year?', options: ['In a big city.', 'At the school.', 'In the countryside.', 'In a foreign country.'], correct: 'In the countryside.' },
        { type: 'reading', text: readingTextDay14, question: '14. What did the grandparents do to prepare for the festival?', options: ['They bought mooncakes.', 'They decorated the house with star lanterns.', 'They made funny masks.', 'They performed a lion dance.'], correct: 'They decorated the house with star lanterns.' },
        { type: 'reading', text: readingTextDay14, question: '15. What kind of mooncake did the author like best?', options: ['Chocolate mooncake.', 'Meat mooncake.', 'Green bean mooncake.', 'Fruit mooncake.'], correct: 'Green bean mooncake.' },
        { type: 'reading', text: readingTextDay14, question: '16. What did the children carry during the parade?', options: ['Mooncakes.', 'Drums.', 'Flowers.', 'Star lanterns.'], correct: 'Star lanterns.' },
        { type: 'reading', text: readingTextDay14, question: '17. Who performed the lion dance?', options: ['The local young people.', "The author's cousins.", 'The grandparents.', 'Famous actors.'], correct: 'The local young people.' },
        { type: 'reading', text: readingTextDay14, question: '18. Where did the family enjoy the mooncakes?', options: ['In the living room.', 'Under the bright full moon in the yard.', 'Along the village roads.', 'In a restaurant.'], correct: 'Under the bright full moon in the yard.' },
        { type: 'reading', text: readingTextDay14, question: '19. Did the author play video games that night?', options: ['Yes, he played with his cousins.', 'Yes, he played on his smartphone.', 'No, he didn\'t.', 'The passage doesn\'t mention it.'], correct: 'No, he didn\'t.' },
        { type: 'reading', text: readingTextDay14, question: '20. Why was the experience memorable for the author?', options: ['Because he got a lot of lucky money.', 'Because he ate too many cakes.', 'Because he traveled to a new country.', 'Because he learned about cultural traditions and spent time with family.'], correct: 'Because he learned about cultural traditions and spent time with family.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: Hanoi / year / My / family / celebrated / Tet / in / last / .', correct: 'My family celebrated Tet in Hanoi last year.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: yesterday / display / We / didn\'t / fireworks / watch / the / .', correct: 'We didn\'t watch the fireworks display yesterday.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: festival / you / eat / mooncakes / the / at / Did / ?', correct: 'Did you eat mooncakes at the festival?' },
        { type: 'writing', question: '24. Sắp xếp các từ sau: house / They / many / flowers / with / their / decorated / .', correct: 'They decorated their house with many flowers.' },
        { type: 'writing', question: '25. Sắp xếp các từ sau: parade / costumes / People / traditional / the / wore / during / .', correct: 'People wore traditional costumes during the parade.' }
      ];
    }
    if (i === 15) {
      dayData.videoUrl = "https://drive.google.com/file/d/1tt0ufDsBSDlJxQ4mXdBLwbFKR5m6Lskm/view?usp=drive_link";
      
      // Từ vựng trích xuất từ bài học Ngày 15
      dayData.vocabulary = [
        { word: "robot", meaning: "người máy" },
        { word: "smart home", meaning: "nhà thông minh" },
        { word: "planet", meaning: "hành tinh" },
        { word: "invention", meaning: "phát minh" },
        { word: "machine", meaning: "máy móc" },
        { word: "discover", meaning: "khám phá" },
        { word: "explore", meaning: "thám hiểm" },
        { word: "control", meaning: "điều khiển" },
        { word: "advanced", meaning: "tiên tiến" },
        { word: "eco-friendly", meaning: "thân thiện với môi trường" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay15 = "What will our cities look like in fifty years? Many experts predict that life in the future will be very different from today. First of all, cities will be much larger and more crowded, so architects will build taller skyscrapers. These buildings will act like \"vertical cities\" where people can live, work, and shop without leaving the building.\n\nTransportation will also change significantly. Traffic jams will probably disappear because people will use flying cars and high-speed underground trains. Furthermore, these modern vehicles will be eco-friendly and run on solar energy instead of petrol, which will help reduce air pollution.\n\nAt home, smart technology will take care of our daily needs. Robots will do the housework such as cooking, cleaning, and washing clothes. We will be able to control all the appliances in our houses just by using our voices. For instance, you will just say \"turn on the TV\" or \"make a cup of coffee,\" and the smart home will do it for you.\n\nAlthough there are some worries that robots might replace human workers, most scientists believe that these advanced technologies will give us more free time to enjoy our lives and explore new hobbies.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: '1. I think people ___ in flying cars in the year 2050.', options: ['will travel', 'travel', 'travels', 'traveled'], correct: 'will travel' },
        { type: 'mcq', question: '2. A: "I don\'t understand this math problem." B: "Don\'t worry, I ___ you."', options: ['helps', 'will help', 'helped', 'am helping'], correct: 'will help' },
        { type: 'mcq', question: '3. Scientists hope that they ___ new planets like Earth soon.', options: ['will discover', 'discover', 'are discovering', 'discovering'], correct: 'will discover' },
        { type: 'mcq', question: '4. Many manual jobs will be ___ by robots in the future.', options: ['replaced', 'replacedly', 'replace', 'replacing'], correct: 'replaced' },
        { type: 'mcq', question: '5. I promise I ___ anyone your secret.', options: ['will tell', 'tell', 'won\'t tell', 'didn\'t tell'], correct: 'won\'t tell' },
        { type: 'mcq', question: '6. In the future, we might live in ___ homes that can control temperature automatically.', options: ['smart', 'traditional', 'poor', 'old'], correct: 'smart' },
        { type: 'mcq', question: '7. ___ robots do all the housework for us next century?', options: ['Do', 'Will', 'Are', 'Have'], correct: 'Will' },
        { type: 'mcq', question: '8. My brother ___ fifteen years old next month.', options: ['was', 'will be', 'is being', 'be'], correct: 'will be' },
        { type: 'mcq', question: '9. They ___ to Mars because it is too far and dangerous.', options: ['won\'t travel', 'will travel', 'don\'t travel', 'travel'], correct: 'won\'t travel' },
        { type: 'mcq', question: '10. Modern machines and advanced ___ will make our lives easier.', options: ['space', 'diseases', 'technology', 'planets'], correct: 'technology' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay15, question: '11. What is the main idea of the passage?', options: ['How to build tall skyscrapers.', 'Life and cities in the future.', 'The history of flying cars.', 'How to make eco-friendly cars.'], correct: 'Life and cities in the future.' },
        { type: 'reading', text: readingTextDay15, question: '12. According to paragraph 1, what is a "vertical city"?', options: ['A very small village.', 'A flying car.', 'A tall skyscraper where people live, work, and shop.', 'An underground train.'], correct: 'A tall skyscraper where people live, work, and shop.' },
        { type: 'reading', text: readingTextDay15, question: '13. Why will architects build taller skyscrapers?', options: ['Because people like tall buildings.', 'Because the air is cleaner up there.', 'Because cities will be larger and more crowded.', 'Because robots will build them quickly.'], correct: 'Because cities will be larger and more crowded.' },
        { type: 'reading', text: readingTextDay15, question: '14. According to paragraph 2, what will help traffic jams disappear?', options: ['Walking to work.', 'Using traditional cars.', 'Riding bicycles.', 'Using flying cars and high-speed trains.'], correct: 'Using flying cars and high-speed trains.' },
        { type: 'reading', text: readingTextDay15, question: '15. What kind of energy will future vehicles run on?', options: ['Petrol', 'Solar energy', 'Wind energy', 'Coal'], correct: 'Solar energy' },
        { type: 'reading', text: readingTextDay15, question: '16. The word "it" in paragraph 3 refers to', options: ['a cup of coffee', 'turning on the TV', 'the voice command', 'the requested action (turn on TV/make coffee)'], correct: 'the requested action (turn on TV/make coffee)' },
        { type: 'reading', text: readingTextDay15, question: '17. Who or what will do the housework in the future?', options: ['Scientists', 'Architects', 'Robots', 'Children'], correct: 'Robots' },
        { type: 'reading', text: readingTextDay15, question: '18. How will people control the appliances in their houses?', options: ['By clapping their hands.', 'By using remote controls.', 'By pressing buttons.', 'By using their voices.'], correct: 'By using their voices.' },
        { type: 'reading', text: readingTextDay15, question: '19. What is a common worry mentioned in the last paragraph?', options: ['People will not have free time.', 'Flying cars will be dangerous.', 'Robots might replace human workers.', 'Cities will be too cold.'], correct: 'Robots might replace human workers.' },
        { type: 'reading', text: readingTextDay15, question: '20. What do most scientists believe about advanced technologies?', options: ['They will give humans more free time.', 'They will destroy the Earth.', 'They will create more traffic jams.', 'They will make life more difficult.'], correct: 'They will give humans more free time.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: live / smart / People / homes / will / in / .', correct: 'People will live in smart homes.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: our / robots / think / housework / I / do / will / .', correct: 'I think robots will do our housework.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: morning / do / What / you / will / tomorrow / ?', correct: 'What will you do tomorrow morning?' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: traditional / by / won't / cars / We / travel / .", correct: "We won't travel by traditional cars." },
        { type: 'writing', question: '25. Sắp xếp các từ sau: new / we / will / discover / planets / I / hope / .', correct: 'I hope we will discover new planets.' }
      ];
    }
if (i === 16) {
      dayData.videoUrl = "https://drive.google.com/file/d/1P23t9Uiv09QTYk5mup3Yl7sfACdKlHI4/view?usp=drive_link";
      
      // Từ vựng trích xuất và mở rộng cho bài học Ngày 16 (Quá khứ tiếp diễn & Thảm họa thiên nhiên)
      dayData.vocabulary = [
        { word: "earthquake", meaning: "trận động đất" },
        { word: "storm", meaning: "cơn bão" },
        { word: "typhoon", meaning: "bão nhiệt đới" },
        { word: "erupt", meaning: "phun trào (núi lửa)" },
        { word: "rescue", meaning: "giải cứu" },
        { word: "shelter", meaning: "nơi trú ẩn" },
        { word: "damage", meaning: "thiệt hại" },
        { word: "destroy", meaning: "phá hủy" },
        { word: "survivor", meaning: "người sống sót" },
        { word: "safely", meaning: "một cách an toàn" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay16 = "Last weekend, a terrible storm hit our town. It was Saturday evening, and my family was doing different things at home. I was reading a book in my bedroom while my sister was listening to music. My parents were preparing dinner in the kitchen. Suddenly, the lights went out, and we heard a loud noise outside.\n\nMy father looked out the window and saw that the strong wind was blowing down the trees. It was raining heavily. We were feeling very scared. My mother quickly found some candles and a flashlight. We sat together in the living room and waited for the storm to stop.\n\nWhile we were sitting in the dark, we heard the sound of a police car. They were driving around the neighborhood to check if everyone was safe. Fortunately, our house was not damaged, but many trees in the park were destroyed. The rescue teams worked all night to help the town. It was an unforgettable experience.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: '1. I ___ TV when the phone rang.', options: ['was watching', 'am watching', 'watched', 'were watching'], correct: 'was watching' },
        { type: 'mcq', question: '2. While we ___ dinner, it started to rain heavily.', options: ['have', 'had', 'are having', 'were having'], correct: 'were having' },
        { type: 'mcq', question: '3. She ___ a book at 8 PM yesterday.', options: ['is reading', 'was reading', 'read', 'reads'], correct: 'was reading' },
        { type: 'mcq', question: '4. What ___ you ___ when the earthquake happened?', options: ['did / do', 'do / do', 'were / doing', 'are / doing'], correct: 'were / doing' },
        { type: 'mcq', question: '5. They ___ football when it suddenly snowed.', options: ['played', 'were playing', 'are playing', 'play'], correct: 'were playing' },
        { type: 'mcq', question: '6. While the teacher was explaining, the students ___ carefully.', options: ['was listening', 'are listening', 'were listening', 'listened'], correct: 'were listening' },
        { type: 'mcq', question: '7. The wind ___ strongly when we stepped out of the house.', options: ['is blowing', 'blows', 'were blowing', 'was blowing'], correct: 'was blowing' },
        { type: 'mcq', question: '8. My mother ___ dinner while my father was reading the newspaper.', options: ['prepared', 'was preparing', 'is preparing', 'prepares'], correct: 'was preparing' },
        { type: 'mcq', question: '9. ___ he ___ along the street when he saw the accident?', options: ['Was / walking', 'Is / walking', 'Did / walk', 'Were / walking'], correct: 'Was / walking' },
        { type: 'mcq', question: '10. The rescue team ___ people when the building collapsed.', options: ['was helping', 'helps', 'is helping', 'were helping'], correct: 'was helping' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay16, question: '11. What is the main idea of the passage?', options: ['A family’s experience during a terrible storm.', 'How to prepare for an earthquake.', 'The history of a town.', 'A fun weekend at the park.'], correct: 'A family’s experience during a terrible storm.' },
        { type: 'reading', text: readingTextDay16, question: '12. When did the storm hit the town?', options: ['Last Sunday morning.', 'Last Saturday evening.', 'Yesterday afternoon.', 'Last Friday night.'], correct: 'Last Saturday evening.' },
        { type: 'reading', text: readingTextDay16, question: '13. What was the writer doing when the lights went out?', options: ['Listening to music.', 'Preparing dinner.', 'Reading a book.', 'Sleeping.'], correct: 'Reading a book.' },
        { type: 'reading', text: readingTextDay16, question: '14. What were the parents doing at that time?', options: ['Reading books.', 'Listening to music.', 'Looking out the window.', 'Preparing dinner in the kitchen.'], correct: 'Preparing dinner in the kitchen.' },
        { type: 'reading', text: readingTextDay16, question: '15. What did the father see when he looked out the window?', options: ['A police car.', 'The strong wind blowing down trees.', 'People running in the street.', 'A collapsed building.'], correct: 'The strong wind blowing down trees.' },
        { type: 'reading', text: readingTextDay16, question: '16. How did the family feel during the storm?', options: ['Happy.', 'Excited.', 'Scared.', 'Bored.'], correct: 'Scared.' },
        { type: 'reading', text: readingTextDay16, question: '17. What did the mother quickly find?', options: ['Some food and water.', 'Some candles and a flashlight.', 'A radio and batteries.', 'Warm clothes.'], correct: 'Some candles and a flashlight.' },
        { type: 'reading', text: readingTextDay16, question: '18. Who was driving around the neighborhood to check on people?', options: ['The rescue team.', 'The police.', 'The neighbors.', 'The parents.'], correct: 'The police.' },
        { type: 'reading', text: readingTextDay16, question: '19. Was the writer’s house damaged by the storm?', options: ['Yes, it was completely destroyed.', 'Yes, but only a little.', 'No, it was not damaged.', 'The passage doesn’t mention it.'], correct: 'No, it was not damaged.' },
        { type: 'reading', text: readingTextDay16, question: '20. What was destroyed during the storm?', options: ['Many trees in the park.', 'The police car.', 'The living room.', 'The writer’s bedroom.'], correct: 'Many trees in the park.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: watching / I / TV / yesterday / was / 8 PM / at / .', correct: 'I was watching TV at 8 PM yesterday.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: playing / They / when / started / were / tennis / rain / to / it / .', correct: 'They were playing tennis when it started to rain.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: preparing / mother / dinner / My / while / was / reading / my / father / was / .', correct: 'My mother was preparing dinner while my father was reading.' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: not / We / were / sleeping / the / when / happened / earthquake / .", correct: "We were not sleeping when the earthquake happened." },
        { type: 'writing', question: '25. Sắp xếp các từ sau: doing / What / you / yesterday / were / evening / ?', correct: 'What were you doing yesterday evening?' }
      ];
    }
    if (i === 17) {
      dayData.videoUrl = "https://drive.google.com/file/d/1r4BmbDxiOQba86ay0Cz3-xyivsL516iU/view?usp=drive_link";
      
      // Từ vựng trích xuất và mở rộng cho bài học Ngày 17 (Hiện tại hoàn thành & Trải nghiệm du lịch)
      dayData.vocabulary = [
        { word: "experience", meaning: "trải nghiệm, kinh nghiệm" },
        { word: "abroad", meaning: "ở nước ngoài" },
        { word: "destination", meaning: "điểm đến" },
        { word: "luggage", meaning: "hành lý" },
        { word: "explore", meaning: "khám phá" },
        { word: "culture", meaning: "văn hóa" },
        { word: "traditional", meaning: "truyền thống" },
        { word: "unforgettable", meaning: "không thể nào quên" },
        { word: "book (a ticket/trip)", meaning: "đặt (vé/chuyến đi)" },
        { word: "delicious", meaning: "ngon miệng" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay17 = "My name is Anna, and I love traveling. So far, I have visited three different countries with my family. We have been to Japan, South Korea, and Thailand. During these trips, I have tried many delicious traditional foods, such as sushi and kimchi. However, I have never eaten extremely spicy food because my stomach is quite sensitive.\n\nMy parents have already booked our next trip for the summer holiday. We have planned to visit Europe for the first time. We are going to explore France and Italy. I haven't packed my luggage yet because there are still two weeks left, but I am very excited. I have already bought a new camera to take beautiful photos.\n\nTraveling has taught me a lot about different cultures and has given me unforgettable experiences. I have made some international friends online, and we have kept in touch since last year. Have you ever traveled abroad? It is truly a wonderful way to learn about the world.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) ---
        { type: 'mcq', question: '1. I ___ to Paris three times in my life.', options: ['have been', 'has been', 'was', 'am'], correct: 'have been' },
        { type: 'mcq', question: '2. She ___ her homework yet.', options: ['has finished', 'haven\'t finished', 'hasn\'t finished', 'finished'], correct: 'hasn\'t finished' },
        { type: 'mcq', question: '3. They have lived in this city ___ 2015.', options: ['since', 'for', 'in', 'ago'], correct: 'since' },
        { type: 'mcq', question: '4. ___ you ever ___ sushi?', options: ['Do / eat', 'Have / eaten', 'Did / eat', 'Are / eating'], correct: 'Have / eaten' },
        { type: 'mcq', question: '5. We have known each other ___ five years.', options: ['since', 'for', 'during', 'in'], correct: 'for' },
        { type: 'mcq', question: '6. My father ___ just ___ a new car.', options: ['have / bought', 'has / buy', 'has / bought', 'did / buy'], correct: 'has / bought' },
        { type: 'mcq', question: '7. Hurry up! The train ___ already ___.', options: ['have / left', 'has / left', 'has / leave', 'did / leave'], correct: 'has / left' },
        { type: 'mcq', question: '8. I have ___ seen that movie. I don\'t know what it is about.', options: ['ever', 'never', 'already', 'just'], correct: 'never' },
        { type: 'mcq', question: '9. He ___ his keys, so he can\'t open the door now.', options: ['lost', 'loses', 'has lost', 'have lost'], correct: 'has lost' },
        { type: 'mcq', question: '10. How long ___ you ___ English?', options: ['have / studied', 'do / study', 'has / studied', 'did / study'], correct: 'have / studied' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay17, question: '11. What is the main idea of the passage?', options: ['Anna\'s problems with spicy food.', 'How to book a trip to Europe.', 'Anna\'s travel experiences and future plans.', 'The history of traditional foods.'], correct: 'Anna\'s travel experiences and future plans.' },
        { type: 'reading', text: readingTextDay17, question: '12. How many countries has Anna visited so far?', options: ['One', 'Two', 'Three', 'Four'], correct: 'Three' },
        { type: 'reading', text: readingTextDay17, question: '13. Which countries has Anna been to?', options: ['Japan, South Korea, and Thailand.', 'France and Italy.', 'Japan, China, and Thailand.', 'South Korea, France, and Italy.'], correct: 'Japan, South Korea, and Thailand.' },
        { type: 'reading', text: readingTextDay17, question: '14. What has Anna tried during her trips?', options: ['Spicy food.', 'Delicious traditional foods.', 'Fast food.', 'European food.'], correct: 'Delicious traditional foods.' },
        { type: 'reading', text: readingTextDay17, question: '15. Why has she never eaten extremely spicy food?', options: ['Because she doesn\'t have money.', 'Because she hates the smell.', 'Because her stomach is sensitive.', 'Because her parents don\'t allow it.'], correct: 'Because her stomach is sensitive.' },
        { type: 'reading', text: readingTextDay17, question: '16. What have her parents already done?', options: ['They have packed the luggage.', 'They have booked the next trip.', 'They have bought a new camera.', 'They have visited Europe.'], correct: 'They have booked the next trip.' },
        { type: 'reading', text: readingTextDay17, question: '17. Where have they planned to visit for their next trip?', options: ['Japan and Thailand.', 'France and Italy.', 'South Korea and China.', 'America.'], correct: 'France and Italy.' },
        { type: 'reading', text: readingTextDay17, question: '18. Has Anna packed her luggage yet?', options: ['Yes, she has.', 'No, she hasn\'t.', 'She packed it yesterday.', 'The passage doesn\'t mention.'], correct: 'No, she hasn\'t.' },
        { type: 'reading', text: readingTextDay17, question: '19. What has Anna bought for the upcoming trip?', options: ['A new bag.', 'Some traditional food.', 'A new camera.', 'A new smartphone.'], correct: 'A new camera.' },
        { type: 'reading', text: readingTextDay17, question: '20. What has traveling taught Anna?', options: ['How to speak French.', 'A lot about different cultures.', 'How to cook sushi.', 'How to book cheap flights.'], correct: 'A lot about different cultures.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: have / visited / I / London / never / .', correct: 'I have never visited London.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: lived / She / has / here / 2010 / since / .', correct: 'She has lived here since 2010.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: Have / ever / eaten / you / food / Japanese / ?', correct: 'Have you ever eaten Japanese food?' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: just / They / have / their / finished / homework / .", correct: "They have just finished their homework." },
        { type: 'writing', question: '25. Sắp xếp các từ sau: not / We / bought / the / tickets / have / yet / .', correct: 'We have not bought the tickets yet.' }
      ];
    }
    if (i === 18) {
      dayData.isTest = true;
      dayData.videoUrl = null; 
      dayData.requiredScore = 40; // Đề thi thực tế có 40 câu
      dayData.vocabulary = []; 

      // Dữ liệu văn bản chung cho bài đọc hiểu
      const readingTextDay18 = "Last summer, our school organized a volunteer trip to a remote village. While we were traveling on the bus, we saw many beautiful landscapes. When we arrived, the local people were waiting for us. Over the past year, our school has built a new library for the children there. Currently, we are collecting more books to send to them. We usually organize these charity events twice a year. I have participated in many campaigns, but this one was the most memorable. By helping others, we learn to appreciate our lives more.";
      
      // Dữ liệu văn bản chung cho bài đọc điền từ
      const clozeTextDay18 = "Space exploration has always been a fascinating topic. In 1969, Neil Armstrong (33) ___ on the moon. Since then, technology (34) ___ significantly. Currently, scientists (35) ___ a new spacecraft to explore Mars. They hope to find signs of water there. Space missions (36) ___ very expensive, but they provide valuable information about our universe. Right now, many young students (37) ___ to become astronauts in the future.";

      dayData.exercises = [
        // I. BIỂN BÁO & THÔNG BÁO
        { type: 'reading', text: "CAUTION\n- Wet Floor.\n- Please walk slowly.", question: "1. What does the sign say?", options: ["You must run quickly.", "You should be careful because the floor is wet.", "You can swim here.", "You should wash the floor."], correct: "You should be careful because the floor is wet." },
        { type: 'reading', text: "LIBRARY RULES\n- Keep silent.\n- No food or drinks.", question: "2. What does this notice say?", options: ["You can eat and drink here.", "You must speak loudly.", "You must not make noise or eat in the library.", "You can buy food in the library."], correct: "You must not make noise or eat in the library." },

        // II. NGỮ ÂM
        { type: 'mcq', question: "3. Choose the word whose underlined part differs in pronunciation (ending -ed):", options: ["play\u0332e\u0332d\u0332", "listen\u0332e\u0332d\u0332", "watch\u0332e\u0332d\u0332", "clean\u0332e\u0332d\u0332"], correct: "watch\u0332e\u0332d\u0332" },
        { type: 'mcq', question: "4. Choose the word whose underlined part differs in pronunciation (vowel 'a'):", options: ["sp\u0332a\u0332ce", "tr\u0332a\u0332vel", "pl\u0332a\u0332net", "gr\u0332a\u0332vity"], correct: "sp\u0332a\u0332ce" },

        // III. SẮP XẾP ĐOẠN VĂN
        { type: 'reading', text: "a. I was reading a book in my bedroom.\nb. Suddenly, the lights went out.\nc. Last night, I was alone at home.\nd. I felt very scared.\ne. While I was sitting in the dark, I heard a loud noise outside.", question: "5. Choose the correct arrangement to make a meaningful paragraph:", options: ["c - a - b - e - d", "a - b - c - d - e", "c - b - a - d - e", "a - c - b - e - d"], correct: "c - a - b - e - d" },
        { type: 'reading', text: "a. Dear John,\nb. Have you ever been to Paris?\nc. I have just returned from a trip there.\nd. It was an amazing experience!\ne. Best wishes.", question: "6. Choose the correct arrangement to make a meaningful letter:", options: ["a - c - b - d - e", "a - b - c - d - e", "b - a - c - d - e", "a - c - d - b - e"], correct: "a - b - c - d - e" },

        // IV. NGỮ PHÁP & TỪ VỰNG (Hiện tại đơn, Tiếp diễn, Quá khứ đơn, Quá khứ tiếp diễn, Hiện tại hoàn thành)
        { type: 'mcq', question: "7. My father usually ___ coffee in the morning.", options: ["drinks", "is drinking", "drank", "has drunk"], correct: "drinks" },
        { type: 'mcq', question: "8. Look! The children ___ football in the yard.", options: ["play", "played", "are playing", "have played"], correct: "are playing" },
        { type: 'mcq', question: "9. We ___ the national museum two days ago.", options: ["visit", "have visited", "were visiting", "visited"], correct: "visited" },
        { type: 'mcq', question: "10. I ___ my homework when the phone rang yesterday.", options: ["do", "am doing", "was doing", "have done"], correct: "was doing" },
        { type: 'mcq', question: "11. She ___ in this city since 2010.", options: ["lives", "is living", "lived", "has lived"], correct: "has lived" },
        { type: 'mcq', question: "12. They ___ their science project yet.", options: ["don't finish", "didn't finish", "haven't finished", "aren't finishing"], correct: "haven't finished" },
        { type: 'mcq', question: "13. While they ___ in the park, it started to rain heavily.", options: ["walk", "are walking", "walked", "were walking"], correct: "were walking" },
        { type: 'mcq', question: "14. It is a fact that water ___ at 100 degrees Celsius.", options: ["boil", "boils", "is boiling", "boiled"], correct: "boils" },
        { type: 'mcq', question: "15. Neil Armstrong was the first ___ to walk on the moon.", options: ["alien", "planet", "astronaut", "robot"], correct: "astronaut" },
        { type: 'mcq', question: "16. We should use ___ bags instead of plastic ones to protect the environment.", options: ["single-use", "reusable", "toxic", "expensive"], correct: "reusable" },
        { type: 'mcq', question: "17. They decided to donate old clothes and books to the local ___.", options: ["charity", "airport", "laboratory", "grocery"], correct: "charity" },
        { type: 'mcq', question: "18. The plane took off from the ___ exactly on time.", options: ["station", "airport", "harbor", "museum"], correct: "airport" },

        // V. SẮP XẾP TỪ THÀNH CÂU CHỌN ĐÁP ÁN ĐÚNG
        { type: 'mcq', question: "19. Choose the correct sentence arranged from: I / never / have / eaten / Japanese / food / before /.", options: ["I have never eaten Japanese food before.", "I have eaten never Japanese food before.", "I never have eaten Japanese food before.", "I have never eaten before Japanese food."], correct: "I have never eaten Japanese food before." },
        { type: 'mcq', question: "20. Choose the correct sentence arranged from: She / cooking / was / dinner / at 6 PM / yesterday /.", options: ["She cooking dinner was at 6 PM yesterday.", "She was cooking dinner at 6 PM yesterday.", "Yesterday at 6 PM she dinner was cooking.", "She was at 6 PM yesterday cooking dinner."], correct: "She was cooking dinner at 6 PM yesterday." },

        // VI. TÌNH HUỐNG GIAO TIẾP
        { type: 'reading', text: "Peter and Mary are talking at school.\nPeter: \"I have just passed my final English exam!\"\nMary: \"___\"", question: "21. Choose the best response:", options: ["Good luck!", "Congratulations!", "You're welcome.", "I'm sorry to hear that."], correct: "Congratulations!" },

        // VII. VIẾT CÂU TỪ TỪ GỢI Ý CHỌN ĐÁP ÁN ĐÚNG
        { type: 'mcq', question: "22. Make a sentence from: I / start / learn / English / 5 years ago /.", options: ["I start learning English 5 years ago.", "I have started learning English 5 years ago.", "I started learning English 5 years ago.", "I was starting to learn English 5 years ago."], correct: "I started learning English 5 years ago." },
        { type: 'mcq', question: "23. Make a sentence from: While / I / walk / home / I / see / an accident /.", options: ["While I walked home, I was seeing an accident.", "While I was walking home, I saw an accident.", "While I am walking home, I see an accident.", "While I have walked home, I saw an accident."], correct: "While I was walking home, I saw an accident." },

        // VIII. ĐỌC HIỂU
        { type: 'reading', text: readingTextDay18, question: "24. What is the main idea of the passage?", options: ["How to travel by bus safely.", "A memorable volunteer trip.", "How to build a library.", "The history of a remote village."], correct: "A memorable volunteer trip." },
        { type: 'reading', text: readingTextDay18, question: "25. What did the students see while they were traveling on the bus?", options: ["A new library.", "Many beautiful landscapes.", "The local people.", "Many wild animals."], correct: "Many beautiful landscapes." },
        { type: 'reading', text: readingTextDay18, question: "26. What has the school built over the past year?", options: ["A new bus.", "A new school.", "A new library.", "A new hospital."], correct: "A new library." },
        { type: 'reading', text: readingTextDay18, question: "27. How often do they organize charity events?", options: ["Once a year.", "Twice a year.", "Every month.", "Every summer."], correct: "Twice a year." },
        { type: 'reading', text: readingTextDay18, question: "28. The word \"memorable\" is closest in meaning to:", options: ["unforgettable", "terrible", "boring", "expensive"], correct: "unforgettable" },

        // IX. TÌM CÂU ĐỒNG NGHĨA
        { type: 'mcq', question: "29. \"He started playing the piano in 2015.\" is closest in meaning to:", options: ["He has played the piano since 2015.", "He is playing the piano in 2015.", "He played the piano in 2015.", "He has started playing the piano since 2015."], correct: "He has played the piano since 2015." },
        { type: 'mcq', question: "30. \"The last time I saw her was last week.\" is closest in meaning to:", options: ["I didn't see her last week.", "I haven't seen her since last week.", "I have seen her for a week.", "I saw her for the last time since last week."], correct: "I haven't seen her since last week." },
        { type: 'mcq', question: "31. \"I was walking home, and it suddenly started to rain.\" is closest in meaning to:", options: ["It rained while I walk home.", "While I was walking home, it started to rain.", "I walked home while it is raining.", "It has rained while I was walking home."], correct: "While I was walking home, it started to rain." },
        { type: 'mcq', question: "32. \"She has never visited London before.\" is closest in meaning to:", options: ["This is the first time she has visited London.", "She visited London a long time ago.", "She always visits London.", "She is visiting London right now."], correct: "This is the first time she has visited London." },

        // X. ĐỌC ĐIỀN TỪ
        { type: 'reading', text: clozeTextDay18, question: "33. Choose the best word for blank (33):", options: ["land", "landed", "have landed", "was landing"], correct: "landed" },
        { type: 'reading', text: clozeTextDay18, question: "34. Choose the best word for blank (34):", options: ["improve", "improved", "has improved", "is improving"], correct: "has improved" },
        { type: 'reading', text: clozeTextDay18, question: "35. Choose the best word for blank (35):", options: ["build", "built", "are building", "have built"], correct: "are building" },
        { type: 'reading', text: clozeTextDay18, question: "36. Choose the best word for blank (36):", options: ["is", "are", "was", "were"], correct: "are" },
        { type: 'reading', text: clozeTextDay18, question: "37. Choose the best word for blank (37):", options: ["study", "are studying", "studied", "have studied"], correct: "are studying" },

        // XI. TRỌNG ÂM
        { type: 'mcq', question: "38. Choose the word that differs from the other three in the position of primary stress:", options: ["'planet", "'orbit", "a'broad", "'system"], correct: "a'broad" },
        { type: 'mcq', question: "39. Choose the word that differs from the other three in the position of primary stress:", options: ["de'velop", "a'ssistant", "in'vention", "'astronaut"], correct: "'astronaut" },

        // XII. SẮP XẾP HỘI THOẠI
        { type: 'reading', text: "a. Yes, I'm looking for a book about space.\nb. Good morning! Can I help you?\nc. We have some great ones in the science section over there.\nd. Thank you, I'll go check there.", question: "40. Choose the correct arrangement to make a meaningful exchange:", options: ["b - c - a - d", "b - a - c - d", "a - b - c - d", "c - b - a - d"], correct: "b - a - c - d" }
      ];
    }
if (i === 19) {
      dayData.videoUrl = "https://www.youtube.com/watch?v=vUKXzJcLm1M"; // URL bài giảng Tương lai đơn
      
      // Từ vựng trích xuất cho bài học Ngày 19 (Chủ đề Âm nhạc, Nghệ thuật & Tương lai đơn)
      dayData.vocabulary = [
        { word: "instrument", meaning: "nhạc cụ" },
        { word: "perform", meaning: "biểu diễn" },
        { word: "concert", meaning: "buổi hòa nhạc" },
        { word: "musician", meaning: "nhạc sĩ" },
        { word: "exhibition", meaning: "buổi triển lãm" },
        { word: "creative", meaning: "sáng tạo" },
        { word: "traditional", meaning: "truyền thống" },
        { word: "audience", meaning: "khán giả" },
        { word: "compose", meaning: "sáng tác" },
        { word: "melody", meaning: "giai điệu" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20 (Ứng dụng thì Tương lai đơn)
      const readingTextDay19 = "Next month, our school will organize a big music and arts festival. The event will take place in the main hall. Many talented students will perform traditional and modern songs. John, our best musician, will play the piano, and Mary will sing a beautiful melody. We think the audience will love their performance.\n\nIn addition to music, there will be an art exhibition. Students will display their creative paintings and drawings. The art teacher believes that the exhibition will inspire many young artists. Visitors will have the chance to buy some of the artworks. The money from the sales will go to a local charity.\n\nWe won't have any normal classes on that day. Instead, everyone will join the festival and enjoy the activities. The principal hopes that this event will become a traditional festival for our school in the future. We promise that it will be an unforgettable experience for everyone.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) --- Ngữ pháp Tương lai đơn & Từ vựng Nghệ thuật
        { type: 'mcq', question: '1. I think the music concert ___ at 8 PM tomorrow.', options: ['starts', 'will start', 'started', 'is starting'], correct: 'will start' },
        { type: 'mcq', question: '2. ___ you ___ the piano at the school festival next week?', options: ['Do / play', 'Are / playing', 'Will / play', 'Did / play'], correct: 'Will / play' },
        { type: 'mcq', question: '3. She promises she ___ a new song for us soon.', options: ['composes', 'will compose', 'composed', 'is composing'], correct: 'will compose' },
        { type: 'mcq', question: '4. We ___ to the art exhibition tomorrow because we have an important exam.', options: ['won\'t go', 'will go', 'don\'t go', 'didn\'t go'], correct: 'won\'t go' },
        { type: 'mcq', question: '5. Many famous ___ will perform at the music festival next month.', options: ['audiences', 'instruments', 'exhibitions', 'musicians'], correct: 'musicians' },
        { type: 'mcq', question: '6. I believe the ___ will enjoy the beautiful melody tonight.', options: ['audience', 'concert', 'exhibition', 'instrument'], correct: 'audience' },
        { type: 'mcq', question: '7. The students ___ their creative paintings in the main hall next Monday.', options: ['display', 'will display', 'displayed', 'are displaying'], correct: 'will display' },
        { type: 'mcq', question: '8. What ___ they ___ at the concert next Sunday?', options: ['do / sing', 'did / sing', 'will / sing', 'are / singing'], correct: 'will / sing' },
        { type: 'mcq', question: '9. I hope he ___ his traditional musical instrument to the party tonight.', options: ['brings', 'will bring', 'brought', 'is bringing'], correct: 'will bring' },
        { type: 'mcq', question: '10. She ___ a popular singer in the future because she has a great voice.', options: ['will become', 'becomes', 'became', 'is becoming'], correct: 'will become' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay19, question: '11. What is the main idea of the passage?', options: ['How to play the piano.', 'An upcoming music and arts festival at school.', 'Famous musicians in history.', 'Why students should learn art.'], correct: 'An upcoming music and arts festival at school.' },
        { type: 'reading', text: readingTextDay19, question: '12. Where will the event take place?', options: ['In the classroom.', 'In the local park.', 'In the main hall.', 'In a museum.'], correct: 'In the main hall.' },
        { type: 'reading', text: readingTextDay19, question: '13. What will John do at the festival?', options: ['He will sing a song.', 'He will play the piano.', 'He will draw a picture.', 'He will buy an artwork.'], correct: 'He will play the piano.' },
        { type: 'reading', text: readingTextDay19, question: '14. What will Mary do?', options: ['She will play the guitar.', 'She will sell paintings.', 'She will sing a beautiful melody.', 'She will organize the event.'], correct: 'She will sing a beautiful melody.' },
        { type: 'reading', text: readingTextDay19, question: '15. What will students display at the art exhibition?', options: ['Traditional instruments.', 'Creative paintings and drawings.', 'Photos of musicians.', 'Old books.'], correct: 'Creative paintings and drawings.' },
        { type: 'reading', text: readingTextDay19, question: '16. What will visitors have the chance to do?', options: ['Buy some of the artworks.', 'Meet famous singers.', 'Learn how to play the piano.', 'Take normal classes.'], correct: 'Buy some of the artworks.' },
        { type: 'reading', text: readingTextDay19, question: '17. Where will the money from the sales go?', options: ['To the principal.', 'To the students.', 'To a local charity.', 'To buy new instruments.'], correct: 'To a local charity.' },
        { type: 'reading', text: readingTextDay19, question: '18. Will students have normal classes on that day?', options: ['Yes, they will.', 'No, they won\'t.', 'Only in the morning.', 'The passage doesn\'t mention it.'], correct: 'No, they won\'t.' },
        { type: 'reading', text: readingTextDay19, question: '19. What does the principal hope?', options: ['The students will study harder.', 'The event will become a traditional festival.', 'The audience will buy all the paintings.', 'The charity will give them money.'], correct: 'The event will become a traditional festival.' },
        { type: 'reading', text: readingTextDay19, question: '20. The word "unforgettable" in the last sentence is closest in meaning to:', options: ['memorable', 'boring', 'terrible', 'expensive'], correct: 'memorable' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: will / The / perform / tomorrow / musician / concert / at / the / .', correct: 'The musician will perform at the concert tomorrow.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: you / Will / to / exhibition / the / art / go / weekend / next / ?', correct: 'Will you go to the art exhibition next weekend?' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: a / compose / She / will / new / soon / song / .', correct: 'She will compose a new song soon.' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: won't / They / any / buy / instruments / musical / .", correct: "They won't buy any musical instruments." },
        { type: 'writing', question: '25. Sắp xếp các từ sau: audience / love / think / the / I / melody / will / the / .', correct: 'I think the audience will love the melody.' }
      ];
    }
    if (i === 20) {
      dayData.videoUrl = "https://www.youtube.com/watch?v=FCz4wAVtvXk";
      
      // Từ vựng trích xuất và mở rộng cho bài học Ngày 20 (Tương lai hoàn thành & Mục tiêu tương lai)
      dayData.vocabulary = [
        { word: "complete", meaning: "hoàn thành" },
        { word: "exam", meaning: "kỳ thi" },
        { word: "graduate", meaning: "tốt nghiệp" },
        { word: "degree", meaning: "bằng cấp" },
        { word: "project", meaning: "dự án" },
        { word: "presentation", meaning: "bài thuyết trình" },
        { word: "submit", meaning: "nộp (bài)" },
        { word: "deadline", meaning: "hạn chót" },
        { word: "career", meaning: "sự nghiệp" },
        { word: "achieve", meaning: "đạt được" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay20 = "My name is Kevin, and I am currently a 9th-grade student. I have many plans for my future. By the end of this month, I will have completed all my final exams. I hope I will get good grades to enter a prestigious high school. My older sister, Linda, is a university student. By next summer, she will have graduated with a degree in education. She wants to become a teacher.\n\nAt school, my classmates and I are working on a large science project about renewable energy. The deadline is next Friday. We are working very hard, and by next Thursday, we will have finished the presentation. We will have submitted the final report to our science teacher before the deadline.\n\nSetting goals helps us stay focused. By the time I am twenty-five, I will have started my dream career in computer science. I believe that if we study hard and plan well, we will achieve our goals and become successful in life.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) --- (Trọng tâm: Tương lai hoàn thành & Từ vựng)
        { type: 'mcq', question: '1. By next month, we ___ our final exams.', options: ['will finish', 'are finishing', 'will have finished', 'have finished'], correct: 'will have finished' },
        { type: 'mcq', question: '2. She ___ from university by the end of 2028.', options: ['will have graduated', 'graduates', 'has graduated', 'is graduating'], correct: 'will have graduated' },
        { type: 'mcq', question: '3. By the time you arrive tonight, I ___ cooking dinner.', options: ['will finish', 'will have finished', 'finish', 'am finishing'], correct: 'will have finished' },
        { type: 'mcq', question: '4. They ___ the science project before the deadline next Friday.', options: ['will have completed', 'complete', 'completed', 'have completed'], correct: 'will have completed' },
        { type: 'mcq', question: '5. He hopes he ___ a successful career by the time he is 30.', options: ['achieves', 'will achieve', 'will have achieved', 'achieved'], correct: 'will have achieved' },
        { type: 'mcq', question: '6. Make sure you ___ the report to the teacher before Friday.', options: ['submit', 'submits', 'submitted', 'submitting'], correct: 'submit' },
        { type: 'mcq', question: '7. We have to finish this important task before the ___.', options: ['degree', 'career', 'deadline', 'exam'], correct: 'deadline' },
        { type: 'mcq', question: '8. My sister wants to get a ___ in education to become a teacher.', options: ['degree', 'project', 'deadline', 'presentation'], correct: 'degree' },
        { type: 'mcq', question: '9. By 8 PM tonight, I ___ my presentation for tomorrow\'s class.', options: ['will prepare', 'will have prepared', 'prepare', 'prepared'], correct: 'will have prepared' },
        { type: 'mcq', question: '10. ___ you ___ reading the book by next week?', options: ['Will / read', 'Do / read', 'Have / read', 'Will / have read'], correct: 'Will / have read' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay20, question: '11. What is the main idea of the passage?', options: ['How to pass an exam.', 'Kevin\'s future goals and school projects.', 'The benefits of renewable energy.', 'How to become a teacher.'], correct: 'Kevin\'s future goals and school projects.' },
        { type: 'reading', text: readingTextDay20, question: '12. What will Kevin have completed by the end of this month?', options: ['His university degree.', 'His science project.', 'All his final exams.', 'His presentation.'], correct: 'All his final exams.' },
        { type: 'reading', text: readingTextDay20, question: '13. Why does Kevin want good grades?', options: ['To get a new computer.', 'To become a teacher.', 'To enter a prestigious high school.', 'To travel abroad.'], correct: 'To enter a prestigious high school.' },
        { type: 'reading', text: readingTextDay20, question: '14. What will Linda have done by next summer?', options: ['She will have finished 9th grade.', 'She will have started a computer science career.', 'She will have graduated from university.', 'She will have submitted a project.'], correct: 'She will have graduated from university.' },
        { type: 'reading', text: readingTextDay20, question: '15. What does Linda want to become in the future?', options: ['A teacher.', 'A scientist.', 'An architect.', 'A doctor.'], correct: 'A teacher.' },
        { type: 'reading', text: readingTextDay20, question: '16. What is the science project about?', options: ['Space exploration.', 'Renewable energy.', 'Traditional festivals.', 'Computer science.'], correct: 'Renewable energy.' },
        { type: 'reading', text: readingTextDay20, question: '17. When is the deadline for the science project?', options: ['Next Thursday.', 'By the end of this month.', 'Next Friday.', 'When Kevin is twenty-five.'], correct: 'Next Friday.' },
        { type: 'reading', text: readingTextDay20, question: '18. What will Kevin and his classmates have done by next Thursday?', options: ['Finished the presentation.', 'Graduated from high school.', 'Started a new career.', 'Taken their final exams.'], correct: 'Finished the presentation.' },
        { type: 'reading', text: readingTextDay20, question: '19. What will Kevin have started by the time he is twenty-five?', options: ['A degree in education.', 'His dream career in computer science.', 'A renewable energy project.', 'A new high school.'], correct: 'His dream career in computer science.' },
        { type: 'reading', text: readingTextDay20, question: '20. The word "achieve" in the last paragraph is closest in meaning to:', options: ['fail', 'lose', 'reach', 'forget'], correct: 'reach' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: finished / I / will / have / my / by / homework / 9 PM / .', correct: 'I will have finished my homework by 9 PM.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: the / project / will / By / completed / next / week / they / have / .', correct: 'By next week they will have completed the project.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: She / graduated / will / from / have / university / by / 2030 / .', correct: 'She will have graduated from university by 2030.' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: Will / cleaned / room / you / have / by / the / tomorrow / ?", correct: "Will you have cleaned the room by tomorrow?" },
        { type: 'writing', question: '25. Sắp xếp các từ sau: time / arrives / By / the / he / we / left / will / have / .', correct: 'By the time he arrives we will have left.' }
      ];
    }
    if (i === 21) {
      dayData.videoUrl = "https://www.youtube.com/watch?v=fnFYTx5P9mE";
      
      // Từ vựng trích xuất và mở rộng cho bài học Ngày 21 (Ngữ âm & Phát âm)
      dayData.vocabulary = [
        { word: "pronunciation", meaning: "cách phát âm" },
        { word: "vowel", meaning: "nguyên âm" },
        { word: "consonant", meaning: "phụ âm" },
        { word: "mountain", meaning: "ngọn núi" },
        { word: "syllable", meaning: "âm tiết" },
        { word: "stress", meaning: "trọng âm" },
        { word: "intonation", meaning: "ngữ điệu" },
        { word: "accent", meaning: "giọng điệu" },
        { word: "improve", meaning: "cải thiện" },
        { word: "communicate", meaning: "giao tiếp" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay21 = "Good pronunciation is very important when you learn English. It is not just about having a perfect accent, but about communicating clearly so that others can understand you. English pronunciation consists of different vowel and consonant sounds. Some sounds might not exist in your native language, which makes them difficult to pronounce. For example, many learners struggle with the word 'mountain' or the 'th' sounds.\n\nTo improve your pronunciation, you should listen to native speakers as much as possible. You can watch English movies, listen to podcasts, or repeat after audio lessons. Pay attention to how they move their mouths and tongues. Moreover, word stress and intonation are also crucial. If you stress the wrong syllable, the word might mean something completely different.\n\nPracticing regularly is the key to success. You can record your own voice and compare it with a native speaker's voice. Don't be afraid of making mistakes. With time and practice, you will speak English more naturally and confidently.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) --- (Trọng tâm: Phát âm & Ngữ âm)
        { type: 'mcq', question: '1. Choose the word whose underlined part differs in pronunciation: m\u0332o\u0332u\u0332ntain, h\u0332o\u0332u\u0332se, s\u0332o\u0332u\u0332nd, sh\u0332o\u0332u\u0332lder.', options: ['mountain', 'house', 'sound', 'shoulder'], correct: 'shoulder' },
        { type: 'mcq', question: '2. Choose the word whose underlined part differs in pronunciation: w\u0332a\u0332ter, f\u0332a\u0332ther, m\u0332a\u0332tter, t\u0332a\u0332ll.', options: ['water', 'father', 'matter', 'tall'], correct: 'matter' },
        { type: 'mcq', question: '3. Choose the word whose underlined part differs in pronunciation: mount\u0332a\u0332i\u0332n, capt\u0332a\u0332i\u0332n, cert\u0332a\u0332i\u0332n, maint\u0332a\u0332i\u0332n.', options: ['mountain', 'captain', 'certain', 'maintain'], correct: 'maintain' },
        { type: 'mcq', question: '4. Choose the word whose underlined part differs in pronunciation (ending -ed): play\u0332e\u0332d\u0332, listen\u0332e\u0332d\u0332, want\u0332e\u0332d\u0332, clean\u0332e\u0332d\u0332.', options: ['played', 'listened', 'wanted', 'cleaned'], correct: 'wanted' },
        { type: 'mcq', question: '5. Choose the word whose underlined part differs in pronunciation: \u0332t\u0332h\u0332ink, \u0332t\u0332h\u0332ick, \u0332t\u0332h\u0332at, \u0332t\u0332h\u0332in.', options: ['think', 'thick', 'that', 'thin'], correct: 'that' },
        { type: 'mcq', question: '6. There are 5 ___ and 21 consonants in the English alphabet.', options: ['vowels', 'accents', 'stresses', 'syllables'], correct: 'vowels' },
        { type: 'mcq', question: '7. You should pay attention to the word ___ to pronounce it correctly.', options: ['stress', 'letter', 'meaning', 'spelling'], correct: 'stress' },
        { type: 'mcq', question: '8. Choose the word that has a different stress pattern:', options: ['vowel', 'accent', 'improve', 'mountain'], correct: 'improve' },
        { type: 'mcq', question: '9. Choose the word that has a different stress pattern:', options: ['syllable', 'consonant', 'understand', 'difficult'], correct: 'understand' },
        { type: 'mcq', question: '10. He has a very strong British ___.', options: ['voice', 'accent', 'sound', 'tongue'], correct: 'accent' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay21, question: '11. What is the main idea of the passage?', options: ['The history of the English language.', 'How to write an English essay.', 'The importance of good pronunciation and how to improve it.', 'Why native speakers talk fast.'], correct: 'The importance of good pronunciation and how to improve it.' },
        { type: 'reading', text: readingTextDay21, question: '12. What is the main goal of good pronunciation according to the text?', options: ['To have a perfect accent.', 'To communicate clearly so others can understand you.', 'To sound like an actor.', 'To pass grammar tests.'], correct: 'To communicate clearly so others can understand you.' },
        { type: 'reading', text: readingTextDay21, question: '13. What does English pronunciation consist of?', options: ['Only vowels.', 'Only consonants.', 'Different vowel and consonant sounds.', 'Only word stress.'], correct: 'Different vowel and consonant sounds.' },
        { type: 'reading', text: readingTextDay21, question: '14. Why are some sounds difficult to pronounce?', options: ['Because they are too long.', 'Because they might not exist in your native language.', 'Because native speakers speak too fast.', 'Because they are spelled strangely.'], correct: 'Because they might not exist in your native language.' },
        { type: 'reading', text: readingTextDay21, question: '15. Which word is mentioned as an example of a struggle for many learners?', options: ['language', 'communicate', 'mountain', 'success'], correct: 'mountain' },
        { type: 'reading', text: readingTextDay21, question: '16. How can you improve your pronunciation?', options: ['By reading silently.', 'By writing more essays.', 'By listening to native speakers and repeating.', 'By sleeping more.'], correct: 'By listening to native speakers and repeating.' },
        { type: 'reading', text: readingTextDay21, question: '17. What should you pay attention to when watching English movies?', options: ['The story.', 'How native speakers move their mouths and tongues.', 'The actors\' clothes.', 'The background music.'], correct: 'How native speakers move their mouths and tongues.' },
        { type: 'reading', text: readingTextDay21, question: '18. What happens if you stress the wrong syllable?', options: ['The word becomes longer.', 'You sound smarter.', 'The word might mean something completely different.', 'Nothing happens.'], correct: 'The word might mean something completely different.' },
        { type: 'reading', text: readingTextDay21, question: '19. What is a good way to practice regularly?', options: ['Record your own voice and compare it with a native speaker.', 'Talk to your pets.', 'Only read books.', 'Avoid speaking English.'], correct: 'Record your own voice and compare it with a native speaker.' },
        { type: 'reading', text: readingTextDay21, question: '20. How will you speak English after practicing with time?', options: ['More nervously.', 'More slowly.', 'More naturally and confidently.', 'More quietly.'], correct: 'More naturally and confidently.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: important / is / Good / very / pronunciation / .', correct: 'Good pronunciation is very important.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: vowels / consists / English / of / consonants / and / .', correct: 'English consists of vowels and consonants.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: word / mountain / difficult / The / pronounce / is / to / .', correct: 'The word mountain is difficult to pronounce.' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: should / listen / native / speakers / You / to / .", correct: "You should listen to native speakers." },
        { type: 'writing', question: '25. Sắp xếp các từ sau: your / own / record / You / can / voice / .', correct: 'You can record your own voice.' }
      ];
    }
    if (i === 22) {
      dayData.videoUrl = "https://www.youtube.com/watch?v=7bQvDRzOp_s";
      
      // Từ vựng trích xuất và mở rộng cho bài học Ngày 22 (Trọng âm & Giao tiếp)
      dayData.vocabulary = [
        { word: "communication", meaning: "sự giao tiếp" },
        { word: "media", meaning: "phương tiện truyền thông" },
        { word: "internet", meaning: "mạng internet" },
        { word: "connect", meaning: "kết nối" },
        { word: "message", meaning: "tin nhắn" },
        { word: "smartphone", meaning: "điện thoại thông minh" },
        { word: "social", meaning: "thuộc về xã hội" },
        { word: "information", meaning: "thông tin" },
        { word: "interact", meaning: "tương tác" },
        { word: "technology", meaning: "công nghệ" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay22 = "Communication has changed significantly over the years. In the past, people usually wrote letters to stay in touch with friends and family. It often took several days or even weeks to receive a reply. Today, thanks to the Internet and smartphones, communication is almost instant.\n\nSocial media platforms allow us to connect with people all over the world. We can easily share information, send messages, and post photos with just a few clicks. It is very convenient for both personal and professional interactions. Many students use these tools to discuss homework and learn new things together.\n\nHowever, while technology makes our lives easier, it also brings some disadvantages. Some people spend too much time looking at their screens and forget to talk to the people around them. Face-to-face interaction is still very important for building strong relationships. We should balance our online time and real-life conversations to stay happy and connected.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) --- (Trọng tâm: Trọng âm & Từ vựng Giao tiếp)
        { type: 'mcq', question: '1. Choose the word that has a different stress pattern: A. message B. social C. connect D. picture', options: ['message', 'social', 'connect', 'picture'], correct: 'connect' },
        { type: 'mcq', question: '2. Choose the word that has a different stress pattern: A. invent B. relax C. agree D. listen', options: ['invent', 'relax', 'agree', 'listen'], correct: 'listen' },
        { type: 'mcq', question: '3. Choose the word that has a different stress pattern: A. information B. population C. exhibition D. technology', options: ['information', 'population', 'exhibition', 'technology'], correct: 'technology' },
        { type: 'mcq', question: '4. Choose the word that has a different stress pattern: A. student B. teacher C. enjoy D. doctor', options: ['student', 'teacher', 'enjoy', 'doctor'], correct: 'enjoy' },
        { type: 'mcq', question: '5. Choose the word that has a different stress pattern: A. internet B. media C. smartphone D. inventor', options: ['internet', 'media', 'smartphone', 'inventor'], correct: 'inventor' },
        { type: 'mcq', question: '6. You can easily send a text ___ to your friends using a smartphone.', options: ['letter', 'message', 'information', 'social'], correct: 'message' },
        { type: 'mcq', question: '7. The ___ has completely changed the way we communicate with each other.', options: ['Internet', 'book', 'newspaper', 'television'], correct: 'Internet' },
        { type: 'mcq', question: '8. Many teenagers spend hours on ___ media every day.', options: ['social', 'connect', 'interact', 'technology'], correct: 'social' },
        { type: 'mcq', question: '9. Face-to-face ___ is very important for building good relationships.', options: ['interact', 'interacting', 'interaction', 'interactive'], correct: 'interaction' },
        { type: 'mcq', question: '10. Modern ___ makes our lives more convenient and comfortable.', options: ['technology', 'technique', 'technical', 'technician'], correct: 'technology' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay22, question: '11. What is the main idea of the passage?', options: ['The history of smartphones.', 'How communication has changed over time.', 'The dangers of social media.', 'How to write a letter.'], correct: 'How communication has changed over time.' },
        { type: 'reading', text: readingTextDay22, question: '12. How did people usually communicate in the past?', options: ['By sending text messages.', 'By using social media.', 'By writing letters.', 'By making phone calls.'], correct: 'By writing letters.' },
        { type: 'reading', text: readingTextDay22, question: '13. How long did it take to receive a reply in the past?', options: ['A few seconds.', 'Several minutes.', 'Several days or weeks.', 'A few hours.'], correct: 'Several days or weeks.' },
        { type: 'reading', text: readingTextDay22, question: '14. What makes communication almost instant today?', options: ['The post office.', 'The Internet and smartphones.', 'Television and radio.', 'Airplanes.'], correct: 'The Internet and smartphones.' },
        { type: 'reading', text: readingTextDay22, question: '15. What do social media platforms allow us to do?', options: ['Connect with people all over the world.', 'Travel around the world.', 'Avoid doing homework.', 'Stop talking to people.'], correct: 'Connect with people all over the world.' },
        { type: 'reading', text: readingTextDay22, question: '16. What do many students use these tools for?', options: ['To play video games only.', 'To discuss homework and learn new things.', 'To buy new smartphones.', 'To watch movies.'], correct: 'To discuss homework and learn new things.' },
        { type: 'reading', text: readingTextDay22, question: '17. What is a disadvantage of technology mentioned in the passage?', options: ['It is too expensive.', 'It is very slow.', 'People spend too much time on screens.', 'It causes headaches.'], correct: 'People spend too much time on screens.' },
        { type: 'reading', text: readingTextDay22, question: '18. What do some people forget to do because of screens?', options: ['Eat their meals.', 'Do their homework.', 'Talk to the people around them.', 'Write letters.'], correct: 'Talk to the people around them.' },
        { type: 'reading', text: readingTextDay22, question: '19. Why is face-to-face interaction still important?', options: ['Because it is cheap.', 'For building strong relationships.', 'Because the Internet is slow.', 'To learn how to use a smartphone.'], correct: 'For building strong relationships.' },
        { type: 'reading', text: readingTextDay22, question: '20. What is the advice given in the last sentence?', options: ['Stop using the Internet.', 'Throw away your smartphone.', 'Balance online time and real-life conversations.', 'Only talk to people online.'], correct: 'Balance online time and real-life conversations.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: has / The / changed / Internet / communication / .', correct: 'The Internet has changed communication.' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: usually / wrote / letters / people / past / the / In / .', correct: 'In the past people usually wrote letters.' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: media / Social / us / connect / helps / .', correct: 'Social media helps us connect.' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: a / send / You / text / can / message / .", correct: "You can send a text message." },
        { type: 'writing', question: '25. Sắp xếp các từ sau: interaction / is / Face-to-face / important / very / .', correct: 'Face-to-face interaction is very important.' }
      ];
    }
    if (i === 23) {
      dayData.videoUrl = "https://www.youtube.com/watch?v=qENljLq1KV4";
      
      // Từ vựng trích xuất và mở rộng cho bài học Ngày 23 (Từ để hỏi & Tìm kiếm thông tin)
      dayData.vocabulary = [
        { word: "information", meaning: "thông tin" },
        { word: "reason", meaning: "lý do" },
        { word: "distance", meaning: "khoảng cách" },
        { word: "duration", meaning: "khoảng thời gian" },
        { word: "direction", meaning: "phương hướng" },
        { word: "price", meaning: "giá cả" },
        { word: "quantity", meaning: "số lượng" },
        { word: "quality", meaning: "chất lượng" },
        { word: "describe", meaning: "miêu tả" },
        { word: "discover", meaning: "khám phá" }
      ];

      // Bài Đọc Hiểu dùng chung cho câu 11-20
      const readingTextDay23 = "Today is Tom's first day at his new school. He doesn't know anyone, so he has to ask many questions to find his way around. First, he asks a teacher, \"Where is the science laboratory?\" The teacher smiles and points to the second floor. Then, he meets a friendly boy named Peter. Tom asks, \"How often do you have English classes?\" Peter answers that they have English three times a week.\n\nAt lunchtime, Tom goes to the school cafeteria. He asks the lunch lady, \"How much is a sandwich and a bottle of water?\" She tells him it is two dollars. In the afternoon, Tom wants to join a sports club because he loves playing football. He asks the physical education coach, \"When does the football team practice?\" The coach says they practice every Tuesday and Thursday at 4 PM.\n\nBy asking the right questions, Tom gets all the information he needs. He also makes some new friends on his very first day. Knowing how to ask questions is a very important skill in our daily lives.";

      dayData.exercises = [
        // --- PHẦN 1: MULTIPLE CHOICE (1-10) --- (Trọng tâm: Từ để hỏi)
        { type: 'mcq', question: '1. ___ do you live? - I live in Ho Chi Minh City.', options: ['What', 'Where', 'When', 'Why'], correct: 'Where' },
        { type: 'mcq', question: '2. ___ is your favorite subject at school? - It is Math.', options: ['Who', 'Where', 'What', 'How'], correct: 'What' },
        { type: 'mcq', question: '3. ___ does it take to get to the school by bus? - About 15 minutes.', options: ['How long', 'How far', 'How much', 'How often'], correct: 'How long' },
        { type: 'mcq', question: '4. ___ is that tall man? - He is my uncle.', options: ['Who', 'Whose', 'Which', 'What'], correct: 'Who' },
        { type: 'mcq', question: '5. ___ do you go to the library? - Twice a week.', options: ['How long', 'How often', 'How many', 'How much'], correct: 'How often' },
        { type: 'mcq', question: '6. ___ bag is this? - It belongs to Mary.', options: ['Who', 'Whom', 'Whose', 'Which'], correct: 'Whose' },
        { type: 'mcq', question: '7. ___ are you crying? - Because I lost my keys.', options: ['What', 'When', 'Why', 'Where'], correct: 'Why' },
        { type: 'mcq', question: '8. ___ much is this blue T-shirt? - It is 10 dollars.', options: ['What', 'How', 'Which', 'Why'], correct: 'How' },
        { type: 'mcq', question: '9. ___ color do you prefer, red or blue? - I prefer blue.', options: ['Which', 'Where', 'Who', 'When'], correct: 'Which' },
        { type: 'mcq', question: '10. ___ did you go last night? - I went to the cinema.', options: ['What', 'Why', 'When', 'Where'], correct: 'Where' },

        // --- PHẦN 2: READING COMPREHENSION (11-20) ---
        { type: 'reading', text: readingTextDay23, question: '11. What is the main idea of the passage?', options: ['How to play football.', 'Tom\'s first day at a new school and how he asks for information.', 'The history of a school.', 'How to buy food in the cafeteria.'], correct: 'Tom\'s first day at a new school and how he asks for information.' },
        { type: 'reading', text: readingTextDay23, question: '12. Why does Tom have to ask many questions?', options: ['Because he is a teacher.', 'Because he doesn\'t know anyone and needs to find his way.', 'Because he likes talking too much.', 'Because he lost his money.'], correct: 'Because he doesn\'t know anyone and needs to find his way.' },
        { type: 'reading', text: readingTextDay23, question: '13. Who does Tom ask first?', options: ['A friendly boy.', 'The lunch lady.', 'The coach.', 'A teacher.'], correct: 'A teacher.' },
        { type: 'reading', text: readingTextDay23, question: '14. Where is the science laboratory?', options: ['On the first floor.', 'On the second floor.', 'Next to the cafeteria.', 'Outside the school.'], correct: 'On the second floor.' },
        { type: 'reading', text: readingTextDay23, question: '15. How often do they have English classes?', options: ['Once a week.', 'Twice a week.', 'Three times a week.', 'Every day.'], correct: 'Three times a week.' },
        { type: 'reading', text: readingTextDay23, question: '16. Where does Tom go at lunchtime?', options: ['The library.', 'The science laboratory.', 'The school cafeteria.', 'The sports club.'], correct: 'The school cafeteria.' },
        { type: 'reading', text: readingTextDay23, question: '17. How much does a sandwich and a bottle of water cost?', options: ['One dollar.', 'Two dollars.', 'Three dollars.', 'Four dollars.'], correct: 'Two dollars.' },
        { type: 'reading', text: readingTextDay23, question: '18. Why does Tom want to join a sports club?', options: ['Because he wants to be a coach.', 'Because he loves playing football.', 'Because his teacher told him to.', 'Because he likes running.'], correct: 'Because he loves playing football.' },
        { type: 'reading', text: readingTextDay23, question: '19. When does the football team practice?', options: ['Every Monday and Wednesday at 4 PM.', 'Every Tuesday and Thursday at 4 PM.', 'Every Friday at 5 PM.', 'Every weekend at 8 AM.'], correct: 'Every Tuesday and Thursday at 4 PM.' },
        { type: 'reading', text: readingTextDay23, question: '20. What is a very important skill in our daily lives according to the passage?', options: ['Playing football.', 'Eating sandwiches.', 'Knowing how to ask questions.', 'Finding the science laboratory.'], correct: 'Knowing how to ask questions.' },

        // --- PHẦN 3: SENTENCE REORDERING (21-25) ---
        { type: 'writing', question: '21. Sắp xếp các từ sau: you / did / Where / go / yesterday / ?', correct: 'Where did you go yesterday?' },
        { type: 'writing', question: '22. Sắp xếp các từ sau: take / it / does / long / How / ?', correct: 'How long does it take?' },
        { type: 'writing', question: '23. Sắp xếp các từ sau: are / learning / Why / English / you / ?', correct: 'Why are you learning English?' },
        { type: 'writing', question: "24. Sắp xếp các từ sau: time / the / start / does / What / film / ?", correct: "What time does the film start?" },
        { type: 'writing', question: '25. Sắp xếp các từ sau: that / table / the / is / Whose / on / book / ?', correct: 'Whose book is that on the table?' }
      ];
    }
    if (i === 24) {
      dayData.isTest = true;
      dayData.videoUrl = null; 
      dayData.requiredScore = 40; // Đề thi thực tế có 40 câu
      dayData.vocabulary = []; 

      // Dữ liệu văn bản chung cho bài đọc hiểu
      const readingTextDay24 = "What will our world look like in 2050? Many scientists predict that by the year 2050, we will have achieved many incredible technological advancements. First, our cities will become 'smart cities'. By that time, engineers will have built automated systems that control traffic, energy, and security. We won't have to worry about traffic jams anymore because flying cars and high-speed underground trains will be very common.\n\nFurthermore, education will change completely. Students might not need to go to traditional schools. Instead, they will use virtual reality headsets to attend online classes from anywhere in the world. By 2040, developers will have created highly intelligent robots that can assist teachers in grading and explaining difficult lessons.\n\nCommunication will also be much faster and easier. We will have developed devices that can translate any language instantly. Although some people worry that technology will replace human interactions, most experts believe these inventions will give us more free time to focus on our hobbies and creative arts.";
      
      // Dữ liệu văn bản chung cho bài đọc điền từ
      const clozeTextDay24 = "Learning how to communicate effectively is very important. When you meet someone for the first time, you should know how to ask the right (33) ___. For example, asking 'Where are you from?' or 'What do you do?' helps you get basic (34) ___ about them. Moreover, good communication is not just about words; it also involves your (35) ___ and body language. If you speak clearly and politely, people (36) ___ understand you better. By the end of this communication course, you (37) ___ learned how to interact confidently in any situation.";

      dayData.exercises = [
        // I. BIỂN BÁO & THÔNG BÁO
        { type: 'reading', text: "NOTICE\n- Art Exhibition opens next Monday.\n- Free entry for students.", question: "1. What does the notice say?", options: ["The art exhibition is closed on Monday.", "Students have to pay to enter the exhibition.", "The art exhibition will open next week and students can enter for free.", "Only students can visit the art exhibition."], correct: "The art exhibition will open next week and students can enter for free." },
        { type: 'reading', text: "DEADLINE\n- Science Project Submission: Friday 5 PM.", question: "2. What does this notice mean?", options: ["You must submit your science project by Friday 5 PM.", "You will start your science project on Friday.", "The science class is at 5 PM on Friday.", "You can submit the project next weekend."], correct: "You must submit your science project by Friday 5 PM." },

        // II. NGỮ ÂM (Trọng tâm: Phát âm)
        { type: 'mcq', question: "3. Choose the word whose underlined part differs in pronunciation (th- sound):", options: ["\u0332t\u0332h\u0332ink", "\u0332t\u0332h\u0332at", "\u0332t\u0332h\u0332ick", "\u0332t\u0332h\u0332in"], correct: "\u0332t\u0332h\u0332at" },
        { type: 'mcq', question: "4. Choose the word whose underlined part differs in pronunciation (vowel 'a'):", options: ["n\u0332a\u0332ture", "p\u0332a\u0332tience", "c\u0332a\u0332mera", "n\u0332a\u0332tive"], correct: "c\u0332a\u0332mera" },

        // III. SẮP XẾP ĐOẠN VĂN
        { type: 'reading', text: "a. Next, you will need to fill out this form.\nb. How can I register for the music club?\nc. Finally, you will receive a confirmation email.\nd. First, you should go to the school website.\ne. It is very simple to join.", question: "5. Choose the correct arrangement to make a meaningful paragraph:", options: ["b - e - d - a - c", "b - d - a - e - c", "d - a - c - b - e", "e - b - d - a - c"], correct: "b - e - d - a - c" },
        { type: 'reading', text: "a. I will have finished all my exams by then.\nb. Dear Mary, how are you?\nc. See you soon.\nd. Will you come to my graduation party next Friday?\ne. We will have a lot of fun together.", question: "6. Choose the correct arrangement to make a meaningful letter:", options: ["b - a - d - e - c", "b - d - a - e - c", "d - a - b - e - c", "b - e - d - a - c"], correct: "b - d - a - e - c" },

        // IV. NGỮ PHÁP & TỪ VỰNG (Tương lai đơn, TL Hoàn thành, Wh-questions)
        { type: 'mcq', question: "7. I think robots ___ all the dangerous jobs in the future.", options: ["do", "will do", "have done", "did"], correct: "will do" },
        { type: 'mcq', question: "8. By the end of this year, she ___ her university degree.", options: ["will finish", "finishes", "will have finished", "is finishing"], correct: "will have finished" },
        { type: 'mcq', question: "9. ___ does it take to travel to the moon? - About three days.", options: ["How long", "How far", "How often", "How much"], correct: "How long" },
        { type: 'mcq', question: "10. Don't worry, I ___ you with your presentation tomorrow.", options: ["help", "am helping", "will help", "have helped"], correct: "will help" },
        { type: 'mcq', question: "11. ___ bag is this? - It belongs to the new teacher.", options: ["Who", "Whom", "Whose", "Which"], correct: "Whose" },
        { type: 'mcq', question: "12. By 2030, scientists ___ a new planet that supports life.", options: ["will discover", "will have discovered", "discover", "discovered"], correct: "will have discovered" },
        { type: 'mcq', question: "13. Could you please give me some ___ about the upcoming art exhibition?", options: ["information", "instrument", "audience", "technology"], correct: "information" },
        { type: 'mcq', question: "14. The ___ clapped loudly when the musician finished playing the piano.", options: ["media", "audience", "communication", "syllable"], correct: "audience" },
        { type: 'mcq', question: "15. ___ do you go to the English club? - Twice a week.", options: ["How long", "How often", "How far", "How much"], correct: "How often" },
        { type: 'mcq', question: "16. Social ___ platforms allow us to connect with friends easily.", options: ["media", "internet", "message", "distance"], correct: "media" },
        { type: 'mcq', question: "17. We ___ the project by 5 PM next Friday, so we can relax on the weekend.", options: ["will complete", "will have completed", "completed", "complete"], correct: "will have completed" },
        { type: 'mcq', question: "18. ___ are you learning Spanish? - Because I want to travel to Spain.", options: ["What", "Where", "When", "Why"], correct: "Why" },

        // V. SẮP XẾP TỪ THÀNH CÂU CHỌN ĐÁP ÁN ĐÚNG
        { type: 'mcq', question: "19. Choose the correct sentence arranged from: By / next / year / I / have / graduated / will / .", options: ["By next year I have will graduated.", "By next year I will have graduated.", "I will graduated have by next year.", "By next year will I have graduated."], correct: "By next year I will have graduated." },
        { type: 'mcq', question: "20. Choose the correct sentence arranged from: What / you / do / will / tomorrow / morning / ?", options: ["What you will do tomorrow morning?", "What will do you tomorrow morning?", "What will you do tomorrow morning?", "Tomorrow morning what you will do?"], correct: "What will you do tomorrow morning?" },

        // VI. TÌNH HUỐNG GIAO TIẾP
        { type: 'reading', text: "Tom is asking a stranger on the street.\nTom: \"Excuse me, where is the nearest science museum?\"\nStranger: \"___\"", question: "21. Choose the best response:", options: ["It takes about 10 minutes.", "It is on the second floor.", "Go straight and turn left. It's on your right.", "I will go to the museum tomorrow."], correct: "Go straight and turn left. It's on your right." },

        // VII. VIẾT CÂU TỪ TỪ GỢI Ý CHỌN ĐÁP ÁN ĐÚNG
        { type: 'mcq', question: "22. Make a sentence from: How often / you / practice / playing / guitar / ?", options: ["How often you practice playing the guitar?", "How often do you practice playing the guitar?", "How often are you practice playing the guitar?", "How often did you practicing playing guitar?"], correct: "How often do you practice playing the guitar?" },
        { type: 'mcq', question: "23. Make a sentence from: By / time / you / arrive / we / have / finish / dinner /.", options: ["By the time you arrive, we will have finished dinner.", "By the time you arrive, we will finish dinner.", "By the time you arrive, we have finished dinner.", "By the time you arrived, we will have finished dinner."], correct: "By the time you arrive, we will have finished dinner." },

        // VIII. ĐỌC HIỂU
        { type: 'reading', text: readingTextDay24, question: "24. What is the main idea of the passage?", options: ["How to build an underground train.", "The dangers of virtual reality.", "Predictions about life and technology in 2050.", "How to learn a foreign language."], correct: "Predictions about life and technology in 2050." },
        { type: 'reading', text: readingTextDay24, question: "25. By 2050, what will engineers have built in 'smart cities'?", options: ["Flying bicycles.", "Automated systems that control traffic, energy, and security.", "Traditional schools.", "Museums and parks."], correct: "Automated systems that control traffic, energy, and security." },
        { type: 'reading', text: readingTextDay24, question: "26. How will students attend classes in the future?", options: ["By taking flying cars to school.", "By using virtual reality headsets from anywhere.", "By asking robots to study for them.", "By reading traditional books."], correct: "By using virtual reality headsets from anywhere." },
        { type: 'reading', text: readingTextDay24, question: "27. What will robots be able to do by 2040?", options: ["Replace all human teachers.", "Assist teachers in grading and explaining lessons.", "Translate languages.", "Control the traffic."], correct: "Assist teachers in grading and explaining lessons." },
        { type: 'reading', text: readingTextDay24, question: "28. What do most experts believe about future inventions?", options: ["They will make people lazy.", "They will destroy human interactions.", "They will give us more free time for hobbies and arts.", "They will be too expensive to use."], correct: "They will give us more free time for hobbies and arts." },

        // IX. TÌM CÂU ĐỒNG NGHĨA
        { type: 'mcq', question: "29. \"I promise to help you with your homework tonight.\" is closest in meaning to:", options: ["I will help you with your homework tonight.", "I am going to help you with your homework tonight.", "I have helped you with your homework tonight.", "I help you with your homework tonight."], correct: "I will help you with your homework tonight." },
        { type: 'mcq', question: "30. \"What is the price of this traditional costume?\" is closest in meaning to:", options: ["How much is this traditional costume?", "How many is this traditional costume?", "How long is this traditional costume?", "How far is this traditional costume?"], correct: "How much is this traditional costume?" },
        { type: 'mcq', question: "31. \"I plan to finish the project before 5 PM next Friday.\" is closest in meaning to:", options: ["I will finish the project at 5 PM next Friday.", "By 5 PM next Friday, I will have finished the project.", "I have finished the project since 5 PM next Friday.", "I am finishing the project before 5 PM next Friday."], correct: "By 5 PM next Friday, I will have finished the project." },
        { type: 'mcq', question: "32. \"What is the distance between your house and the school?\" is closest in meaning to:", options: ["How long is it from your house to the school?", "How often is it from your house to the school?", "How far is it from your house to the school?", "Where is it from your house to the school?"], correct: "How far is it from your house to the school?" },

        // X. ĐỌC ĐIỀN TỪ
        { type: 'reading', text: clozeTextDay24, question: "33. Choose the best word for blank (33):", options: ["information", "questions", "distance", "messages"], correct: "questions" },
        { type: 'reading', text: clozeTextDay24, question: "34. Choose the best word for blank (34):", options: ["information", "technology", "quality", "instrument"], correct: "information" },
        { type: 'reading', text: clozeTextDay24, question: "35. Choose the best word for blank (35):", options: ["pronunciation", "vowel", "consonant", "career"], correct: "pronunciation" },
        { type: 'reading', text: clozeTextDay24, question: "36. Choose the best word for blank (36):", options: ["did", "will", "have", "are"], correct: "will" },
        { type: 'reading', text: clozeTextDay24, question: "37. Choose the best word for blank (37):", options: ["are", "will", "will have", "have"], correct: "will have" },

        // XI. TRỌNG ÂM (Trọng tâm: Trọng âm từ 2-3 âm tiết)
        { type: 'mcq', question: "38. Choose the word that differs from the other three in the position of primary stress:", options: ["'instrument", "'audience", "per'form", "'melody"], correct: "per'form" },
        { type: 'mcq', question: "39. Choose the word that differs from the other three in the position of primary stress:", options: ["'internet", "con'nect", "'message", "'media"], correct: "con'nect" },

        // XII. SẮP XẾP HỘI THOẠI
        { type: 'reading', text: "a. Customer: How much does the ticket cost?\nb. Assistant: Good morning! How can I help you?\nc. Assistant: It is $15 for students.\nd. Customer: I want to buy a ticket for the art exhibition.", question: "40. Choose the correct arrangement to make a meaningful exchange:", options: ["b - d - a - c", "b - a - d - c", "d - b - a - c", "a - b - c - d"], correct: "b - d - a - c" }
      ];
    }
    course.push(dayData);
  }
  return course;
};

export const courseData = generateCourseData();
