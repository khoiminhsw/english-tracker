# 🚀 English Tracker: Website Cá Nhân Hóa Tự Học Tiếng Anh 

<img width="2336" height="1296" alt="image" src="https://github.com/user-attachments/assets/099f4eb0-51bc-4587-bbbd-96b0375b4ed2" />


## 🎯 Mục tiêu
Cá nhân hóa lộ trình học tiếng Anh trong 48 ngày với liên kết video YouTube và bài tập tương tác kèm theo. Dự án hướng tới việc xây dựng thói quen học tập kỷ luật thông qua các cơ chế kiểm tra từ vựng ngắt quãng, quản lý thời gian học khắt khe, hệ thống điểm thưởng/phạt rõ ràng và ứng dụng **Gamification** (Trò chơi hóa) để ôn tập kiến thức.

## 🔗 Cách truy cập
1. Truy cập trực tiếp vào đường dẫn trang web: https://english-tracker-sigma.vercel.app/
2. Tại màn hình chính, nhấp vào nút **Đăng nhập bằng Google**.
3. Sử dụng bất kỳ tài khoản Gmail nào để đăng nhập. Hệ thống sẽ tự động khởi tạo hồ sơ học tập và lưu trữ tiến độ của bạn trên Đám mây.

## ✨ Các tính năng nổi bật

### 📚 1. Lộ trình & Kỷ luật thép (Time-gating)
* **Khóa bài thông minh:** Học viên thiết lập cam kết lịch học hàng tuần. Hệ thống đối chiếu **Lịch trình** và **Ngày hoàn thành bài gần nhất** để đảm bảo: Đúng ngày có lịch mới được mở bài, và **tuyệt đối chỉ được học 1 bài/ngày**.
* **Nội dung đa dạng:** Mỗi ngày học bao gồm video bài giảng và bộ bài tập (Trắc nghiệm, Đọc hiểu, Viết câu).
* **Khóa bài & Hiện đáp án (3-Strikes-Out):** Nếu nộp sai bài tập quá 3 lần, hệ thống lập tức khóa bài, trừ điểm và hiển thị đáp án đúng/sai chi tiết để ép học viên phải xem lại lỗi sai thay vì chọn bừa.

### 🧠 2. Spaced Repetition & Sổ tay cá nhân
* **Trạm kiểm tra đầu giờ:** Bốc ngẫu nhiên **5 từ vựng** của bài học trước đó. Học viên phải gõ chính xác nghĩa tiếng Anh để được vào bài mới.
* **Sổ tay từ vựng (Personal Notebook):** Khi gõ sai từ ở trạm kiểm tra, học viên có thể bấm "Thêm vào sổ tay". Một danh sách sổ tay cá nhân được lưu trên Cloud để học viên có thể mở ra ôn tập bất cứ lúc nào ngay từ màn hình chính.

### 🎮 3. Game Hub Ôn Tập (Tối đa 3 lượt/ngày)
<img width="1854" height="1151" alt="image" src="https://github.com/user-attachments/assets/fc631f5d-7473-4bd2-9223-19cc1f040780" />

Khu vực trò chơi giúp ôn lại toàn bộ từ vựng đã học ở các bài trước:
* **Memory Match (Trí nhớ không gian):** Lật 10 thẻ để tìm 5 cặp từ tiếng Anh - tiếng Việt tương ứng. Ràng buộc khắt khe tối đa **15 bước lật**, quá số bước sẽ thua cuộc.

<img width="1907" height="1048" alt="image" src="https://github.com/user-attachments/assets/7d4eed7a-2ca5-46ca-80b8-6fc9b3c4ab19" />


* **Zombie Survival (Phản xạ nhạy bén):** Trả lời trắc nghiệm MCQ thật nhanh để tiêu diệt Zombie đang lao về căn cứ. Áp lực thời gian thực với tốc độ Zombie tăng dần. Tiêu diệt 5 Zombie để thắng.

<img width="1888" height="1332" alt="image" src="https://github.com/user-attachments/assets/7e095a8b-01ad-437a-95df-312746599824" />


### 🏆 4. Hệ thống Điểm số (Gamification) & Giám thị (Anti-Cheat)
* Khởi đầu với **100 điểm** và đếm chuỗi ngày học liên tục (Streak).
* 🎁 **Thưởng:** `+5 điểm` nếu làm đúng 100% bài tập ngay lần đầu tiên. `+1 điểm` khi thắng Mini-game ôn tập.
* ⚔️ **Phạt:** `-5 điểm` nếu vắng mặt vào ngày có lịch học. `-2 điểm` nếu sai từ vựng hoặc sai bài tập quá 3 lần.
* 🚨 **Giám thị tự động:** Chống gian lận bằng Page Visibility API. Chuyển Tab, thu nhỏ cửa sổ hoặc tải lại trang khi đang làm bài sẽ lập tức bị hủy bài và phạt `-5 điểm`.
* **Sổ tay quy tắc:** Nút (i) trên Header giúp minh bạch hóa toàn bộ luật chơi.

## 💻 Công nghệ
* **Frontend:** React.js, Vite, Tailwind CSS, Lucide React (Icons).
* **Backend (BaaS):** Firebase Authentication (Xác thực người dùng), Cloud Firestore (Cơ sở dữ liệu NoSQL lưu tiến độ, sổ tay, lượt chơi game theo thời gian thực).
* **Deployment:** Vercel tích hợp CI/CD với GitHub.

## ⚙️ Quy trình cốt lõi
1. **Đăng nhập & Thiết lập:** Xác thực Google, ký cam kết lịch học. Tải dữ liệu từ Firestore và quét trừ điểm nếu vắng mặt.
2. **Khởi động:** Vượt qua kiểm tra từ vựng ngẫu nhiên. Bấm lưu từ khó vào Sổ tay.
3. **Học & Làm bài:** Xem video, hoàn thành bài tập dưới sự giám sát của Anti-Cheat. Nộp bài cẩn thận để săn điểm thưởng One-shot hoặc tránh bị phạt.
4. **Giải trí & Ôn tập:** Sử dụng điểm thưởng và thời gian rảnh để cày thêm điểm ở Khu vực Game (Tối đa 3 ván mỗi ngày).

## 📁 Kiến trúc dự án
```text
english-tracker/
├── src/
│   ├── App.jsx              # Cốt lõi: Lịch học, State quản lý Điểm/Streak, Modal Quy tắc, Admin Mode.
│   ├── Lesson.jsx           # Màn hình Bài học: Check từ vựng random, Sổ tay, Khóa 3-strikes, Anti-cheat.
│   ├── VocabularyReview.jsx # Game Hub: Tích hợp logic Memory Match và Zombie Survival.
│   ├── data.js              # CSDL tĩnh: Các câu hỏi, từ vựng, link YouTube 48 ngày.
│   ├── firebase.js          # Kết nối Backend (Firebase Auth & Firestore).
│   ├── index.css            # Cấu hình Tailwind CSS.
│   └── main.jsx             # Entry point của React.
├── package.json             # Quản lý metadata và dependencies.
└── tailwind.config.js       # Tùy chỉnh hệ thống giao diện.
