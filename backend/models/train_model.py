import os
import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier

import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from core.audio_features import (
    extract_mfcc_features
)

X = []
y = []

REAL_DIR = "dataset/real"
FAKE_DIR = "dataset/fake"


# REAL AUDIO
for file in os.listdir(REAL_DIR):

    path = f"{REAL_DIR}/{file}"

    features = extract_mfcc_features(path)

    X.append(features)

    y.append(0)


# FAKE AUDIO
for file in os.listdir(FAKE_DIR):

    path = f"{FAKE_DIR}/{file}"

    features = extract_mfcc_features(path)

    X.append(features)

    y.append(1)


X = np.array(X)
y = np.array(y)


model = RandomForestClassifier(
    n_estimators=100
)

model.fit(X, y)

joblib.dump(
    model,
    "deepfake_model.pkl"
)

print("Model trained successfully 😄🔥")