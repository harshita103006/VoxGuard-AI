import hashlib
import numpy as np


def generate_voice_fingerprint(
    features
):

    features_array = np.array(features)

    rounded_features = np.round(
        features_array,
        1
    )

    fingerprint = hashlib.sha256(
        rounded_features.tobytes()
    ).hexdigest()

    return fingerprint