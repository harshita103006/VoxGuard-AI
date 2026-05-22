from fastapi import APIRouter, UploadFile, File
import shutil
from models.predict import (
    predict_voice
)
from core.audio_features import (
    extract_mfcc_features
)
from core.spectrogram import (
    generate_spectrogram
)
from core.audio_explanations import (
    generate_audio_explanations
)
from core.audio_metadata import (
    extract_audio_metadata
)
from core.risk_engine import (
    calculate_authenticity_risk
)
from core.audio_anomalies import (
    detect_audio_anomalies
)
from core.threat_logger import (
    log_audio_threat
)
from core.voice_fingerprint import (
    generate_voice_fingerprint
)
from core.threat_matcher import (
    check_known_threat
)
from core.audio_validator import (
    validate_audio
)
from core.confidence_calibrator import (
    calibrate_confidence
)

router = APIRouter()


@router.post("/upload-audio")
async def upload_audio(
    audio: UploadFile = File(...)
):

    file_path = f"uploads/{audio.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            audio.file,
            buffer
        )

    validation = validate_audio(
        file_path
    )
    if not validation["valid"]:

        return {
            "audio_valid": False,
            "reason": validation["reason"]
        }

    features = extract_mfcc_features(
        file_path
    )
    
    voice_fingerprint = (
        generate_voice_fingerprint(
            features
        )
    )
    print("VOICE FP:", voice_fingerprint)
    metadata = extract_audio_metadata(
        file_path
    )
    
    analysis = predict_voice(
        features
    )
    explanations = (
        generate_audio_explanations(
            analysis["prediction"],
            analysis["confidence"],
            analysis["variance"]
        )
    )
    risk_analysis = (
        calculate_authenticity_risk(
            analysis["prediction"],
             analysis["confidence"],
            analysis["variance"],
            metadata
        )
    )
    anomalies = detect_audio_anomalies(
        metadata,
        analysis["variance"]
    )
    known_match = check_known_threat(
        voice_fingerprint
    )
    calibrated_confidence = (
        calibrate_confidence(
             analysis["confidence"],
            anomalies,
            known_match,
            risk_analysis["risk_level"]
        )
    )
    print("KNOWN MATCH:", known_match)
    log_audio_threat(
        audio.filename,
        analysis["prediction"],
        analysis["confidence"],
        analysis["variance"],
        voice_fingerprint,
        risk_analysis["risk_level"]
    )
    spectrogram_path = (
        f"uploads/{audio.filename}.png"
    )

    generate_spectrogram(
        file_path,
        spectrogram_path
    )

    return {
        "message": "Audio analyzed successfully",

        "filename": audio.filename,

        "prediction": analysis["prediction"],

        "confidence": calibrated_confidence,
        "variance": analysis["variance"],

        "mfcc_feature_count": len(features),

        "spectrogram_image": spectrogram_path,

        "audio_metadata": metadata,

        "explanations": explanations,
        "anomalies": anomalies,
        "risk_analysis": risk_analysis,
        "voice_fingerprint": voice_fingerprint,
        "known_threat_match": known_match
    }