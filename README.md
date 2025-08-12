# CropFocal - 크롭 화각 계산기 / Crop Field of View Calculator

🌐 **Live Demo**: [https://newboon.github.io/CropFocal/](https://newboon.github.io/CropFocal/)

[한국어](#한국어) | [English](#english)

---

## 한국어

카메라 사용자를 위한 크롭된 사진의 등가 초점거리 계산 웹앱입니다.

**🔗 온라인 사용**: [https://newboon.github.io/CropFocal/](https://newboon.github.io/CropFocal/)

### 계산 원리

#### 크롭 팩터 계산
크롭된 이미지의 등가 초점거리는 대각선 화각을 기준으로 계산됩니다:

```
크롭 팩터 = √(원본가로² + 원본세로²) / √(크롭가로² + 크롭세로²)
등가 초점거리 = 원본 초점거리 × 크롭 팩터
```

### 실행 방법

1. 프로젝트 폴더를 다운로드합니다.
2. `index.html` 파일을 웹 브라우저에서 엽니다.
3. 또는 로컬 서버를 실행하여 접속합니다:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server 패키지 필요)
   npx http-server
   ```

### 라이선스

MIT License

---

## English

A web application for calculating equivalent focal length of cropped photos for camera users.

**🔗 Try Online**: [https://newboon.github.io/CropFocal/](https://newboon.github.io/CropFocal/)

### Calculation Principle

#### Crop Factor Calculation
The equivalent focal length of cropped images is calculated based on diagonal field of view:

```
Crop Factor = √(Original Width² + Original Height²) / √(Crop Width² + Crop Height²)
Equivalent Focal Length = Original Focal Length × Crop Factor
```

### How to Run

1. Download the project folder.
2. Open `index.html` file in a web browser.
3. Or run a local server and access:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (requires http-server package)
   npx http-server
   ```

### License

MIT License