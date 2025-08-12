// i18n 번역 데이터
const translations = {
    ko: {
        // 페이지 제목
        pageTitle: 'CropFocal - 크롭 화각 계산기',
        appTitle: 'CropFocal',
        appDescription: '크롭된 사진의 등가 초점거리 계산기',
        
        // 카메라 정보 섹션
        cameraInfo: '카메라 및 렌즈 정보',
        sensorSize: '센서 크기:',
        
        // 센서 옵션
        fullframe: '풀프레임 (36×24mm)',
        mediumFormat: '중형 포맷 (43.8×32.9mm)',
        apsc: 'APS-C (23.6×15.6mm)',
        apscCanon: 'APS-C 캐논 (22.2×14.8mm)',
        micro43: '마이크로 포서드 (17.3×13mm)',
        oneInch: '1인치 (13.2×8.8mm)',
        
        // 초점거리 섹션
        originalFocalLength: '원본 렌즈 초점거리 (mm):',
        actualFocalLength: '실제 초점거리 (mm):',
        equivalentFocalLength: '35mm 환산 초점거리 (mm):',
        
        // 해상도 섹션
        originalResolution: '원본 사진 해상도',
        croppedResolution: '크롭된 사진 해상도',
        width: '가로 (픽셀):',
        height: '세로 (픽셀):',
        
        // 버튼
        calculate: '계산하기',
        
        // 결과 섹션
        calculationResult: '계산 결과',
        cropActualFocalLength: '크롭 후 실제 초점거리:',
        cropEquivalentFocalLength: '크롭 후 35mm 환산 초점거리:',
        cropFactor: '크롭 팩터:',
        cropRatio: '크롭 비율:',
        
        // 언어 선택
        languageSelection: '언어 선택',
        korean: '한국어',
        english: 'English'
    },
    en: {
        // 페이지 제목
        pageTitle: 'CropFocal - Crop Angle Calculator',
        appTitle: 'CropFocal',
        appDescription: 'Equivalent focal length calculator for cropped photos',
        
        // 카메라 정보 섹션
        cameraInfo: 'Camera and Lens Information',
        sensorSize: 'Sensor Size:',
        
        // 센서 옵션
        fullframe: 'Full Frame (36×24mm)',
        mediumFormat: 'Medium Format (43.8×32.9mm)',
        apsc: 'APS-C (23.6×15.6mm)',
        apscCanon: 'APS-C Canon (22.2×14.8mm)',
        micro43: 'Micro Four Thirds (17.3×13mm)',
        oneInch: '1 inch (13.2×8.8mm)',
        
        // 초점거리 섹션
        originalFocalLength: 'Original Lens Focal Length (mm):',
        actualFocalLength: 'Actual Focal Length (mm):',
        equivalentFocalLength: '35mm Equivalent Focal Length (mm):',
        
        // 해상도 섹션
        originalResolution: 'Original Photo Resolution',
        croppedResolution: 'Cropped Photo Resolution',
        width: 'Width (pixels):',
        height: 'Height (pixels):',
        
        // 버튼
        calculate: 'Calculate',
        
        // 결과 섹션
        calculationResult: 'Calculation Result',
        cropActualFocalLength: 'Cropped Actual Focal Length:',
        cropEquivalentFocalLength: 'Cropped 35mm Equivalent Focal Length:',
        cropFactor: 'Crop Factor:',
        cropRatio: 'Crop Ratio:',
        
        // 언어 선택
        languageSelection: 'Language Selection',
        korean: '한국어',
        english: 'English'
    }
};

// 현재 언어 (기본값: 한국어)
let currentLanguage = 'ko';

// 번역 함수
function t(key) {
    return translations[currentLanguage][key] || key;
}

// 언어 변경 함수
function changeLanguage(lang) {
    currentLanguage = lang;
    updatePageTexts();
    localStorage.setItem('language', lang);
    
    // HTML lang 속성 업데이트
    document.documentElement.lang = lang;
    
    // 페이지 제목 업데이트
    document.title = t('pageTitle');
}

// 페이지의 모든 텍스트 업데이트
function updatePageTexts() {
    // 헤더
    document.querySelector('header h1 strong').textContent = t('appTitle');
    document.querySelector('header p').textContent = t('appDescription');
    
    // 카메라 정보 섹션
    document.querySelector('.input-section h2').textContent = t('cameraInfo');
    document.querySelector('label[for="sensor-type"]').textContent = t('sensorSize');
    
    // 센서 옵션들
    document.querySelector('option[value="fullframe"]').textContent = t('fullframe');
    document.querySelector('option[value="medium-format"]').textContent = t('mediumFormat');
    document.querySelector('option[value="apsc"]').textContent = t('apsc');
    document.querySelector('option[value="apsc-canon"]').textContent = t('apscCanon');
    document.querySelector('option[value="micro43"]').textContent = t('micro43');
    document.querySelector('option[value="1inch"]').textContent = t('oneInch');
    
    // 초점거리 라벨들
    document.querySelector('label[for="focal-length"]').textContent = t('originalFocalLength');
    document.querySelector('label[for="actual-focal-length"]').textContent = t('actualFocalLength');
    document.querySelector('label[for="equivalent-focal-length-input"]').textContent = t('equivalentFocalLength');
    
    // 해상도 섹션
    const h3Elements = document.querySelectorAll('.input-section h3');
    h3Elements[0].textContent = t('originalResolution');
    h3Elements[1].textContent = t('croppedResolution');
    
    // 해상도 라벨들
    document.querySelector('label[for="original-width"]').textContent = t('width');
    document.querySelector('label[for="original-height"]').textContent = t('height');
    document.querySelector('label[for="crop-width"]').textContent = t('width');
    document.querySelector('label[for="crop-height"]').textContent = t('height');
    
    // 계산 버튼
    document.querySelector('#calculate-btn').textContent = t('calculate');
    
    // 결과 섹션
    document.querySelector('.result-section h2').textContent = t('calculationResult');
    
    // 결과 라벨들
    const resultLabels = document.querySelectorAll('.result-label');
    resultLabels[0].textContent = t('cropActualFocalLength');
    resultLabels[1].textContent = t('cropEquivalentFocalLength');
    resultLabels[2].textContent = t('cropFactor');
    resultLabels[3].textContent = t('cropRatio');
    
    // 언어 선택 섹션
    document.querySelector('#language-section h3').textContent = t('languageSelection');
}

// 페이지 로드 시 저장된 언어 설정 불러오기
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    // 언어 버튼 활성화 상태 업데이트
    updateLanguageButtons();
    
    // 페이지 텍스트 업데이트
    updatePageTexts();
    
    // HTML lang 속성 설정
    document.documentElement.lang = currentLanguage;
    
    // 페이지 제목 설정
    document.title = t('pageTitle');
}

// 언어 버튼 활성화 상태 업데이트
function updateLanguageButtons() {
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLanguage) {
            btn.classList.add('active');
        }
    });
}

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 언어 버튼 이벤트 리스너 추가
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            changeLanguage(this.dataset.lang);
            updateLanguageButtons();
        });
    });
    
    // 언어 초기화
    initializeLanguage();
});