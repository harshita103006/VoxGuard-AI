from core.db import (
    get_connection
)


def log_audio_threat(
    filename,
    prediction,
    confidence,
    variance,
    voice_fingerprint,
    risk_level
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO audio_threats(
            filename,
            prediction,
            confidence,
            variance,
            voice_fingerprint,
            risk_level
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            filename,
            prediction,
            confidence,
            variance,
            voice_fingerprint,
            risk_level
        )
    )

    conn.commit()

    conn.close()