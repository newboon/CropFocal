/**
 * 메인 애플리케이션 클래스
 */
class CropFocalApp {
    constructor() {
        this.calculator = new CropCalculator();
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * DOM 요소 초기화
     */
    initializeElements() {
        // 입력 요소들
        this.sensorTypeSelect = document.getElementById('sensor-type');
        this.focalLengthInput = document.getElementById('focal-length');
        this.actualFocalLengthInput = document.getElementById('actual-focal-length');
        this.equivalentFocalLengthInput = document.getElementById('equivalent-focal-length-input');
        this.focalLengthGroup = document.querySelector('.focal-length-group');
        this.singleFocalLengthDiv = document.getElementById('single-focal-length');
        this.dualFocalLengthDiv = document.getElementById('dual-focal-length');
        this.originalWidthInput = document.getElementById('original-width');
        this.originalHeightInput = document.getElementById('original-height');
        this.cropWidthInput = document.getElementById('crop-width');
        this.cropHeightInput = document.getElementById('crop-height');
        this.calculateBtn = document.getElementById('calculate-btn');

        // 결과 요소들
        this.cropActualFocalLengthSpan = document.getElementById('crop-actual-focal-length');
        this.cropEquivalentFocalLengthSpan = document.getElementById('crop-equivalent-focal-length');
        this.cropFactorSpan = document.getElementById('crop-factor');
        this.cropRatioSpan = document.getElementById('crop-ratio');
        this.calculationStepsDiv = document.getElementById('calculation-steps');
        this.resultContainer = document.getElementById('result-container');
        
        // 추가 요소들 (null 체크 포함)
        this.resultsSection = document.getElementById('results');
        this.errorContainer = document.getElementById('error-container');
    }

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 계산 버튼 클릭
        this.calculateBtn.addEventListener('click', () => this.performCalculation());

        // 엔터 키로 계산 실행
        const inputs = [
            this.focalLengthInput,
            this.equivalentFocalLengthInput,
            this.originalWidthInput,
            this.originalHeightInput,
            this.cropWidthInput,
            this.cropHeightInput
        ];

        inputs.forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.performCalculation();
                    }
                });

                // 입력값 변경 시 에러 스타일 제거
                input.addEventListener('input', () => {
                    this.clearInputError(input);
                });
            }
        });

        // 센서 타입 변경 시 초점거리 필드 표시/숨김 및 예시 해상도 설정
        this.sensorTypeSelect.addEventListener('change', () => {
            this.updateFocalLengthFields();
            this.setSampleResolution();
            
            // 센서 크기 변경 시 모든 입력 필드 초기화
            if (this.focalLengthInput) this.focalLengthInput.value = '';
            if (this.actualFocalLengthInput) this.actualFocalLengthInput.value = '';
            if (this.equivalentFocalLengthInput) this.equivalentFocalLengthInput.value = '';
            this.originalWidthInput.value = '';
            this.originalHeightInput.value = '';
            this.cropWidthInput.value = '';
            this.cropHeightInput.value = '';
            
            // 센서 크기 변경 시 계산 결과 초기화
            this.resetResults();
        });

        // 초점거리 상호 연동 (디바운싱으로 커서 위치 문제 해결)
        let actualTimeout, equivalentTimeout;
        
        if (this.actualFocalLengthInput) {
            this.actualFocalLengthInput.addEventListener('input', () => {
                clearTimeout(actualTimeout);
                if (this.actualFocalLengthInput.value === '') {
                    this.equivalentFocalLengthInput.value = '';
                } else {
                    actualTimeout = setTimeout(() => {
                        this.updateEquivalentFromActual();
                    }, 500); // 500ms 지연
                }
            });
        }
        
        if (this.equivalentFocalLengthInput) {
            this.equivalentFocalLengthInput.addEventListener('input', () => {
                clearTimeout(equivalentTimeout);
                if (this.equivalentFocalLengthInput.value === '') {
                    this.actualFocalLengthInput.value = '';
                } else {
                    equivalentTimeout = setTimeout(() => {
                        this.updateActualFromEquivalent();
                    }, 500); // 500ms 지연
                }
            });
        }
    }



    /**
     * 초점거리 필드 표시/숨김 업데이트
     */
    updateFocalLengthFields() {
        const isFullFrame = this.sensorTypeSelect.value === 'fullframe';
        
        if (isFullFrame) {
            // 풀프레임: 단일 초점거리 필드만 표시
            if (this.singleFocalLengthDiv) this.singleFocalLengthDiv.style.display = 'block';
            if (this.dualFocalLengthDiv) this.dualFocalLengthDiv.style.display = 'none';
        } else {
            // 풀프레임 아님: 두 개의 초점거리 필드 표시
            if (this.singleFocalLengthDiv) this.singleFocalLengthDiv.style.display = 'none';
            if (this.dualFocalLengthDiv) this.dualFocalLengthDiv.style.display = 'block';
        }
    }

    /**
     * 실제 초점거리에서 35mm 환산 초점거리 계산
     */
    updateEquivalentFromActual() {
        if (this.sensorTypeSelect.value === 'fullframe' || !this.actualFocalLengthInput || !this.equivalentFocalLengthInput) return;
        
        const actualValue = parseFloat(this.actualFocalLengthInput.value);
        if (actualValue > 0) {
            // 센서 타입을 설정하여 올바른 크롭 팩터 사용
            this.calculator.sensorType = this.sensorTypeSelect.value;
            const equivalent = this.calculator.actualToEquivalent(actualValue);
            this.equivalentFocalLengthInput.value = Math.round(equivalent * 10) / 10;
        }
    }

    /**
     * 35mm 환산 초점거리에서 실제 초점거리 계산
     */
    updateActualFromEquivalent() {
        if (this.sensorTypeSelect.value === 'fullframe' || !this.actualFocalLengthInput || !this.equivalentFocalLengthInput) return;
        
        const equivalentValue = parseFloat(this.equivalentFocalLengthInput.value);
        if (equivalentValue > 0) {
            // 센서 타입을 임시로 설정하여 계산
            this.calculator.sensorType = this.sensorTypeSelect.value;
            const actual = this.calculator.equivalentToActual(equivalentValue);
            this.actualFocalLengthInput.value = Math.round(actual * 10) / 10;
        }
    }

    /**
     * 센서 타입에 따른 샘플 해상도 설정
     */
    setSampleResolution() {
        // 기본값 설정 없이 빈 함수로 유지
    }

    /**
     * 입력 에러 스타일 제거
     */
    clearInputError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
    }

    /**
     * 입력 에러 표시
     */
    showInputError(input, message) {
        input.classList.add('error');
        
        let errorMsg = input.parentNode.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            input.parentNode.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
    }

    /**
     * 모든 입력 에러 제거
     */
    clearAllErrors() {
        const inputs = [
            this.focalLengthInput,
            this.originalWidthInput,
            this.originalHeightInput,
            this.cropWidthInput,
            this.cropHeightInput
        ];

        inputs.forEach(input => this.clearInputError(input));
    }

    /**
     * 계산 수행
     */
    performCalculation() {
        // 기존 에러 제거
        this.clearAllErrors();

        // 입력값 수집
        const sensorType = this.sensorTypeSelect.value;
        const isFullFrame = sensorType === 'fullframe';
        const focalLength = isFullFrame ? (this.focalLengthInput ? this.focalLengthInput.value : '') : (this.actualFocalLengthInput ? this.actualFocalLengthInput.value : '');
        const equivalentFocalLength = this.equivalentFocalLengthInput ? this.equivalentFocalLengthInput.value : '';
        const originalWidth = this.originalWidthInput.value;
        const originalHeight = this.originalHeightInput.value;
        const cropWidth = this.cropWidthInput.value;
        const cropHeight = this.cropHeightInput.value;

        // 계산기에 입력값 설정
        this.calculator.setInputs(
            sensorType,
            focalLength,
            equivalentFocalLength,
            originalWidth,
            originalHeight,
            cropWidth,
            cropHeight
        );

        // 계산 실행
        const result = this.calculator.calculate();

        if (!result.success) {
            this.showErrors(result.errors);
            return;
        }

        // 결과 표시
        this.displayResults(result.results, result.details);
    }

    /**
     * 에러 메시지 표시
     */
    showErrors(errors) {
        // 첫 번째 에러에 해당하는 입력 필드에 포커스
        const errorMappings = {
            '원본 렌즈 초점거리': this.focalLengthInput,
            '원본 사진 가로': this.originalWidthInput,
            '원본 사진 세로': this.originalHeightInput,
            '크롭된 사진 가로': this.cropWidthInput,
            '크롭된 사진 세로': this.cropHeightInput
        };

        errors.forEach(error => {
            for (const [key, input] of Object.entries(errorMappings)) {
                if (error.includes(key)) {
                    this.showInputError(input, error);
                    break;
                }
            }
        });

        // 결과 초기화
        this.resetResults();
    }

    /**
     * 결과 표시
     */
    displayResults(results) {
        const actualFocalLength = this.calculator.calculateCropActualFocalLength();
        const equivalentFocalLength = this.calculator.calculateCropEquivalentFocalLength();
        
        // 결과 값 업데이트
        if (this.cropActualFocalLengthSpan) {
            this.cropActualFocalLengthSpan.textContent = `${actualFocalLength.toFixed(1)}mm`;
        }
        if (this.cropEquivalentFocalLengthSpan) {
            this.cropEquivalentFocalLengthSpan.textContent = `${equivalentFocalLength.toFixed(1)}mm`;
        }
        if (this.cropFactorSpan) {
            this.cropFactorSpan.textContent = `${results.cropFactor.toFixed(2)}×`;
        }
        if (this.cropRatioSpan) {
            this.cropRatioSpan.textContent = `${results.cropRatio.toFixed(1)}%`;
        }
        
        // 결과 섹션 표시
        if (this.resultContainer) {
            this.resultContainer.style.display = 'block';
            
            // 부드러운 애니메이션
            this.resultContainer.style.opacity = '0';
            setTimeout(() => {
                this.resultContainer.style.opacity = '1';
            }, 10);
        }
    }

    /**
     * 결과 초기화
     */
    resetResults() {
        if (this.cropActualFocalLengthSpan) this.cropActualFocalLengthSpan.textContent = '-';
        if (this.cropEquivalentFocalLengthSpan) this.cropEquivalentFocalLengthSpan.textContent = '-';
        if (this.cropFactorSpan) this.cropFactorSpan.textContent = '-';
        if (this.cropRatioSpan) this.cropRatioSpan.textContent = '-';
        if (this.calculationStepsDiv) this.calculationStepsDiv.textContent = '계산을 위해 모든 값을 입력해주세요.';
    }

    /**
     * 결과 애니메이션
     */
    animateResults() {
        // 결과 값들에 하이라이트 효과
        const resultValues = document.querySelectorAll('.result-value');
        resultValues.forEach(value => {
            value.style.transform = 'scale(1.1)';
            value.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                value.style.transform = 'scale(1)';
            }, 300);
        });
    }

    /**
     * 로컬 스토리지에 입력값 저장
     */
    saveInputsToStorage() {
        const inputs = {
            sensorType: this.sensorTypeSelect.value,
            focalLength: this.focalLengthInput ? this.focalLengthInput.value : '',
            actualFocalLength: this.actualFocalLengthInput ? this.actualFocalLengthInput.value : '',
            equivalentFocalLength: this.equivalentFocalLengthInput ? this.equivalentFocalLengthInput.value : '',
            originalWidth: this.originalWidthInput.value,
            originalHeight: this.originalHeightInput.value,
            cropWidth: this.cropWidthInput.value,
            cropHeight: this.cropHeightInput.value
        };

        localStorage.setItem('cropfocal-inputs', JSON.stringify(inputs));
    }

    /**
     * 로컬 스토리지에서 입력값 로드
     */
    loadInputsFromStorage() {
        const saved = localStorage.getItem('cropfocal-inputs');
        if (saved) {
            try {
                const inputs = JSON.parse(saved);
                this.sensorTypeSelect.value = inputs.sensorType || 'fullframe';
                if (this.focalLengthInput) this.focalLengthInput.value = inputs.focalLength || '';
                if (this.actualFocalLengthInput) this.actualFocalLengthInput.value = inputs.actualFocalLength || '';
                if (this.equivalentFocalLengthInput) this.equivalentFocalLengthInput.value = inputs.equivalentFocalLength || '';
                this.originalWidthInput.value = inputs.originalWidth || '';
                this.originalHeightInput.value = inputs.originalHeight || '';
                this.cropWidthInput.value = inputs.cropWidth || '';
                this.cropHeightInput.value = inputs.cropHeight || '';
            } catch (e) {
                console.warn('저장된 입력값을 불러오는데 실패했습니다:', e);
            }
        }
    }
}

/**
 * 페이지 로드 완료 시 앱 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new CropFocalApp();
    
    // 초기 초점거리 필드 설정
    app.updateFocalLengthFields();
    
    // 페이지 언로드 시 입력값 저장
    window.addEventListener('beforeunload', () => {
        app.saveInputsToStorage();
    });
    
    // 저장된 입력값 로드 비활성화 (기본값 없이 시작)
    // app.loadInputsFromStorage();
    
    console.log('CropFocal 앱이 초기화되었습니다.');
});