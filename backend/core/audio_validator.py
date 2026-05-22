import librosa
import numpy as np


def validate_audio(
    audio_path
):

    try:

        y, sr = librosa.load(
            audio_path,
            sr=None
        )

        duration = librosa.get_duration(
            y=y,
            sr=sr
        )

        # Empty/silent audio
        if np.abs(y).mean() < 0.001:

            return {
                "valid": False,
                "reason": "Silent or empty audio detected"
            }

        # Too short
        if duration < 1:

            return {
                "valid": False,
                "reason": "Audio duration too short"
            }

        return {
            "valid": True,
            "reason": "Audio validation passed"
        }

    except Exception:

        return {
            "valid": False,
            "reason": "Corrupted or unsupported audio"
        }