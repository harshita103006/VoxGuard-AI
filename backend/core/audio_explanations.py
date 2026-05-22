def generate_audio_explanations(
    prediction,
    confidence,
    variance
):

    explanations = []

    if prediction == "AI-GENERATED":

        explanations.append(
            "Voice patterns resemble synthetic speech"
        )

        if variance < 1000:

            explanations.append(
                "Low spectral variance detected"
            )

        if confidence > 85:

            explanations.append(
                "Model confidence is extremely high"
            )

    else:

        explanations.append(
            "Natural voice fluctuations detected"
        )

        if variance > 1000:

            explanations.append(
                "Human-like spectral diversity observed"
            )

    return explanations