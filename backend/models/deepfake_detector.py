import numpy as np


def detect_deepfake(features):

    mean_feature = np.mean(features)

    variance = np.var(features)

    # Simple heuristic logic
    if variance < 500:

        prediction = "AI-GENERATED"

        confidence = 82

    else:

        prediction = "REAL"

        confidence = 76

    return {
        "prediction": prediction,
        "confidence": confidence,
        "mean_feature": round(
            float(mean_feature),
            2
        ),
        "variance": round(
            float(variance),
            2
        )
    }