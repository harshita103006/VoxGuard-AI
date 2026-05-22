def calculate_authenticity_risk(
    prediction,
    confidence,
    variance,
    metadata
):

    risk_score = 0

    # AI-generated boost
    if prediction == "AI-GENERATED":

        risk_score += 50

    # Confidence boost
    if confidence > 85:

        risk_score += 25

    # Low variance boost
    if variance < 1000:

        risk_score += 15

    # Suspicious sample rate
    if metadata["sample_rate"] < 16000:

        risk_score += 10

    risk_score = min(risk_score, 100)

    if risk_score >= 80:

        level = "CRITICAL"

    elif risk_score >= 60:

        level = "HIGH"

    elif risk_score >= 30:

        level = "MEDIUM"

    else:

        level = "LOW"

    return {
        "risk_score": risk_score,
        "risk_level": level
    }