import joblib
import numpy as np


model = joblib.load(
    "deepfake_model.pkl"
)


def predict_voice(features):

    features = np.array(features).reshape(1, -1)

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(
        features
    )[0]

    confidence = round(
        max(probabilities) * 100,
        2
    )

    label = (
        "AI-GENERATED"
        if prediction == 1
        else "REAL"
    )

    return {
        "prediction": label,
        "confidence": confidence,
        "variance": round(
            float(np.var(features)),
            2
        )
    }