import librosa
import numpy as np


def extract_mfcc_features(
    audio_path: str
):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    mfccs = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=40
    )

    mfccs_mean = np.mean(
        mfccs.T,
        axis=0
    )

    return mfccs_mean.tolist()