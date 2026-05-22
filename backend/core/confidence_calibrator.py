def calibrate_confidence(
    confidence,
    anomalies,
    known_match,
    risk_level
):

    calibrated = confidence

    # Known threat boost
    if known_match:

        calibrated += 5

    # Multiple anomalies boost
    if len(anomalies) >= 2:

        calibrated += 5

    # Critical risk boost
    if risk_level == "CRITICAL":

        calibrated += 5

    # Safety cap
    calibrated = min(calibrated, 99)

    return round(calibrated, 2)