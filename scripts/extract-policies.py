"""Generate website policy content from the original PDFs; requires pypdf.

Run from the repository root. Only whitespace and bullet formatting change.
The token comparison ensures every source word is retained, in source order.
"""

import json
import re
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
DOCUMENTS = [
    ("terms", "terms-and-conditions", "Terms & Conditions", 30),
    ("privacy", "privacy-policy", "Privacy Policy", 14),
    (
        "cancellation",
        "cancellation-and-refund-policy",
        "Cancellation & Refund Policy",
        6,
    ),
]


def normalize(text):
    return " ".join(text.replace("➢", "").split())


policies = {}
for key, filename, title, section_count in DOCUMENTS:
    source = (
        ROOT / "frontend/public/documents" / f"rock-lizard-adventure-{filename}.pdf"
    )
    pages = [
        page.extract_text(extraction_mode="layout") for page in PdfReader(source).pages
    ]
    source_text = "\n\n".join(pages)
    paragraphs = [
        part.strip() for part in re.split(r"\n\s*\n", source_text) if part.strip()
    ]
    source_title = normalize(paragraphs.pop(0))
    # The title and update date can occupy one extracted paragraph.
    if "Last Updated:" in source_title:
        source_title, updated = source_title.split("Last Updated:", 1)
        source_title = source_title.strip()
        updated = updated.strip()
    else:
        updated = normalize(paragraphs.pop(0)).removeprefix("Last Updated:").strip()

    intro = []
    sections = []
    blocks = intro
    for paragraph in paragraphs:
        text = normalize(paragraph)
        if re.match(r"^\d+\. ", text):
            sections.append({"heading": text, "blocks": []})
            blocks = sections[-1]["blocks"]
        elif text == "Cancellation Period Refund":
            blocks.append(
                {
                    "type": "table",
                    "headers": ["Cancellation Period", "Refund"],
                    "rows": [],
                }
            )
        elif re.match(r"^Cancellation (?:30|between|15) ", text):
            cells = re.split(r"\s{2,}", paragraph.strip())
            assert len(cells) == 2, cells
            assert blocks[-1]["type"] == "table"
            blocks[-1]["rows"].append([normalize(cell) for cell in cells])
        elif "➢" in paragraph:
            items = [normalize(item) for item in paragraph.split("➢") if item.strip()]
            if blocks and blocks[-1]["type"] == "list":
                blocks[-1]["items"].extend(items)
            else:
                blocks.append({"type": "list", "items": items})
        elif re.match(r"^[A-E]\. ", text):
            blocks.append({"type": "subheading", "text": text})
        else:
            # Join a paragraph that continues over a PDF page boundary.
            if (
                blocks
                and blocks[-1]["type"] == "paragraph"
                and not re.search(r"[.!?:]$", blocks[-1]["text"])
            ):
                blocks[-1]["text"] += " " + text
            else:
                blocks.append({"type": "paragraph", "text": text})

    assert len(sections) == section_count, (key, len(sections))
    assert [int(section["heading"].split(".", 1)[0]) for section in sections] == list(
        range(1, section_count + 1)
    )

    def block_text(block):
        if block["type"] == "list":
            return " ".join(block["items"])
        if block["type"] == "table":
            return " ".join(
                block["headers"] + [cell for row in block["rows"] for cell in row]
            )
        return block["text"]

    reconstructed = [source_title, "Last Updated:", updated, *map(block_text, intro)]
    for section in sections:
        reconstructed += [section["heading"], *map(block_text, section["blocks"])]
    assert normalize(source_text) == normalize(" ".join(reconstructed)), (
        f"Source wording mismatch: {key}"
    )
    policies[key] = {
        "title": title,
        "lastUpdated": updated,
        "intro": intro,
        "sections": sections,
    }
    print(
        f"{key}: {len(pages)} pages, {len(sections)} sections; source wording verified"
    )

target = ROOT / "frontend/src/lib/policies/content.json"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(
    json.dumps(policies, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
