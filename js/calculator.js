/**
 * 카메라 센서 크기 정보 (mm 단위)
 */
const SENSOR_SIZES = {
    'medium-format': { width: 43.8, height: 32.9, name: '중형 포맷', cropFactor: 0.79 },
    fullframe: { width: 36, height: 24, name: '풀프레임', cropFactor: 1.0 },
    apsc: { width: 23.6, height: 15.6, name: 'APS-C', cropFactor: 1.5 },
    'apsc-canon': { width: 22.2, height: 14.8, name: 'APS-C (캐논)', cropFactor: 1.6 },
    micro43: { width: 17.3, height: 13, name: '마이크로 포서드', cropFactor: 2.0 },
    '1inch': { width: 13.2, height: 8.8, name: '1인치', cropFactor: 2.7 }
};

/**
 * 크롭 팩터 계산 클래스
 */
class CropCalculator {
    constructor() {
        this.sensorType = 'fullframe';
        this.originalFocalLength = 0;
        this.originalEquivalentFocalLength = 0;
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.cropWidth = 0;
        this.cropHeight = 0;
    }

    /**
     * 입력값 설정
     */
    setInputs(sensorType, focalLength, equivalentFocalLength, origWidth, origHeight, cropWidth, cropHeight) {
        this.sensorType = sensorType;
        this.originalFocalLength = parseFloat(focalLength) || 0;
        this.originalEquivalentFocalLength = parseFloat(equivalentFocalLength) || 0;
        this.originalWidth = parseInt(origWidth);
        this.originalHeight = parseInt(origHeight);
        this.cropWidth = parseInt(cropWidth);
        this.cropHeight = parseInt(cropHeight);
    }

    /**
     * 입력값 검증
     */
    validateInputs() {
        const errors = [];

        // 풀프레임이 아닌 경우 실제 초점거리나 환산 초점거리 중 하나는 있어야 함
        if (this.sensorType === 'fullframe') {
            if (!this.originalFocalLength || this.originalFocalLength <= 0) {
                errors.push('원본 렌즈 초점거리를 올바르게 입력해주세요.');
            }
        } else {
            if ((!this.originalFocalLength || this.originalFocalLength <= 0) && 
                (!this.originalEquivalentFocalLength || this.originalEquivalentFocalLength <= 0)) {
                errors.push('실제 초점거리 또는 35mm 환산 초점거리 중 하나를 입력해주세요.');
            }
        }

        if (!this.originalWidth || this.originalWidth <= 0) {
            errors.push('원본 사진 가로 해상도를 올바르게 입력해주세요.');
        }

        if (!this.originalHeight || this.originalHeight <= 0) {
            errors.push('원본 사진 세로 해상도를 올바르게 입력해주세요.');
        }

        if (!this.cropWidth || this.cropWidth <= 0) {
            errors.push('크롭된 사진 가로 해상도를 올바르게 입력해주세요.');
        }

        if (!this.cropHeight || this.cropHeight <= 0) {
            errors.push('크롭된 사진 세로 해상도를 올바르게 입력해주세요.');
        }

        if (this.cropWidth > this.originalWidth) {
            errors.push('크롭된 사진의 가로 해상도가 원본보다 클 수 없습니다.');
        }

        if (this.cropHeight > this.originalHeight) {
            errors.push('크롭된 사진의 세로 해상도가 원본보다 클 수 없습니다.');
        }

        return errors;
    }

    /**
     * 대각선 길이 계산
     */
    calculateDiagonal(width, height) {
        return Math.sqrt(width * width + height * height);
    }

    /**
     * 크롭 팩터 계산 (대각선 기준)
     */
    calculateCropFactor() {
        const originalDiagonal = this.calculateDiagonal(this.originalWidth, this.originalHeight);
        const cropDiagonal = this.calculateDiagonal(this.cropWidth, this.cropHeight);
        return originalDiagonal / cropDiagonal;
    }

    /**
     * 수평/수직 크롭 팩터 계산
     */
    calculateHorizontalCropFactor() {
        return this.originalWidth / this.cropWidth;
    }

    calculateVerticalCropFactor() {
        return this.originalHeight / this.cropHeight;
    }

    /**
     * 센서의 35mm 환산 크롭 팩터 가져오기
     */
    getSensorCropFactor() {
        return SENSOR_SIZES[this.sensorType].cropFactor;
    }

    /**
     * 실제 초점거리에서 35mm 환산 초점거리 계산
     */
    actualToEquivalent(actualFocalLength) {
        return actualFocalLength * this.getSensorCropFactor();
    }

    /**
     * 35mm 환산 초점거리에서 실제 초점거리 계산
     */
    equivalentToActual(equivalentFocalLength) {
        return equivalentFocalLength / this.getSensorCropFactor();
    }

    /**
     * 원본 실제 초점거리 가져오기 (입력값 정규화)
     */
    getOriginalActualFocalLength() {
        if (this.originalFocalLength > 0) {
            return this.originalFocalLength;
        } else if (this.originalEquivalentFocalLength > 0) {
            return this.equivalentToActual(this.originalEquivalentFocalLength);
        }
        return 0;
    }

