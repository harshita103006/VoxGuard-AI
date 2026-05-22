from core.db import (
    get_connection
)


def get_threat_analytics():

    conn = get_connection()

    cursor = conn.cursor()

    total_scans = cursor.execute(
        "SELECT COUNT(*) FROM audio_threats"
    ).fetchone()[0]

    ai_generated = cursor.execute(
        """
        SELECT COUNT(*)
        FROM audio_threats
        WHERE prediction='AI-GENERATED'
        """
    ).fetchone()[0]

    real_audio = cursor.execute(
        """
        SELECT COUNT(*)
        FROM audio_threats
        WHERE prediction='REAL'
        """
    ).fetchone()[0]

    critical_risks = cursor.execute(
        """
        SELECT COUNT(*)
        FROM audio_threats
        WHERE risk_level='CRITICAL'
        """
    ).fetchone()[0]

    unique_fingerprints = cursor.execute(
        """
        SELECT COUNT(DISTINCT voice_fingerprint)
        FROM audio_threats
        """
    ).fetchone()[0]

    conn.close()

    return {
        "total_scans": total_scans,
        "ai_generated_detected": ai_generated,
        "real_audio_detected": real_audio,
        "critical_risks": critical_risks,
        "unique_voice_fingerprints": unique_fingerprints
    }