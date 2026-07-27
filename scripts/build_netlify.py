from __future__ import annotations

import base64
import hashlib
import lzma
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TRANSFER_DIR = ROOT / ".speakup-update"
OUTPUT_DIR = ROOT / "dist"
OUTPUT_FILE = OUTPUT_DIR / "index.html"

SOURCE_SIZE = 815_545
SOURCE_SHA256 = "2424a7620bc04b56775f43e52347401fefd0ef06d78f60c86620eb68f688f97b"
FINAL_SIZE = 815_696
FINAL_SHA256 = "d0f73401b835b0de2bbda891505dc4abfde90b73806424c8f3f6d1fc9ad36a28"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_verified_source() -> bytes:
    checksum_file = TRANSFER_DIR / "SHA256SUMS"
    if not checksum_file.exists():
        raise RuntimeError("SpeakUP transfer manifest is missing")

    expected: dict[str, str] = {}
    for line in checksum_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        digest, filename = line.split(maxsplit=1)
        expected[filename.strip()] = digest

    parts = sorted(TRANSFER_DIR.glob("part-*"))
    if len(parts) != 16:
        raise RuntimeError(f"Expected 16 SpeakUP build parts, found {len(parts)}")

    encoded_parts: list[str] = []
    for part in parts:
        data = part.read_bytes()
        wanted = expected.get(part.name)
        if not wanted or sha256(data) != wanted:
            raise RuntimeError(f"Integrity check failed for {part.name}")
        encoded_parts.append(data.decode("ascii").strip())

    compressed = base64.b64decode("".join(encoded_parts), validate=True)
    source = lzma.decompress(compressed)

    if len(source) != SOURCE_SIZE or sha256(source) != SOURCE_SHA256:
        raise RuntimeError("The assembled SpeakUP source does not match the verified corrected build")
    return source


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def apply_fillgap_native_audio_fix(source: bytes) -> bytes:
    text = source.decode("utf-8")

    fill_start = text.index("function FillGapMode({ sentence, settings, onSolved, onMenu })")
    fill_end = text.index('define("screens/MemoryMode"', fill_start)
    fill = text[fill_start:fill_end]

    fill = replace_once(
        fill,
        """            });
        }, [sentence, settings.language, settings.audioOn, settings.sentenceAudioOn, settings.gapAudioStyle]);""",
        """            });
            return () => (0, speech_js_3.stopSpeaking)();
        }, [sentence, settings.language, settings.audioOn, settings.sentenceAudioOn, settings.gapAudioStyle]);""",
        "FillGap speech cleanup",
    )
    fill = replace_once(
        fill,
        "onComplete: () => onSolved(sentence)",
        "onComplete: () => { (0, speech_js_3.stopSpeaking)(); onSolved(sentence); }",
        "FillGap completion handoff",
    )
    text = text[:fill_start] + fill + text[fill_end:]

    translation_start = text.index("function TranslationScreen({ item, nativeLanguage")
    translation_end = text.index('define("components/EffectLayer"', translation_start)
    translation = text[translation_start:translation_end]

    translation = replace_once(
        translation,
        "if (!audioOn || !text || !language) {",
        "if (!audioOn || !translationAudioOn || !text || !language) {",
        "translation audio setting",
    )
    translation = replace_once(
        translation,
        """            audioOn,
            clearLocalTimers,""",
        """            audioOn,
            translationAudioOn,
            clearLocalTimers,""",
        "translation audio dependency",
    )
    text = text[:translation_start] + translation + text[translation_end:]

    learning_mapping = (
        "item: translationItem || current, nativeLanguage: nativeLanguage, "
        "learningLanguage: language, audioOn: audioOn"
    )
    if text.count(learning_mapping) != 1:
        raise RuntimeError("The FillGap translation page is not receiving the selected learning language")

    fixed = text.encode("utf-8")
    if len(fixed) != FINAL_SIZE or sha256(fixed) != FINAL_SHA256:
        raise RuntimeError("The final FillGap audio build failed its exact integrity check")

    required_markers = (
        "return () => (0, speech_js_3.stopSpeaking)();",
        "onComplete: () => { (0, speech_js_3.stopSpeaking)(); onSolved(sentence); }",
        "if (!audioOn || !translationAudioOn || !text || !language) {",
        "playReading('native')",
    )
    for marker in required_markers:
        if marker not in text:
            raise RuntimeError(f"Missing final audio marker: {marker}")

    return fixed


def main() -> None:
    source = load_verified_source()
    fixed = apply_fillgap_native_audio_fix(source)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_bytes(fixed)
    print(f"Built verified SpeakUP: {OUTPUT_FILE} ({len(fixed)} bytes, {sha256(fixed)})")


if __name__ == "__main__":
    main()
