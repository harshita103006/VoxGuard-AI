def detect_audio_anomalies(
    metadata,
    variance
):

    anomalies = []

    # Very short audio
    if metadata["duration_seconds"] < 2:

        anomalies.append(
            "Audio duration unusually short"
        )

    # Low sample rate
    if metadata["sample_rate"] < 16000:

        anomalies.append(
            "Low sample rate detected"
        )

    # Flat spectral variance
    if variance < 500:

        anomalies.append(
            "Potential synthetic waveform consistency"
        )

    # Extremely large files
    if metadata["total_samples"] > 1000000:

        anomalies.append(
            "Unusually large audio sample detected"
        )

    return anomalies