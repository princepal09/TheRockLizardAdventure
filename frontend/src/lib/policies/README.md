# Website policy content

`content.json` contains the full wording of the Terms & Conditions, Privacy Policy
and Cancellation & Refund Policy in `frontend/public/documents`. `PolicyLink`
renders this content in a shared modal implementation; policy buttons do not
navigate to or download the source PDFs.

When replacing a source policy PDF, regenerate the website content from the
repository root using Python with `pypdf` installed:

```sh
python scripts/extract-policies.py
```

The generator verifies section numbering (30 terms, 14 privacy, 6 cancellation)
and compares every source word in order against the generated content. Review
section-count changes intentionally if a future policy adds or removes sections.
Only whitespace and bullet/table formatting are changed. Review the rendered
modal after regeneration, especially the cancellation table and page boundaries.

Medical and declaration forms are separate participant forms and retain their
download behavior.
