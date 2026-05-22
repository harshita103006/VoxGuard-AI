from core.db import (
    get_connection
)


def check_known_threat(
    fingerprint
):

    conn = get_connection()

    cursor = conn.cursor()

    result = cursor.execute(
        """
        SELECT *
        FROM audio_threats
        WHERE voice_fingerprint=?
        """,
        (fingerprint,)
    ).fetchall()

    conn.close()

    return len(result) > 0