    /**
     * 원본 35mm 환산 초점거리 가져오기 (입력값 정규화)
     */
    getOriginalEquivalentFocalLength() {
        if (this.sensorType === 'fullframe') {
            return this.originalFocalLength;
        }
        
        if (this.originalEquivalentFocalLength > 0) {
            return this.originalEquivalentFocalLength;
        } else if (this.originalFocalLength > 0) {
            return this.actualToEquivalent(this.originalFocalLength);
        }
        return 0;
    }

    /**
     * 크롭 후 실제 초점거리 계산
     */
    calculateCropActualFocalLength() {
        const originalActual = this.getOriginalActualFocalLength();
        const imageCropFactor = this.calculateCropFactor();
        return originalActual * imageCropFactor;
    }

    /**
     * 크롭 후 35mm 환산 초점거리 계산
     */
    calculateCropEquivalentFocalLength() {
        const originalEquivalent = this.getOriginalEquivalentFocalLength();
        const imageCropFactor = this.calculateCropFactor();
        return originalEquivalent * imageCropFactor;
    }

    /**
     * 크롭 비율 계산
     */
    calculateCropRatio() {
        const originalArea = this.originalWidth * this.originalHeight;
        const cropArea = this.cropWidth * this.cropHeight;
        return (cropArea / originalArea) * 100;
    }

    /**
     * 전체 계산 수행
     */
    calculate() {
        const errors = this.validateInputs();
        if (errors.length > 0) {
            return { success: false, errors };
        }

        const cropFactor = this.calculateCropFactor();
        const horizontalCropFactor = this.calculateHorizontalCropFactor();
        const verticalCropFactor = this.calculateVerticalCropFactor();
        const cropActualFocalLength = this.calculateCropActualFocalLength();
        const cropEquivalentFocalLength = this.calculateCropEquivalentFocalLength();
        const cropRatio = this.calculateCropRatio();

        const sensorInfo = SENSOR_SIZES[this.sensorType];
        const originalDiagonal = this.calculateDiagonal(this.originalWidth, this.originalHeight);
        const cropDiagonal = this.calculateDiagonal(this.cropWidth, this.cropHeight);

        return {
            success: true,
            results: {
                cropActualFocalLength: Math.round(cropActualFocalLength * 10) / 10,
                cropEquivalentFocalLength: Math.round(cropEquivalentFocalLength * 10) / 10,
                cropFactor: Math.round(cropFactor * 100) / 100,
                horizontalCropFactor: Math.round(horizontalCropFactor * 100) / 100,
                verticalCropFactor: Math.round(verticalCropFactor * 100) / 100,
                cropRatio: Math.round(cropRatio * 10) / 10
            },
            details: {
                sensorInfo,
                originalDiagonal: Math.round(originalDiagonal),
                cropDiagonal: Math.round(cropDiagonal),
                originalAspectRatio: Math.round((this.originalWidth / this.originalHeight) * 100) / 100,
                cropAspectRatio: Math.round((this.cropWidth / this.cropHeight) * 100) / 100
            }
        };
    }

    /**
     * 계산 과정 설명 생성
     */
    generateCalculationSteps(results, details) {
        const steps = [];
        
        steps.push(`센서 타입: ${details.sensorInfo.name} (${details.sensorInfo.width}×${details.sensorInfo.height}mm)`);
        steps.push(`원본 사진: ${this.originalWidth}×${this.originalHeight} 픽셀`);
        steps.push(`크롭 사진: ${this.cropWidth}×${this.cropHeight} 픽셀`);
        steps.push(`원본 렌즈: ${this.originalFocalLength}mm`);
        steps.push('');
        
        steps.push('계산 과정:');
        steps.push(`1. 원본 대각선 = √(${this.originalWidth}² + ${this.originalHeight}²) = ${details.originalDiagonal} 픽셀`);
        steps.push(`2. 크롭 대각선 = √(${this.cropWidth}² + ${this.cropHeight}²) = ${details.cropDiagonal} 픽셀`);
        steps.push(`3. 크롭 팩터 = ${details.originalDiagonal} ÷ ${details.cropDiagonal} = ${results.cropFactor}`);
        steps.push(`4. 등가 초점거리 = ${this.originalFocalLength}mm × ${results.cropFactor} = ${results.equivalentFocalLength}mm`);
        steps.push('');
        
        steps.push('추가 정보:');
        steps.push(`- 수평 크롭 팩터: ${results.horizontalCropFactor}`);
        steps.push(`- 수직 크롭 팩터: ${results.verticalCropFactor}`);
        steps.push(`- 원본 화면비: ${details.originalAspectRatio}:1`);
        steps.push(`- 크롭 화면비: ${details.cropAspectRatio}:1`);
        steps.push(`- 크롭된 면적: 원본의 ${results.cropRatio}%`);
        
        return steps.join('\n');
    }
}