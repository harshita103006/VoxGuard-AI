import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

def generate_spectrogram(
    audio_path: str,
    output_path: str
):

    y, sr = librosa.load(
        audio_path,
        sr=None
    )

    plt.figure(figsize=(10, 4))

    spectrogram = librosa.feature.melspectrogram(
        y=y,
        sr=sr
    )

    spectrogram_db = librosa.power_to_db(
        spectrogram,
        ref=np.max
    )

    librosa.display.specshow(
        spectrogram_db,
        sr=sr,
        x_axis="time",
        y_axis="mel"
    )

    plt.colorbar(format="%+2.0f dB")

    plt.title("Mel Spectrogram")

    plt.tight_layout()

    plt.savefig(output_path)

    plt.close()