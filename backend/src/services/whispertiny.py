import torch
from transformers import pipeline

print("setting up pipeline")
whisper = pipeline("automatic-speech-recognition", model="openai/whisper-tiny.en")

def audio_to_text(file):
    """
    Converts multiform file to numpy ndarray transcription using openai whisper-tiny model
    """
    print("Transcribing...")
    transcription = whisper(file)
    return transcription["text"]


if __name__ == '__main__':
    transcribe_audio(audio_file)
