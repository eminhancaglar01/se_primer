"""Hugging Face Hub Model Publication Script for The Primer v2.

Publishes trained ONNX model and config.json to Hugging Face Hub with commit-pinned URLs.
Security: HF_TOKEN must be provided via environment variable or CLI argument. Never hardcode tokens.
"""

import os
import sys
import argparse
import json
from pathlib import Path

try:
    from huggingface_hub import HfApi, create_repo
    HAS_HF_HUB = True
except ImportError:
    HAS_HF_HUB = False
    import urllib.request


def publish_model(repo_id: str, token: str, model_dir: Path, tag: str = "v2.0") -> dict:
    if not HAS_HF_HUB:
        print("[!] huggingface_hub paketi kurulu değil. 'pip install huggingface_hub' çalıştırılıyor...")
        os.system("pip install huggingface_hub")
        from huggingface_hub import HfApi, create_repo

    api = HfApi(token=token)

    print(f"[*] Hugging Face deposu doğrulanıyor: {repo_id}")
    try:
        create_repo(repo_id=repo_id, token=token, repo_type="model", exist_ok=True, private=False)
        print(f"[+] Depo hazır: https://huggingface.co/{repo_id}")
    except Exception as e:
        print(f"[!] Depo kontrolünde uyarı: {e}")

    files_to_upload = [
        model_dir / "model.onnx",
        model_dir / "config.json",
        model_dir / "README.md",
    ]

    for f in files_to_upload:
        if not f.exists():
            raise FileNotFoundError(f"Yayınlanacak dosya bulunamadı: {f}")

    print(f"[*] Dosyalar yükleniyor (Sürüm: {tag})...")
    commit_info = api.upload_folder(
        folder_path=str(model_dir),
        repo_id=repo_id,
        repo_type="model",
        commit_message=f"Release {tag}: DecisionTree support-need classifier ONNX artifact",
    )

    commit_hash = commit_info.oid if hasattr(commit_info, "oid") else "main"
    print(f"[+] Yükleme başarılı! Commit Hash: {commit_hash}")

    pinned_onnx_url = f"https://huggingface.co/{repo_id}/resolve/{commit_hash}/model.onnx"
    pinned_config_url = f"https://huggingface.co/{repo_id}/resolve/{commit_hash}/config.json"

    result = {
        "repo_id": repo_id,
        "tag": tag,
        "commit_hash": commit_hash,
        "pinned_onnx_url": pinned_onnx_url,
        "pinned_config_url": pinned_config_url,
    }

    out_file = model_dir / "hf_deployment.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"[+] Yayın metaverisi kaydedildi: {out_file}")
    print("\n" + "=" * 60)
    print("SABİT COMMIT (PINNED) MODEL URL'LERİ:")
    print(f"ONNX Model:  {pinned_onnx_url}")
    print(f"Model Config: {pinned_config_url}")
    print("=" * 60 + "\n")
    return result


def main():
    parser = argparse.ArgumentParser(description="Publish The Primer v2 model to Hugging Face Hub")
    parser.add_argument("--repo", type=str, help="Hugging Face repo ID (örn: kullanici_adi/se-primer-v2)")
    parser.add_argument("--token", type=str, default=os.getenv("HF_TOKEN"), help="Hugging Face User Access Token (Write yetkili)")
    parser.add_argument("--tag", type=str, default="v2.0", help="Sürüm etiketi")

    args = parser.parse_args()

    if not args.token:
        print("\n[HATA] Hugging Face Access Token bulunamadı!")
        print("Lütfen token'ınızı bir çevre değişkeni olarak ayarlayın veya parametre olarak verin:")
        print("PowerShell: $env:HF_TOKEN = 'hf_xxxxxxxxxxxx'")
        print("Veya: python scripts/publish_hf.py --repo KULLANICI/REPO --token hf_xxxxxxxxxxxx")
        print("\nToken almak için: https://huggingface.co/settings/tokens (Role: Write)")
        sys.exit(1)

    if not args.repo:
        print("\n[HATA] Depo ID belirtilmedi! Lütfen '--repo kullanici/repo-adi' girin.")
        sys.exit(1)

    model_dir = Path(__file__).resolve().parent.parent / "model"
    publish_model(repo_id=args.repo, token=args.token, model_dir=model_dir, tag=args.tag)


if __name__ == "__main__":
    main()

