import librosa


def extract_audio_metadata(
    audio_path: str
):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    duration = librosa.get_duration(
        y=y,
        sr=sr
    )

    return {
        "duration_seconds": round(
            duration,
            2
        ),
        "sample_rate": sr,
        "total_samples": len(y)
    }